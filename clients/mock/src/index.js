'use strict';

const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883');
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
client.on('connect', function () {
  client.subscribe('dht/temperature', function (err) {
    if (!err) {
      setInterval(() => {
        const tempCelsius = getRandomArbitrary(29,33);
        client.publish(
          'dht/temperature',
          JSON.stringify({
            sensorType: 'temperature',
            sensorId: 'af4ff76b-009b-4cc4-8dfe-c058d1d030c9',
            tempCelsius: tempCelsius,
            tempFahrenheit: tempCelsius * 1.8 + 32,
            timestamp: Date.now(),
          })
        );
      }, 5000);
    }
  });

  client.subscribe('dht/humidity', function (err) {
    if (!err) {
      setInterval(() => {
        client.publish(
          'dht/humidity',
          JSON.stringify({
            sensorType: 'humidity',
            sensorId: 'a27179de-fae5-4b58-ad8f-d839ae755c9b',
            relHumidity: getRandomArbitrary(69,75),
            timestamp: Date.now(),
          })
        );
      }, 10000);
    }
  });
});

client.on('message', function (topic, message) {
  console.log(new Date().toTimeString(), topic, message.toString());
});

const cleanup = () => {
  if (client) {
    client.end();
  }
  process.exit(1);
};

process.on('SIGINT', cleanup);
