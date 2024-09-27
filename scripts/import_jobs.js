
const { load } = require("./utils")
const chrono = require('chrono-node');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const columnMap = {
  "Job Number": "jobNumber",
  "Status": "status",
  "Order Number": "orderNumber",
  "Key Tag": "keyTag",
  "Vehicle Number": "vehicleNumber",
  "Vehicle": "vehicle",
  "Registration Number": "registrationNumber",
  "Fleet Number": "fleetNumber",
  "Chassis Number": "chassisNumber",
  "VIN": "vin",
  "job Number": "jobNumber",
  "job Name": "jobName",
  "job Email": "jobEmail",
  "job Phone": "jobPhone",
  "job ID": "jobID",
  "Job Type": "jobType",
  "Description": "description",
  "Time": "time",
  "Finish Time": "finishTime",
  "Estimate Hours": "estimateHours",
  "Finished By": "finishedBy",
  "On Hold": "onHold",
  "On Hold Reason": "onHoldReason",
  "Odometer": "odometer",
  "Comments": "comments",
  "Notes": "notes",
  "Tags": "tags",
  "Invoice Number": "invoiceNumber",
  "Next Service Date": "nextServiceDate",
  "Booked By": "bookedBy",
  "Created By": "createdBy",
  "Assigned To": "assignedTo",
}

async function run() {

  let rows = await load('scripts/csv/Jobs.csv')
  for (let row of rows) {
    let item = {}
    for (let key of Object.keys(columnMap)) {
      if(!row[key]) continue
      item[columnMap[key]] = row[key]
    }

    if(!item.registrationNumber){
      console.log('oops')
      continue
    }

    item.createdAt = new Date() //chrono.parseDate(item.createdAt)
    item.time = item.time ? chrono.parseDate(item.time) : null
    item.finishTime = item.finishTime ? chrono.parseDate(item.finishTime) : null
    item.nextServiceDate = item.nextServiceDate ? chrono.parseDate(item.nextServiceDate) : null

    let {jobNumber, registrationNumber} = item


    let record = await prisma.jobs.findFirst({where: {jobNumber}})

    if(record){} else {
      let vehicle = await prisma.vehicles.findFirst({where: { registrationNumber }})
      if(!vehicle) continue
      let {id: vehicleId, customerId} = vehicle
      // debugger
      record = await prisma.jobs.create({data: {...item, vehicleId, customerId}})
    }
    console.log(record.id)

    // debugger
  }
}

run()

console.log(...Object.values(columnMap))
