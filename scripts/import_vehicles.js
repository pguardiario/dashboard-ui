const { load } = require("./utils")
const chrono = require('chrono-node');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const columnMap = {
"Vehicle Number": "vehicleNumber",
  "Registration Number": "registrationNumber",
  "Location": "location",
  "Fleet Number": "fleetNumber",
  "Driver Name": "driverName",
  "Driver Phone": "driverPhone",
  "Driver Email": "driverEmail",
  "Make": "make",
  "Model": "model",
  "Year": "year",
  "VIN": "vin",
  "Color": "color",
  "Body Type": "bodyType",
  "Service Interval": "serviceInterval",
  "Transmission Type": "transmissionType",
  "Battery": "battery",
  "Odometer": "Odometer",
  "Engine": "Engine",
  "Engine Type": "engineType",
  "Engine Oil Type": "engineOilType",
  "Engine Oil Quantity": "engineOilQuality",
  "Power Steering Oil Type": "powerSteeringOilType",
  "Power Steering Oil Quantity": "powerSteeringOilQuantity",
  "Transmission Oil Type": "transmissionOilType",
  "Transmission Oil Quantity": "transmissionOilQuantity",
  "Transfer Case Oil Type": "transferCaseOilType",
  "Transfer Case Oil Quantity": "transferCaseOilQuantity",
  "Coolant Type": "coolantType",
  "Coolant Quantity": "coolantQuantity",
  "Fuel Type": "fuelType",
  "Air Filter": "airFilter",
  "Oil Filter": "oilFilter",
  "Fuel Filter": "fuelFilter",
  "Transmission Filter": "transmissionFilter",
  "Hydraulic Filter": "hydraulicFilter",
  "Tyre Size": "tyreSize",
  "Created At": "createdAt"
}

async function run() {

  let rows = await load('scripts/csv/Vehicles.csv')
  for (let row of rows) {
    let item = {}
    for (let key of Object.keys(columnMap)) {
      item[columnMap[key]] = row[key]
    }
    if(!item.make) continue
    item.createdAt = chrono.parseDate(item.createdAt)
    let customer = await prisma.customers.findFirst({where: {uuid: row["Customer ID"]}})
    item.customerId = customer.id
    item.vehicleNumber = Number(item.vehicleNumber)



    let record = await prisma.vehicles.findFirst({where: {vehicleNumber: item.vehicleNumber}})
    if(record){} else {
      let customer =
      record = await prisma.vehicles.create({data: item})
    }
    console.log(record.id)

    // debugger
  }
}

run()

console.log(...Object.values(columnMap))
