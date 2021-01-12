//Function used to Get All a chart for a edge.
exports = async function(arg){
  var collection = context.services.get("app0").db("iot-reference").collection("charts");
  const {_all, edgeId} =  arg;
  let query = {
    edgeId,
    isActive:true
  }
  if(_all){
    delete query["isActive"]
  }
  return await collection.find(query).toArray();
};