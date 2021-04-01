const Bson = require('bson');
const senseHat = require('./sense-hat');

exports.temperature = (payload, edgeId, edgeConfiguration) => {
  const jsonMessage = JSON.parse(payload.toString());

  console.log(`Callback for ${jsonMessage.sensorId} triggered`);

  const result = edgeConfiguration[0].sensors.find((sensor) => {
    return sensor.sensorId === jsonMessage.sensorId;
  });

  if (result && Number(jsonMessage.tempCelsius) >= Number(result.threshold)) {
    const warning = `Sensor id ${String(
      jsonMessage.sensorId
    )} - Threshold exceeded - Current value ${jsonMessage.tempCelsius}`;
    senseHat.setMessage(warning);
    console.log(warning);
  }

  return {
    _id: new Bson.ObjectID(),
    edgeId: edgeId,
    sensorId: String(jsonMessage.sensorId),
    sensorType: String(jsonMessage.sensorType),
    timestamp: Number(jsonMessage.timestamp),
    value: Number(jsonMessage.tempCelsius),
  };
};

exports.humidity = (payload, edgeId, edgeConfiguration) => {
  const jsonMessage = JSON.parse(payload.toString());

  console.log(`Callback for ${jsonMessage.sensorId} triggered`);

  const result = edgeConfiguration[0].sensors.find((sensor) => {
    return sensor.sensorId === jsonMessage.sensorId;
  });

  if (result && Number(jsonMessage.relHumidity) >= Number(result.threshold)) {
    const warning = `Sensor id ${String(
      jsonMessage.sensorId
    )} - Threshold exceeded - Current value ${jsonMessage.relHumidity}`;
    senseHat.setMessage(warning);
    console.log(warning);
  }

  return {
    _id: new Bson.ObjectID(),
    edgeId: edgeId,
    sensorId: String(jsonMessage.sensorId),
    sensorType: String(jsonMessage.sensorType),
    timestamp: Number(jsonMessage.timestamp),
    value: Number(jsonMessage.relHumidity),
  };
};
