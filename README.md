# Realm IOT

Reference applications to showcase MongoDB's Realm Sync with Mongodb Timeseries Collection. 

There are 2 variants,

- The docker variant - Each app (Aedes Broker, Updater, MQTT Client) runs in its own docker container, these can be deployed to one or more Raspberry PI devices. Instructions to set it up can be found [here](docker/README.md)

- The vanilla variant - A leaner version with only 2 apps, the Aedes Broker and the MQTT Client. Setting up the broker and running it locally has also been simplified. Instructions to set it up can be found [here](vanilla/README.md)


Switch to `bucketseries` branch for a Reference applications to showcase MongoDB's Realm Sync with Mongodb traditional Bucketing Pattern. 