import prisma from "@/src/db";
import ProductHistoryTable from "@/components/reports/ProductHistoryTable"

const Page = async ({ params }) => {
  let id = Number(params.id)
  let tire = await prisma.tires.findFirst({where: {id}})

  let lineItems = await prisma.lineItems.findMany({where: {code: tire.itemNumber}})
  let invoices = await prisma.invoices.findMany({where: {invoiceID: {in: lineItems.map(l => l.invoiceID)}}})
  let stock = await prisma.stocks.findFirst({where: {stockNumber: tire.itemNumber}})
  let supplier = await prisma.accounts.findFirst({where: {supplier: tire.supplier}})
  let mapped = lineItems.map(l => {
    let invoice = invoices.find(i => i.invoiceID === l.invoiceID)

    let {category, available} = stock || {}
    let website = supplier?.website
    return {...l, invoice, tire, category, available, website}
  })
  return <ProductHistoryTable rows={mapped}/>
};


export default Page;
