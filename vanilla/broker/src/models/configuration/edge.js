module.exports = {
  name: 'edges',
  properties: {
    _id: 'objectId',
    partitionKey: 'string?',
    edgeId: 'string',
    edgeName: 'string',
    sensors: { type: 'list', objectType: 'sensor' },
    compactSize: 'double?',
  },
  primaryKey: '_id',
};
