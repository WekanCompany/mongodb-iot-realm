module.exports = {
  name: 'sensorData',
  properties: {
    _id: 'objectId',
    partitionKey: 'string?',
    edgeId: 'string',
    sensorId: 'string',
    sensorType: 'string?',
    timestamp: 'int',
    value: 'double',
  },
  primaryKey: '_id',
};
