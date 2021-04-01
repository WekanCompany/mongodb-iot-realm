'use strict';

const nodeimu = require('nodeimu');
const mqtt = require('mqtt');

const imu = new nodeimu.IMU();
const client = mqtt.connect(process.env.BROKER_URL);

client.on('connect', () => {
  client.subscribe('dht/temperature');
  client.subscribe('dht/humidity');

  setInterval(() => {
    imu.getValue((error, data) => {
      if (error) {
        console.log(error);
        return;
      }

      if (data.temperature) {
        client.publish(
          'dht/temperature',
          JSON.stringify({
            sensorType: 'temperature',
            sensorId: 'af4ff76b-009b-4cc4-8dfe-c058d1d030c9',
            tempCelsius: data.temperature,
            tempFahrenheit: data.temperature * 1.8 + 32,
            timestamp: Date.now(),
          })
        );
      }

      if (data.humidity) {
        client.publish(
          'dht/humidity',
          JSON.stringify({
            sensorType: 'humidity',
            sensorId: 'a27179de-fae5-4b58-ad8f-d839ae755c9b',
            relHumidity: data.humidity,
            timestamp: Date.now(),
          })
        );
      }
    });
  }, 5000);
});

client.on('message', function (topic, message) {
  console.log(new Date().toTimeString(), message.toString());
});
