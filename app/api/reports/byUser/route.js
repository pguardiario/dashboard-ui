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

console.log({to, from})

  const result = await prisma.$queryRaw`SELECT count(*), sum("subTotal"), status, "customerId" FROM invoices where date > ${from} and date < ${to} group by "customerId", status`
  let customerIds = [...new Set(result.map(r => "" + r.customerId))].join(",")
  let sql = `SELECT distinct on ("customerId") contact, "customerId" FROM invoices where "customerId" in (${customerIds})`
  console.log({sql})
  const result2 = await prisma.$queryRawUnsafe(sql)
  let data = result2.map(row => {
    let { contact, customerId } = row
    let ret = { ...contact, customerId, sales: 0, returns: 0, total: 0, value: 0 }
    for (let r2 of result.filter(r => r.customerId === customerId)) {
      ret[r2.status] = r2.sum

      if(r2.status === "VOIDED") {
        // ret.total += r2.sum
        ret.value -= r2.sum
        ret.returns += Number(r2.count)
      } else if (['PAID', 'AUTHORISED'].includes(r2.status)){
        ret.total += r2.sum
        ret.value += r2.sum
        ret.sales += Number(r2.count)
      } else {
        console.log(r2.status)
      }

    }
    return ret
  })
  data.sort((a, b) => b.total - a.total)

  return NextResponse.json(data)
}

// http://localhost:3000/api/reports/byUser


