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
  // let date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  // const items = await prisma.lineItems.findMany({where: {date: {gt: date}, tireId: {not: null}}})
  // let ret = items.reduce((acc, item) => {
  //   if(!acc.find(row => row.name === item.name)){
  //     acc.push({...item, count: 0})
  //   }
  //   acc.find(row => row.name === item.name).count += item.quantity
  //   // oldItem.count += 1
  //   return acc
  // }, [])

  // let tires = await prisma.tires.findMany({where: {id: {in: ret.map(r => r.tireId)}}})
  // let stocks = await prisma.stocks.findMany({where: {stockNumber: {in: ret.map(r => r.code)}}})
  // let suppliers = await prisma.accounts.findMany()

  // let mapped = ret.map(r => {
  //   let tire = tires.find(t => t.itemNumber === r.code)
  //   let website = suppliers.find(s => s.supplier === tire.supplier)?.website
  //   let {category, available} = stocks.find(s => s.stockNumber === r.code) || {}
  //   return {...r, tire, category, available, website}
  // })

  // let tire = await prisma.tires.findFirst({where: {id: 18901}})
  // let lineItems = await prisma.lineItems.findMany({where: {code: tire.itemNumber}})
  // let invoices = await prisma.invoices.findMany({where: {invoiceID: {in: lineItems.map(l => l.invoiceID)}}})
  // let stock = await prisma.stocks.findFirst({where: {stockNumber: tire.itemNumber}})
  // let supplier = await prisma.accounts.findFirst({where: {supplier: tire.supplier}})
  // let mapped = lineItems.map(l => {
  //   let invoice = invoices.find(i => i.invoiceID === l.invoiceID)

  //   let {category, available} = stock || {}
  //   let website = supplier?.website
  //   return {...l, invoice, tire, category, available, website}
  // })

  // debugger

  // const byStatus = await prisma.invoices.groupBy({
  //   by: ['status'],
  //   _sum: {
  //     subTotal: true,
  //   },
  // })
  // let date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  // const byUser = await prisma.invoices.groupBy({
  //   by: ['customerId', 'status'],
  //   _sum: {
  //     subTotal: true,
  //   },
  //   _count: {
  //     id: true
  //   },
  //   where: {
  //     status: {not: "VOIDED"},
  //     date: {gt: date}
  //   }
  // })
  // const result = await prisma.$queryRaw`SELECT count(*), sum("subTotal"), status, "customerId" FROM invoices where date > ${date} group by "customerId", status`
  // let customerIds = [...new Set(result.map(r => "" + r.customerId))].join(",")
  // let sql = `SELECT distinct on ("customerId") contact, "customerId" FROM invoices where "customerId" in (${customerIds})`
  // const result2 = await prisma.$queryRawUnsafe(sql)
  // let data = result2.map(row => {
  //   let { contact, customerId } = row
  //   let ret = { ...contact, customerId, total: 0 }
  //   for (let r2 of result.filter(r => r.customerId === customerId)) {
  //     ret[r2.status] = r2.sum
  //     ret.total += r2.sum
  //   }
  //   return ret
  // })

  // select count(*), name, sum("amountPaid") from invoices where date > '2023-08-01' group by name;
  // let result = await prisma.$queryRaw`SELECT DATE_TRUNC('month', date) AS month, COUNT(id) AS count, sum("amountPaid") as paid, sum("amountDue") as due FROM invoices  where date > '2023-08-01' GROUP BY DATE_TRUNC('month', date)`
  // result.sort((a, b) => a.month - b.month)
  // let paid = []
  // let due = []
  // let months = []
  // for(let row of result.slice(-12)){
  //   // let {month, paid, due, count} = row
  //   paid.push(Number(row.paid))
  //   due.push(Number(row.due))
  //   months = row.month.toString().split(' ')[1]
  //   debugger
  // }

  // let series = [{
  //   name: 'Paid',
  //   data: paid
  // }, {
  //   name: 'Due',
  //   data: due
  // }]

  // let where = { status: {not: "deleted"} }
  // where.time = {gt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)}
  // const jobs = await prisma.jobs.findMany({
  //   where,
  //   orderBy:[
  //     {
  //       createdAt: "desc"
  //     }
  //   ]
  // })

  // let customerIds = [...new Set(jobs.map(j => j.customerId))]
  // const customers = await prisma.customers.findMany({where: {id: {in: customerIds}}})
  // let vehicleIds = [...new Set(jobs.map(j => j.vehicleId))]
  // const vehicles = await prisma.vehicles.findMany({where: {id: {in: vehicleIds}}})
  // for(let job of jobs){
  //   job.vehicle = vehicles.find(v =>v.id === job.vehicleId)
  //   job.customer = customers.find(v =>v.id === job.customerId)
  // }

  let customers = await prisma.customers.findMany({
    // where: { status: {not: "deleted"} },
    orderBy:[
      {
        // date: "desc"
      }
    ],
    take: 50
  })

  let balances = await prisma.$queryRaw`select "customerId", sum("amountDue") as balance from invoices group by "customerId"`

  for(let row of customers){
    row.balance = balances.find(b => b.customerId === row.id)?.balance || 0
    switch(true){
      case row.balance > 0: row.status = "hasBalance"; break
      case !!row.isCompany || row.isCompany === "Y": row.status = "isCompany"; break
      case !row.isCompany || row.isCompany === "N": row.status = "individualsOnly"; break
      default:
        debugger
    }
    console.log(row.status)
  }
  debugger
}

run()
