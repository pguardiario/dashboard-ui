const { load } = require("./utils")
const chrono = require('chrono-node');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const columnMap = {
  "UUID": "uuid",
  "Stock Number": "stockNumber",
  "Suppliers": "suppliers",
  "First Supplier Stock Number": "firstSupplierStockNumber",
  "Barcode": "barcode",
  "Category": "category",
  "Name": "name",
  "Sale Description": "saleDescription",
  "Taxable": "taxable",
  "Purchase Description": "purchaseDescription",
  "Buy Price": "buyPrice",
  "Sell Price": "sellPrice",
  "Markup Percentage": "markupPercentage",
  "UnitPriceIncludeGST": "unitPriceIncludeGST",
  "Quantity": "quantity",
  "Default Invoice Quantity": "defaultInvoiceQuantity",
  "Allocated": "allocated",
  "Available": "available",
  "Ordered": "ordered",
  "Average Buy Price": "averageBuyPrice",
  "Total Value": "totalValue",
  "Location": "location",
  "Bin": "bin",
  "Brand": "brand",
  "Model": "model",
  "Size": "size",
  "Weight": "weight",
  "Price Level 2": "priceLevel2",
  "Price Level 3": "priceLevel3",
  "Price Level 4": "priceLevel4",
  "Price Level 5": "priceLevel5",
  "Price Level 6": "priceLevel6",
  "Price Level 7": "priceLevel7",
  "Tags": "tags",
  "Sales Account": "salesAccount",
  "Sales Account Code": "salesAccountCode",
  "Purchase Account": "purchaseAccount",
  "Purchase Account Code": "purchaseAccountCode",
  "Inventory Asset Account": "inventoryAssetAccount",
  "Inventory Asset Account Code": "inventoryAssetAccountCode",
  "Specification": "specification",
  "Is non stock": "isnonstock",
  "Is non discount": "isnondiscount",
  "Deactivated": "deactivated",
  "Stock Alert": "stockAlert",
  "Alert Quantity": "alertQuantity",
  "Reorder Quantity": "reorderQuantity",
  "Maximum Quantity": "maximumQuantity",
  "Price Group": "priceGroup",
  "Last Sales Date": "lastSalesDate",
  "Last Purchase Date": "lastPurchaseDate",
  "Creation Date": "createdAt",
  "Attachments": "attachments",
}

async function run() {
  let rows = await load('scripts/csv/Stocks.csv')
  for (let row of rows) {
    let item = {}
    for (let key of Object.keys(columnMap)) {
      item[columnMap[key]] = row[key]
    }
    item.createdAt = chrono.parseDate(item.createdAt)
    item.lastPurchaseDate = item.lastPurchaseDate ? chrono.parseDate(item.lastPurchaseDate) : null





    item.buyPrice = item.buyPrice ? Number(item.buyPrice) : null
    item.sellPrice = item.sellPrice ? Number(item.sellPrice) : null
    item.unitPriceIncludeGST = item.unitPriceIncludeGST ? Number(item.unitPriceIncludeGST) : null
    item.quantity = item.quantity ? Number(item.quantity) : null
    item.allocated = item.allocated ? Number(item.allocated) : null
    item.available = item.available ? Number(item.available) : null
    item.ordered = item.ordered ? Number(item.ordered) : null
    item.averageBuyPrice = item.averageBuyPrice ? Number(item.averageBuyPrice) : null
    item.totalValue = item.totalValue ? Number(item.totalValue) : null
    item.alertQuantity = item.alertQuantity ? Number(item.alertQuantity) : null
    item.reorderQuantity = item.reorderQuantity ? Number(item.reorderQuantity) : null



    item.priceLevel2 = item.priceLevel2 ? Number(item.priceLevel2) : null
    item.priceLevel3 = item.priceLevel3 ? Number(item.priceLevel3) : null
    item.priceLevel4 = item.priceLevel4 ? Number(item.priceLevel4) : null
    item.priceLevel5 = item.priceLevel5 ? Number(item.priceLevel5) : null
    item.priceLevel6 = item.priceLevel6 ? Number(item.priceLevel6) : null
    item.priceLevel7 = item.priceLevel7 ? Number(item.priceLevel7) : null







    let record = await prisma.stocks.findFirst({where: {uuid: item.uuid}})
    if(record){} else {
      record = await prisma.stocks.create({data: item})
    }
    console.log(record.id)

    // debugger
  }
}

run()

console.log(...Object.values(columnMap))
