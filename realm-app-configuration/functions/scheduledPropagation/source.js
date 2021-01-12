exports = async function () {
  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };
  // Access a mongodb service:
  const mongodb = context.services.get("app0");
  const syncCollection = mongodb.db("iot-reference").collection("sensorData");
  const nonSyncCollection = mongodb
    .db("iot-reference")
    .collection("sizedSensorData");
  syncCollection
    .find({})
    .sort({ timestamp: 1 })
    .limit(100)
    .toArray()
    .then(async (items) => {
      await asyncForEach(items, async (doc, index) => {
        await nonSyncCollection.updateOne(
          {
            edgeId: doc.edgeId,
            sensorId: doc.sensorId,
            count: { $lt: 200 },
          },
          {
            $push: {
              history: { value: doc.value, timestamp: doc.timestamp },
            },
            $min: { fromTimestamp: doc.timestamp },
            $max: { toTimestamp: doc.timestamp },
            $inc: { count: 1 },
          },
          { upsert: true }
        );
        await syncCollection.deleteOne({ _id: doc._id });
      });
    })
    .catch((err) => console.error(`Failed to find documents: ${err}`));
};