module.exports = {
    name: 'sensor',
    embedded: true,
    properties: {
      _id: 'objectId',
      sensorId: 'string',
      sensorName: 'string',
      sensorType: 'string',
      unit: 'string?',
      isConfigured: 'bool?',
      threshold: 'string?',
    },
  };
  