const { functions, admin, auth, db, rtdb, cloudRegion } = require("./bootstrap")
const utils = require("./utils")

exports.listTables = functions.region(cloudRegion).https.onCall(async (data, context) => {  
  const result = []
  const tables = await db.collection("tables").get()
  tables.forEach(doc => {
    result.push(doc.data())
  })
  return utils.createSuccess(result)
});

exports.addTable = functions.region(cloudRegion).https.onCall(async (data, context) => {  
  try{
    await db.collection("tables").doc(data.name).set(data) 
    return utils.createSuccess(data)
  } catch (err) {
    return utils.createReject(err.message)
  }   
});

exports.reserveTable = functions.region(cloudRegion).https.onCall(async (data, context) => {
  try{
    await db.collection("tables").doc(data.name).update({status: "reserved"})
    return utils.createSuccess(data)    
  }catch(err){
    return utils.createReject(err.message)
  }
});

exports.addFood = functions.region(cloudRegion).https.onCall(async (data, context) => {
  try{
    await db.collection("tables").doc(data.name).update(data)
    return utils.createSuccess(data)
  }catch(err){
    return utils.createReject(err.message)
  }
});

exports.billTable = functions.region(cloudRegion).https.onCall(async (data, context) => {
  try {
    // get table data
    const table = await db.collection("tables").doc(data.name).get()
    const tableData = table.data()
    // create bill
    const id = Math.random().toString(36).substr(2, 9)
    const bill = {
      id : id,
      table : tableData.name,
      foods : tableData.foods,
      total : tableData.total,
      type : 'income',
      category : 'food',
      created : new Date().getTime(),
    };
    // save bill
    await db.collection("transactions").doc(id).set(bill)
    await db.collection("tables").doc(data.name).update({
      foods: [],
      total: 0,
      checkin: "",
      checkout: "",
      status: "ready"
    })
    return utils.createSuccess(bill)
  } catch(err) {
    return utils.createReject(err.message)
  }
});

exports.listQueues = functions.region(cloudRegion).https.onCall(async (data, context) => {
  const result = []
  const queues = await db.collection("queues").get()
  queues.forEach(doc => {
    result.push(doc.data())
  })
  return utils.createSuccess(result)
});

exports.enqueue = functions.region(cloudRegion).https.onCall(async (data, context) => {
  try{
    data.timestamp = new Date().getTime()
    await db.collection("queues").doc(data.name).set(data)
    return utils.createSuccess(data)
  }catch(err){
    return utils.createReject(err.message)
  }
});

exports.dequeue = functions.region(cloudRegion).https.onCall(async (data, context) => {
  try{
    await db.collection("queues").doc(data.name).delete()
    return utils.createSuccess(data)
  }catch(err){
    return utils.createReject(err.message)
  }
});

