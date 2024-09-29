const { load } = require("./utils")
const chrono = require('chrono-node');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const columnMap = {
  "Payment Number": "paymentNumber",
  "Reference": "reference",
  "Invoice Number": "invoiceNumber",
  "Invoice Issue Date": "invoiceIssueDate",
  "Date": "date",
  "Customer": "customer",
  "Amount": "amount",
  "Payment Type": "paymentType",
  "Original Payment Number": "originalPaymentNumber",

}


async function run() {
  let rows = await load('scripts/csv/Invoice Payment.csv')

  for (let row of rows) {
    let item = {}
    for (let key of Object.keys(columnMap)) {
      item[columnMap[key]] = row[key]
    }
    debugger

    item.createdAt = new Date()
    item.date = item.date ? chrono.parseDate(item.date) : null
    item.invoiceIssueDate = item.invoiceIssueDate ? chrono.parseDate(item.invoiceIssueDate) : null

    let record = await prisma.invoicePayments.findFirst({where: {paymentNumber: item.paymentNumber}})
    if(record){} else {
      record = await prisma.invoicePayments.create({data: item})
    }
    console.log(record.id)

    // debugger
  }
}

run()

console.log(...Object.values(columnMap))








