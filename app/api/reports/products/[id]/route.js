import { NextResponse } from "next/server";
import prisma from "@/src/db"
import {getUser} from "@/src/token"

export async function GET(req, route) {
  let user = await getUser(req)
  let id = Number(route.params.id)
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

  return NextResponse.json(mapped)
}

// http://localhost:3000/api/autocomplete?q=sam&model=customers


