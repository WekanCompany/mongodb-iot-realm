module.exports = {
  name: 'edges',
  properties: {
    _id: 'objectId',
    partitionKey: 'string?',
    edgeId: 'string',
    edgeName: 'string',
    sensors: { type: 'list', objectType: 'sensor' },
    compactSize: 'double?',
    updateDay: 'int?',
    updateTime: 'string?',
    updateImageName: 'string?',
    lastUpdateDt: 'date?',
  },
  primaryKey: '_id',
};
