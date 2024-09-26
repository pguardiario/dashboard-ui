const { load } = require("./utils")
const chrono = require('chrono-node');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const columnMap = {
  "Customer ID": "uuid",
  "Customer Number": "customerNumber",
  "Special Account Number": "specialAccountNumber",
  "Is Company": "isCompany",
  "Is Third Party": "isThirdParty",
  "Name": "name",
  "First Name": "firstName",
  "Last Name": "lastName",
  "Contact Name": "contactName",
  "Tax Registration Number": "taxRegistrationNumber",
  "Phone": "phone",
  "Fax": "fax",
  "Mobile": "mobile",
  "Email": "email",
  "Marketing Email/SMS disabled": "marketingDisabled",
  "Price Level": "priceLevel",
  "Terms": "terms",
  "Default Discount (Percentage)": "defaultDiscount",
  "Address": "address",
  "Suburb": "suburb",
  "State": "state",
  "Postcode": "postcode",
  "Country": "country",
  "Street Address": "streetAddress",
  "Street Address Suburb": "streetSuburb",
  "Street Address State": "streetState",
  "Street Address Postcode": "streetPostcode",
  "Note": "note",
  "Tags": "tags",
  "Source Of Business": "sourceOfBusiness",
  "Running Balance": "runningBalance",
  "Finalized Balance": "finalizedBalance",
  "Creditor": "creditor",
  "Created At": "createdAt",
  "Last Invoice Date": "lastInvoiceDate"
}

async function run() {
  const results = await prisma.customers.findMany({

    where: {
      name: {
        contains: "joh",
        mode: 'insensitive',
      },
    },
    take: 10
  })
  debugger

  const result = await prisma.customers.findMany({
    where: {
      name: {
        search: "vil",
      },
    },
  })
  debugger
  let rows = await load('scripts/csv/Customers.csv')
  for (let row of rows) {
    let item = {}
    for (let key of Object.keys(columnMap)) {
      item[columnMap[key]] = row[key]
    }
    item.createdAt = chrono.parseDate(item.createdAt)

    item.runningBalance = Number(item.runningBalance)
    item.finalizedBalance = Number(item.finalizedBalance)
    item.lastInvoiceDate = item.lastInvoiceDate ? chrono.parseDate(item.lastInvoiceDate) : null

    let record = await prisma.customers.findFirst({where: {uuid: item.uuid}})
    if(record){} else {
      record = await prisma.customers.create({data: item})
    }
    console.log(record.id)

    // debugger
  }
}

run()

console.log(...Object.values(columnMap))
