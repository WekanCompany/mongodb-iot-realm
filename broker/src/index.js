'use strict';

const express = require('express');
const Realm = require('realm');
const configurationSchema = require('./models/configuration');
const realmEmitter = require('./middleware/mqemitter-realm');
const sensorSchema = require('./models/sensor');
const utils = require('./utils');

const app = express();
app.disable('x-powered-by');

const main = async () => {
  try {
    const edgeId = process.env.EDGE_ID;
    /** Initialize the Realm app */
    const realmApp = new Realm.App(process.env.REALM_APP_ID);

    const realmUser = await utils.realm.loginEmailPassword(
      realmApp,
      process.env.REALM_EMAIL,
      process.env.REALM_PASSWORD
    );

    const config = {
      sync: {
        user: realmUser,
        partitionValue: null,
      },
      schema: [configurationSchema.edge, configurationSchema.sensor],
    };
    /** Open Realm synchronously */
    const realm = await Realm.open(config);

    const edgeConfiguration = utils.realm.getEdgeConfiguration(realm, edgeId);

    const aedes = require('aedes')({
      mq: realmEmitter({
        realmUser: realmUser,
        /** Defines schema of the collection to which the transformed messages are saved. */
        schema: sensorSchema,
        /** Middleware only intercepts messages from the provided topics */
        topics: [
          {
            name: 'dht/temperature',
            partitionValue: 'sensorType=temperature',
            handler: (payload) =>
              utils.handlers.temperature(payload, edgeId, edgeConfiguration),
          },
          {
            name: 'dht/humidity',
            partitionValue: 'sensorType=humidity',
            handler: (payload) =>
              utils.handlers.humidity(payload, edgeId, edgeConfiguration),
          },
        ],
        compactionThreshold: edgeConfiguration[0].compactSize,
        compactionInterval: process.env.COMPACTION_INTERVAL,
        /**
         * The duration incoming messages are held in memory before being bulk written into Realm
         *
         * Defined in seconds
         */
        messageSyncInterval: process.env.MESSAGE_SYNC_INTERVAL,
      }),
    });

    const broker = new utils.Broker(aedes);
    const brokerPort = 1883;
    broker.start(brokerPort);

    return [
      realm,
      edgeId,
      broker,
      brokerPort,
      process.env.UPDATE_BASE_URL,
      process.env.UPDATE_CHECK_INTERVAL,
    ];
  } catch (error) {
    throw new Error('Failed to initialize the aedes broker');
  }
};

main()
  .then((result) => {
    const endpointPort = 3000;

    /** Setup health check endpoint */
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'green' });
    });

    app.listen(endpointPort, () => {
      console.log('Server up and listening on port', endpointPort);
    });

    utils.updater.start(...result);
  })
  .catch((error) => console.log(error));
