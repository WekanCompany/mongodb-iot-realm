const Bson = require('bson');

exports.temperature = (payload, edgeId) => {
  const jsonMessage = JSON.parse(payload.toString());

  console.log(`Callback for ${jsonMessage.sensorId} triggered`);

  return {
    _id: new Bson.ObjectID(),
    edgeId: edgeId,
    sensorId: String(jsonMessage.sensorId),
    sensorType: String(jsonMessage.sensorType),
    timestamp: Number(jsonMessage.timestamp),
    value: Number(jsonMessage.tempCelsius),
  };
};

exports.humidity = (payload, edgeId) => {
  const jsonMessage = JSON.parse(payload.toString());

  console.log(`Callback for ${jsonMessage.sensorId} triggered`);

  return {
    _id: new Bson.ObjectID(),
    edgeId: edgeId,
    sensorId: String(jsonMessage.sensorId),
    sensorType: String(jsonMessage.sensorType),
    timestamp: Number(jsonMessage.timestamp),
    value: Number(jsonMessage.relHumidity),
  };
};
