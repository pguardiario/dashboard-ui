// import jwtDecode from 'jwt-decode';
// import { XeroClient } from 'xero-node'
require('dotenv').config()
const fs = require('fs')
const jwtDecode = require('jwt-decode')
const { XeroClient } = require('xero-node')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  grantType: 'client_credentials',
})

async function xxx(){
  const {access_token, expires_at} = await xero.getClientCredentialsToken()
  fetch("https://api.xero.com/api.xro/2.0/Invoices/8fba6d38-29c1-41ad-b77e-7e384aae2f7e", {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  })



  const decodedAccessToken = jwtDecode(tokenSet.access_token)
  debugger
}


async function updateInvoice(invoice){
  let date = new Date(invoice.DateString)
  let dueDate = new Date(invoice.DueDateString)
  let thirdPartyAccountingSystemID = invoice.InvoiceID
  let record = await prisma.invoices.findFirst({where: {thirdPartyAccountingSystemID}})
  debugger
  /*
  invoiceNumber String?
  orderNumber String?
  finalized String?
  finalizedBy String?
  finalizedAt DateTime?
  vehicleNumber String?
  vehicleRegistrationNumber String?
  vehicleFleetNumber String?
  odometer String?
  customerID Int?
  customerNumber String?
  customerSpecialAccountNumber String?
  customerName String?
  customerFirstName String?
  customerLastName String?
  customerStreetAddress String?
  customerSuburb String?
  customerState String?
  customerPostcode String?
  customerEmail String?
  customerMobile String?
  originalSourceOfBusiness String?
  defaultDiscountPercentage String?
  isRepeatedCustomer String?
  jobNumber Int?
  jobStatus String?
  jobStartDate DateTime?
  jobEndDate DateTime?
  firstJobType String?
  description String?
  issueDate DateTime?
  dueDate DateTime?
  netAmount String?
  taxAmount String?
  totalAmount String?
  discountAmount String?
  discountPercentage String?
  paidAmount String?
  amountDue String?
  totalCost String?
  firstPaymentType String?
  secondPaymentType String?
  firstPaymentDate String?
  secondPaymentDate String?
  comments String?
  internalNotes String?
  mechanics String?
  thirdPartyAccountingSystemID String
  createdAt DateTime
  salesperson String?
  invoiceItems Json
  tags String?
  */
}

async function run(){



  // const data = JSON.parse(fs.readFileSync('json/1.json'))
  // for(let row of data.Invoices){
  //   updateInvoice(row)
  // }

  const byStatus = await prisma.invoices.groupBy({
    by: ['status'],
    _sum: {
      subTotal: true,
    },
  })
  let date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  const byUser = await prisma.invoices.groupBy({
    by: ['customerId', 'status'],
    _sum: {
      subTotal: true,
    },
    _count: {
      id: true
    },
    where: {
      status: {not: "VOIDED"},
      date: {gt: date}
    }
  })
  const result = await prisma.$queryRaw`SELECT count(*), sum("subTotal"), status, "customerId" FROM invoices where date > ${date} group by "customerId", status`
  let customerIds = [...new Set(result.map(r => "" + r.customerId))].join(",")
  let sql = `SELECT distinct on ("customerId") contact, "customerId" FROM invoices where "customerId" in (${customerIds})`
  const result2 = await prisma.$queryRawUnsafe(sql)
  let data = result2.map(row => {
    let { contact, customerId } = row
    let ret = { ...contact, customerId, total: 0 }
    for (let r2 of result.filter(r => r.customerId === customerId)) {
      ret[r2.status] = r2.sum
      ret.total += r2.sum
    }
    return ret
  })


  debugger
}

run()
