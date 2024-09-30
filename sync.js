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
  dueDate = xeroDate(dueDate)
  updatedDateUTC = xeroDate(updatedDateUTC)

  // let customer2 = await prisma.customers.findFirst({where: {uuid: invoice.Contact.ContactID}})
  // return

  if (!customer) {
    customer = await addCustomerFromXero(invoice.Contact)
  }

  let customerId = customer.id

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

  let record = await prisma.invoices.findFirst({ where: { invoiceID } })

  if (record) {
    record = await prisma.invoices.update({ where: { id: record.id }, data: invoiceData })
  } else {
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
  const {access_token, expires_at} = await xero.getClientCredentialsToken()
  for (let i = 1; i < 9999) {
    console.log(i)
    let data = await fetch("https://api.xero.com/api.xro/2.0/Invoices?page=1&pageSize=100", {
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

    if(data.Invoices.length < 100){
      break
    }
  }


  debugger


}

run()
