# Realm IOT

## Overview

A vanilla version of the reference application that provides a basic aedes broker and a mock client to quickly try out Realm Sync

## Getting Started

### MongoDB setup

With docker installed, we need to setup our Realm app on atlas before starting up the services.

- First, we need to setup a cluster on MongoDB Atlas
- [Create a Realm App on Atlas](https://docs.mongodb.com/realm/get-started/create-realm-app) and link it to the cluster
- [Create a user to access the Realm](https://docs.mongodb.com/realm/users/create)
- Setup schemas for the collections
- Configure Realm Sync with an optional partition key

The final step is to fill in the realm details in the .env file in the broker folder,

Now you can run the broker and the client. You can find the broker at /vanilla/broker & the mqtt client at /vanilla/client

To get started, run

```shell
npm i
```

inside both the broker and client folders to install the dependencies, then start up each one in a different terminal via

```shell
npm start
```

The [Aedes MQTT](https://github.com/moscajs/aedes) broker is configured with Realm Middleware with following option,

An configuration object is provided to the realm middleware.

You can find the schema for the different synced collections at ./broker/src/models/

Realm middleware is configured to listen the incoming payload and the message is passed to a callback registered by the broker. The handler transforms the message payload to fit the provided schema. This transformed payload is returned to the middleware which saves it to Realm.
