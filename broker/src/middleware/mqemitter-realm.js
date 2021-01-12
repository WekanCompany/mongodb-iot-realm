'use strict';

const fs = require('fs');
const events = require('events');
const inherits = require('inherits');
const MQEmitter = require('mqemitter');
const Realm = require('realm');

const LOG_PREFIX = 'MQEmitter-Realm';

const eventEmitter = new events.EventEmitter();
const SYNC_MESSAGES = 'sync_message';

eventEmitter.on(SYNC_MESSAGES, syncMessages);

function RealmEmitter(opts) {
  if (!(this instanceof RealmEmitter)) {
    return new RealmEmitter(opts);
  }

  this._schemaName = '';
  this._topics = [];
  this._partitionValues = [];
  this._handlers = [];
  this._realms = {};
  /** Holds incoming messages */
  this._messages = [];
  /** 
   Whenever a configured topic receives a message, we calculate the difference 
   between the current and the last sync timestamp. If the difference exceeds 
   this value, we trigger the SYNC_MESSAGES event, which calls syncMessages
  
   Defined in seconds. Defaults to 5 seconds
   */
  this._syncInterval = 5;
  this._lastSyncTimestamp = Date.now();
  /**
   Instead of running syncMessages every few seconds via setInterval, 
   we trigger it in the emit method.

   Since we could end up with unsynced messages if clients stop sending
   messages to the configured topics, we use setInterval to call syncMessages 
   at longer intervals to sync the remaining messages
  
   Defined in seconds. Defauts to 1 minute
   */
  this._cleanupInterval = 60;
  /**
   * This interval is set to the compact function to check the size of the
   * realm file and compacts it if exceeds threshold.
   *
   * Defined in seconds. Defaults to 60 minutes.
   */
  this._compactionInterval = 60 * 60;
  /** Defined in MiB */
  this._compactionThreshold = 25;
  /**
   * This boolean ensures the compaction is taking place. But default it is set to False.
   * Checking this boolean true makes the realm write to stop and hold on the in memory array.
   */
  this._isCompacting = false;

  process.on('SIGTERM', this.triggerSync);

  if (opts && opts.realmUser && opts.schema && opts.topics) {
    if (opts.compactionThreshold) {
      this._compactionThreshold = opts.compactionThreshold;
    }
    if (opts._compactionInterval) {
      this._compactionInterval = opts.compactionInterval;
    }
    if (opts.messageSyncInterval) {
      this._syncInterval = opts.messageSyncInterval;
    }

    const config = {};

    this._schemaName = opts.schema.name;

    config.sync = { user: opts.realmUser };

    for (let i = 0; i < opts.topics.length; i += 1) {
      this._topics.push(opts.topics[i].name);
      this._partitionValues.push(opts.topics[i].partitionValue);
      this._handlers.push(opts.topics[i].handler);
    }

    if (opts.compactionThreshold) {
      this._compactionThreshold = opts.compactionThreshold;
    }

    config.shouldCompactOnLaunch = (totalSize, usedSize) => {
      const compact = usedSize > this._compactionThreshold;
      console.log(
        `[${LOG_PREFIX}] Should compact? - ${compact}, ` +
          `Realm used size: ${usedSize / 1e6} mb, ` +
          `Compaction threshold: ${this._compactionThreshold} mb`
      );
      return compact;
    };

    config.schema = [opts.schema];

    for (let i = 0; i < this._partitionValues.length; i += 1) {
      const partitionValue = this._partitionValues[i];
      config.sync.partitionValue = partitionValue;
      this._realms[partitionValue] = new Realm(config);
    }

    this.startCompaction();
    this.startCleanup();
  }

  MQEmitter.call(this, opts);
}

RealmEmitter.prototype.emit = function emit(message, cb) {
  cb = cb || noop;

  if (this.closed) {
    return cb(new Error(`[${LOG_PREFIX}] mqemitter is closed`));
  }

  try {
    if (this._topics.includes(message.topic)) {
      const timestamp = Date.now();

      this._messages.push(message);

      if (
        !this._isCompacting &&
        (timestamp - this._lastSyncTimestamp) * 0.001 > this._syncInterval
      ) {
        this.triggerSync();
        this._messages = [];
        this._lastSyncTimestamp = timestamp;
      }
    }
  } catch (error) {
    console.log(`[${LOG_PREFIX}] Emit messages failed`, error);
  }

  /**
   * The above was just a hook to capture the message, now we pass it on to
   * the real emitter so it can be passed on to other subscribers
   */
  MQEmitter.prototype.emit.call(this, message, cb);
  return this;
};

RealmEmitter.prototype.close = function close(cb) {
  for (let i = 0; i < this._partitionValues.length; i += 1) {
    this._realms[this._partitionValues[i]].removeAllListeners();
    this._realms[this._partitionValues[i]].close();
  }

  this.closed = true;
  setImmediate(cb);
  return this;
};

RealmEmitter.prototype.startCompaction = function startCompaction() {
  this._compactionpIntervalInstance = setInterval(() => {
    for (let i = 0; i < this._partitionValues.length; i += 1) {
      const partitionValue = String(this._partitionValues[i]);

      const stats = fs.statSync(this._realms[partitionValue].path);
      const currentSize = stats.size;
      const thresholdInBytes = this._compactionThreshold * 1e6;

      console.log(
        `[${LOG_PREFIX}] ` +
          `Current Realm Size in Bytes: ${currentSize}, ` +
          `Configured Threshold in Bytes: ${thresholdInBytes}`
      );

      if (currentSize >= thresholdInBytes) {
        console.log(`[${LOG_PREFIX}] Compacting realm ...`);

        try {
          this._isCompacting = true;
          clearInterval(this._cleanupIntervalInstance);

          this._realms[partitionValue].compact();
          console.log(`[${LOG_PREFIX}] Compaction completed`);

          this._isCompacting = false;
          this.startCleanup();
        } catch (error) {
          console.log(`[${LOG_PREFIX}] Failed compaction`, error);
        }
      }
    }
  }, this._compactionInterval * 1000);
};

RealmEmitter.prototype.startCleanup = function startCleanup() {
  this._cleanupIntervalInstance = setInterval(
    () => this.triggerSync(),
    this._cleanupInterval * 1000
  );
};

RealmEmitter.prototype.triggerSync = function triggerSync() {
  eventEmitter.emit(
    SYNC_MESSAGES,
    this._realms,
    this._messages,
    this._topics,
    this._partitionValues,
    this._handlers,
    this._schemaName
  );
};

inherits(RealmEmitter, MQEmitter);

function prepareBulkWrite(realm, messages, topic, handler, schemaName) {
  let payload = '';
  for (const message of messages) {
    if (message.topic === topic) {
      payload = handler(message.payload);
      realm.create(schemaName, payload);
    }
  }
}

function syncMessages(
  realms,
  messages,
  topics,
  partitionValues,
  handlers,
  schemaName
) {
  try {
    for (let i = 0; i < partitionValues.length; i += 1) {
      const realm = realms[partitionValues[i]];
      if (realm && messages.length > 0) {
        realm.write(() =>
          prepareBulkWrite(realm, messages, topics[i], handlers[i], schemaName)
        );
      }
    }
  } catch (error) {
    console.log(`[${LOG_PREFIX}] Sync messages failed`, error);
  }
}

function noop() {}

module.exports = RealmEmitter;
