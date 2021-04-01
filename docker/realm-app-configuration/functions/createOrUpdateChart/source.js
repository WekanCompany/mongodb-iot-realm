//Function used to Add/Edit a chart for a edge.
exports = async function(arg){
  var collection = context.services.get("app0").db("iot-reference").collection("charts");
  return await collection.updateOne({chartUUID:arg.chartUUID},{$set:{...arg}},{upsert:true});
};