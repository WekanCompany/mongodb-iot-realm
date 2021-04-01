'use strict';

const result = require('dotenv').config()

if(result.error) {
  console.error(result.error)
    process.exit(0)  
}

if(!process.env.REALM_APP_ID || 
  !process.env.REALM_EMAIL || 
  !process.env.REALM_PASSWORD) {
    console.error('Provide update the .env file with the Realm configuration')
    process.exit(0)
}

const express = require('express');
const Realm = require('realm');
const configurationSchema = require('./models/configuration');
const realmEmitter = require('./middleware/mqemitter-realm');
const sensorSchema = require('./models/sensor');
const utils = require('./utils');

const app = express();
app.disable('x-powered-by');

if(!process.env.REALM_APP_ID || 
  !process.env.REALM_EMAIL || 
  !process.env.REALM_PASSWORD) {
    console.log('Provide update the .env file with the Realm configuration')
    process.exit(0)
}

const main = async () => {
  try {
    const realmAppId = process.env.REALM_APP_ID;
    const realmEmail = process.env.REALM_EMAIL;
    const realmPassword = process.env.REALM_PASSWORD;
    
    const edgeId = process.env.EDGE_ID || 'edge-1';
    const compactionCheckInterval = process.env.COMPACTION_CHECK_INTERVAL || 60; // Seconds
    const compactionThreshold = process.env.COMPACTION_THRESHOLD || 100; // MiB
    const messageSyncInterval = process.env.MESSAGE_SYNC_INTERVAL || 5; // Seconds

    /** Initialize the Realm app */
    const realmApp = new Realm.App(realmAppId);

    const realmUser = await utils.realm.loginEmailPassword(
      realmApp,
      realmEmail,
      realmPassword
    );

    const config = {
      sync: {
        user: realmUser,
        partitionValue: null,
      },
      schema: [configurationSchema.edge, configurationSchema.sensor],
    };

    await Realm.open(config);

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
              utils.handlers.temperature(payload, edgeId),
          },
          {
            name: 'dht/humidity',
            partitionValue: 'sensorType=humidity',
            handler: (payload) =>
              utils.handlers.humidity(payload, edgeId),
          },
        ],
        compactionThreshold: compactionThreshold,
        compactionCheckInterval: compactionCheckInterval,
        /**
         * Incoming messages are held in memory for this duration before they are
         * bulk written into Realm.
         *
         * Defined in seconds
         */
        messageSyncInterval: messageSyncInterval,
      }),
    });

    const broker = new utils.Broker(aedes);
    const brokerPort = 1883;
    
    broker.start(brokerPort);
  } catch (error) {
    throw new Error((error && error.message) ? error.message : 'Failed to initialize the aedes broker');
  }
};

main()
  .then(() => {
    const endpointPort = 3000;

    /** Setup health check endpoint */
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'green' });
    });

    app.listen(endpointPort, () => {
      console.log('Server up and listening on port', endpointPort);
    });
  })
  .catch((error) => console.error(error));
