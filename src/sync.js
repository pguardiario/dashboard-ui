// import jwtDecode from 'jwt-decode';
// import { XeroClient } from 'xero-node'
// require('dotenv').config()
// const fs = require('fs')
const jwtDecode = require('jwt-decode')
const { XeroClient } = require('xero-node')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { globSync } = require('glob')

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  grantType: 'client_credentials',
})

async function xxx() {
  const { access_token, expires_at } = await xero.getClientCredentialsToken()
  fetch("https://api.xero.com/api.xro/2.0/Invoices/8fba6d38-29c1-41ad-b77e-7e384aae2f7e", {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  })

  const decodedAccessToken = jwtDecode(tokenSet.access_token)
  debugger
}


async function addCustomerFromXero(data) {
  let names = data.Name.split(' ')
  if (data.Phones.length > 0 || data.Addresses.length > 0 || data.ContactGroups.length > 0 || data.ContactPersons.length > 0) {
    debugger
  }
  let customerData = {
    uuid: data.ContactNumber,
    name: data.Name,
    firstName: names.shift(),
    lastName: names.pop(),
    createdAt: new Date()
  }
  let customer = await prisma.customers.create({ data: customerData })
  return customer
  debugger
}


const xeroDate = date => new Date(Number(date.match(/\d+/)[0]))

async function updateLineItem(lineItem, invoiceID, date){
  let {
    ItemCode: itemCode,
    Description: description,
    UnitAmount: unitAmount,
    TaxType: taxType,
    TaxAmount: taxAmount,
    LineAmount: lineAmount,
    AccountCode: accountCode,
    Item: item,
    Tracking: tracking,
    Quantity: quantity,
    LineItemID: lineItemID,
    AccountID: accountID,
  } = lineItem
  let {
    ItemID: itemID, Name: name, Code: code
  } = item || {}

  let record = await prisma.lineItems.findFirst({where: {lineItemID}})

  if(!unitAmount || !description){
    return
  }

  let tireId
  if(code){
    tire = await prisma.tires.findFirst({where: {itemNumber: code}})
    if(tire){
      tireId = tire.id
    }
  }

  if(record){
    record = await prisma.lineItems.update({ where: {id: record.id}, data: {
      tireId,
      itemCode,
      description,
      unitAmount,
      taxType,
      taxAmount,
      lineAmount,
      accountCode,
      quantity,
      lineItemID,
      accountID,
      itemID,
      name,
      code,
      invoiceID,
      date,
    }})
  } else {
    record = await prisma.lineItems.create({data: {
      tireId,
      itemCode,
      description,
      unitAmount,
      taxType,
      taxAmount,
      lineAmount,
      accountCode,
      quantity,
      lineItemID,
      accountID,
      itemID,
      name,
      code,
      invoiceID,
      date,
    }})
  }

  return record
}

async function syncInvoice(invoice) {
  let {
    Type: type,
    InvoiceID: invoiceID,
    InvoiceNumber: invoiceNumber,
    Reference: reference,
    Payments: payments,
    CreditNotes: creditNotes,
    Prepayments: prepayments,
    Overpayments: overpayments,
    AmountDue: amountDue,
    AmountPaid: amountPaid,
    AmountCredited: amountCredited,
    CurrencyRate: currencyRate,
    IsDiscounted: isDiscounted,
    HasAttachments: hasAttachments,
    InvoiceAddresses: invoiceAddresses,
    HasErrors: hasErrors,
    InvoicePaymentServices: invoicePaymentServices,
    Contact: contact,
    Date: date,
    DueDate: dueDate,
    Status: status,
    LineAmountTypes: lineAmountTypes,
    LineItems: lineItems,
    SubTotal: subTotal,
    TotalTax: totalTax,
    Total: total,
    UpdatedDateUTC: updatedDateUTC
  } = invoice

  let customer = await prisma.customers.findFirst({ where: { uuid: invoice.Contact.ContactNumber } })
  date = xeroDate(date)
  dueDate = dueDate ? xeroDate(dueDate) : null
  updatedDateUTC = updatedDateUTC ? xeroDate(updatedDateUTC) : null

  for(let item of lineItems){
    updateLineItem(item, invoiceID, date)
  }

  let record = await prisma.invoices.findFirst({ where: { invoiceID } })

  // let customer2 = await prisma.customers.findFirst({where: {uuid: invoice.Contact.ContactID}})
  // return

  if (!customer) {
    customer = await addCustomerFromXero(invoice.Contact)
  }

  let customerId = customer.id
  payments = payments || []
  creditNotes = creditNotes || []
  prepayments = prepayments || []
  overpayments = overpayments || []
  amountCredited = amountCredited || 0
  invoiceAddresses = invoiceAddresses || []

  let invoiceData = {
    customerId,
    type,
    invoiceID,
    invoiceNumber,
    reference,
    payments,
    creditNotes,
    prepayments,
    overpayments,
    amountDue,
    amountPaid,
    amountCredited,
    isDiscounted,
    hasAttachments,
    invoiceAddresses,
    hasErrors,
    invoicePaymentServices,
    contact,
    date,
    dueDate,
    status,
    lineAmountTypes,
    lineItems,
    subTotal,
    totalTax,
    total,
    updatedDateUTC,
  }


  if (record) {
    record = await prisma.invoices.update({ where: { id: record.id }, data: invoiceData })
  } else {
    if(!payments){
      return
    }
    record = await prisma.invoices.create({ data: invoiceData })
  }

  console.log(date)
  return

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
  invoiceID String
  createdAt DateTime
  salesperson String?
  invoiceItems Json
  tags String?
  */
}

async function run() {
  const { access_token, expires_at } = await xero.getClientCredentialsToken()
  for (let i = 1; i < 9999; i++) {
    console.log(i)
    let data = await fetch(`https://api.xero.com/api.xro/2.0/Invoices?page=${i}&pageSize=100`, {
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Accept": "application/json"
      }
    }).then(r => r.json())
    // fs.writeFileSync('x.json', JSON.stringify(data))

    // let data = JSON.parse(fs.readFileSync('x.json'))

    for (let row of data.Invoices) {
      await syncInvoice(row)
    }

    if (data.Invoices.length < 100) {
      break
    }
  }


  debugger


}

async function doWebhooks(){

  // the main glob() and globSync() resolve/return array of filenames

  // all js files, but don't look in node_modules
  const files = globSync('payloads/*.json')
  const { access_token, expires_at } = await xero.getClientCredentialsToken()

  for(let file of files){
    let data = JSON.parse(fs.readFileSync(file))
    for(let event of data.events){
      if(event.eventCategory === "INVOICE"){
        let json = await fetch(event.resourceUrl, {
          headers: {
            "Authorization": `Bearer ${access_token}`,
            "Accept": "application/json"
          }
        }).then(r => r.json())
        for(let row of json.Invoices){
          await syncInvoice(row)
        }
      }
    }
    fs.unlinkSync(file)
  }




  debugger
}
// run()
// doWebhooks()

async function doWebhook(data){
  const { access_token, expires_at } = await xero.getClientCredentialsToken()
  for(let event of data.events){
    if(event.eventCategory === "INVOICE"){
      let json = await fetch(event.resourceUrl, {
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Accept": "application/json"
        }
      }).then(r => r.json())
      for(let row of json.Invoices){
        await syncInvoice(row)
      }
    }
  }
}

module.exports = {doWebhook}