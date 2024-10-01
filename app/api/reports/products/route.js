import { NextResponse } from "next/server";
import prisma from "@/src/db"
import { getUser } from "@/src/token"


export async function GET(req) {
  // let user = await getUser(req)
  let date = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  let to = req.nextUrl.searchParams.get("to")
  let from = req.nextUrl.searchParams.get("from")
  to = new Date(to)
  from = new Date(from)

  const items = await prisma.lineItems.findMany({where: {date: {gt: from, lt: to}, tireId: {not: null}}})
  let ret = items.reduce((acc, item) => {
    if(!acc.find(row => row.name === item.name)){
      acc.push({...item, count: 0})
    }
    acc.find(row => row.name === item.name).count += item.quantity
    // oldItem.count += 1
    return acc
  }, [])

  let tires = await prisma.tires.findMany({where: {id: {in: ret.map(r => r.tireId)}}})

  let mapped = ret.map(r => {
    let tire = tires.find(t => t.itemNumber === r.code)
    return {...r, tire}
  })

  mapped.sort((a, b) => b.count * b.unitAmount - a.count * a.unitAmount)

  return NextResponse.json(mapped)
}

// http://localhost:3000/api/reports/products


