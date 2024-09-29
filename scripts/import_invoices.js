const { load } = require("./utils")
const chrono = require('chrono-node');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

let itemMap = {
  "Invoice Number": "invoiceNumber",
"Job Number": "jobNumber",
"Net Amount": "netAmount",
"Phone": "phone",
"Quantity": "quantity",
"Sales Account Code": "salesAccountCode",
"Sales Account Name": "salesAccountName",
"Salesperson": "salesperson",
"Stock Category": "stockCategory",
"Stock Name": "stockName",
"Stock Number": "stockNumber",
"Tax Amount": "taxAmount",
"Taxable": "taxable",
"Total Amount": "totalAmount",
"Unit Cost": "unitCost",
"Unit Price": "unitPrice",
"Updated At": "updatedAt",
"Vehicle Fleet Number": "vehicleFleetNumber",
"Vehicle Make": "vehicleMake",
"Vehicle Model": "vehicleModel",
"Vehicle Registration Number": "vehicleRegistrationNumber",
}

function mapItem(row) {
  let item = {}
  for (let key of Object.keys(itemMap)) {
    item[itemMap[key]] = row[key]
  }
  item.taxable = !!item.taxable
  item.updatedAt = item.updatedAt ? chrono.parseDate(item.updatedAt) : null
  return item
}

const columnMap = {
  "Invoice Number": "invoiceNumber",
  "Order Number": "orderNumber",
  "Finalized": "finalized",
  "Finalized By": "finalizedBy",
  "Finalized At": "finalizedAt",
  "Vehicle Number": "vehicleNumber",
  "Vehicle Registration Number": "vehicleRegistrationNumber",
  "Vehicle Fleet Number": "vehicleFleetNumber",
  "Odometer": "odometer",
  "Customer ID": "customerID",
  "Customer Number": "customerNumber",
  "Customer Special Account Number": "customerSpecialAccountNumber",
  "Customer Name": "customerName",
  "Customer First Name": "customerFirstName",
  "Customer Last Name": "customerLastName",
  "Customer Street Address": "customerStreetAddress",
  "Customer Suburb": "customerSuburb",
  "Customer State": "customerState",
  "Customer Postcode": "customerPostcode",
  "Customer Email": "customerEmail",
  "Customer Mobile": "customerMobile",
  "Original Source Of Business": "originalSourceOfBusiness",
  "Default Discount Percentage": "defaultDiscountPercentage",
  "Is Repeated Customer": "isRepeatedCustomer",
  "Job Number": "jobNumber",
  "Job Status": "jobStatus",
  "Job Start Date": "jobStartDate",
  "Job End Date": "jobEndDate",
  "First Job Type": "firstJobType",
  "Description": "description",
  "Issue Date": "issueDate",
  "Due Date": "dueDate",
  "Net Amount": "netAmount",
  "Tax Amount": "taxAmount",
  "Total Amount": "totalAmount",
  "Discount Amount": "discountAmount",
  "Discount Percentage": "discountPercentage",
  "Paid Amount": "paidAmount",
  "Amount Due": "amountDue",
  "Total Cost": "totalCost",
  "First Payment Type": "firstPaymentType",
  "Second Payment Type": "secondPaymentType",
  "First Payment Date": "firstPaymentDate",
  "Second Payment Date": "secondPaymentDate",
  "Comments": "comments",
  "Internal Notes": "internalNotes",
  "Mechanics": "mechanics",
  "Third Party Accounting System ID": "thirdPartyAccountingSystemID",
  "Created At": "createdAt",
  "Salesperson": "salesperson",
  "Tags": "tags",
}


async function run() {
  let rows = await load('scripts/csv/Invoices Summary.csv')
  let items = await load('scripts/csv/Invoice Items.csv')
  items = items.map(mapItem)

  for (let row of rows) {
    let item = {}
    for (let key of Object.keys(columnMap)) {
      item[columnMap[key]] = row[key]
    }

    item.createdAt = chrono.parseDate(item.createdAt)
    item.finalizedAt = item.finalizedAt ? chrono.parseDate(item.finalizedAt) : null
    // item.customerID = item.customerID ? Number(item.customerID) : null
    item.jobNumber = item.jobNumber ? Number(item.jobNumber) : null
    item.jobStartDate = item.jobStartDate ? chrono.parseDate(item.jobStartDate) : null
    item.jobEndDate = item.jobEndDate ? chrono.parseDate(item.jobEndDate) : null
    item.issueDate = item.issueDate ? chrono.parseDate(item.issueDate) : null
    item.dueDate = item.dueDate ? chrono.parseDate(item.dueDate) : null

    let record = await prisma.invoices.findFirst({where: {thirdPartyAccountingSystemID: item.thirdPartyAccountingSystemID}})
    if(record){} else {
      item.invoiceItems = items.filter(i => i.invoiceNumber === item.invoiceNumber)
      record = await prisma.invoices.create({data: item})
    }
    console.log(record.id)

    // debugger
  }
}

run()

console.log(...Object.values(columnMap))
