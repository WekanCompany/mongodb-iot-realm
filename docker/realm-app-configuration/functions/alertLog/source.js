exports = async function (changeEvent) {
  const { fullDocument } = changeEvent;
  const { edgeId, sensorId, value } = fullDocument;
  var collection = context.services
    .get("app0")
    .db("iot-reference")
    .collection("logs");
  var edgeCollection = context.services
    .get("app0")
    .db("iot-reference")
    .collection("edges");
  let createdBefore = new Date();
  createdBefore.setMinutes(createdBefore.getMinutes() - 15);
  const existingAlert = await collection.count({
    edgeId,
    sensorId,
    createdAt: { $lte: createdBefore },
  });
  if (existingAlert === 0) {
    const canAlert = await edgeCollection.count({
      edgeId: edgeId,
      "sensors.sensorId": sensorId,
      "sensors.isConfigured": true,
      "sensors.threshold": { $gte: value.toString() },
    });
    if (canAlert > 0) {
      await collection.insertOne({
        isResolved: false,
        edgeId,
        sensorId,
        createdAt: { $lte: createdBefore },
        data: fullDocument,
        type:"threshold"
      });
    }
  }
  return true;
};