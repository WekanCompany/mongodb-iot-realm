
exports = async function () {
  // Access a mongodb service:
  const mongodb = context.services.get("mongodb-atlas");
  const syncCollection = mongodb.db("reference").collection("sensorData");
  const timeSeriesCollection = mongodb.db("reference").collection("timeseriesData");
  syncCollection
    .find({})
    .sort({ timestamp: 1 })
    .limit(100)
    .toArray()
    .then(async (items) => {
      items = items.map((i) => ({ timestamp: new Date(i.timestamp), meta: { edgeId: i.edgeId, sensorId: i.sensorId }, value: i.value }))
      await timeSeriesCollection.insertMany(items);
    })
    .catch((err) => console.error(`Failed to find documents: ${err}`));
};
