import { NextResponse } from "next/server";
import prisma from "@/src/db"
import { getUser } from "@/src/token"


export async function GET(req) {
  // let user = await getUser(req)
  let result = await prisma.$queryRaw`SELECT DATE_TRUNC('month', date) AS month, COUNT(id) AS count, sum("amountPaid") as paid, sum("amountDue") as due FROM invoices  where date > '2023-08-01' GROUP BY DATE_TRUNC('month', date)`
  result.sort((a, b) => a.month - b.month)
  let paid = []
  let due = []
  let months = []
  for(let row of result.slice(-12)){
    // let {month, paid, due, count} = row
    paid.push(Number(row.paid))
    due.push(Number(row.due))
    months.push(row.month.toString().split(' ')[1])
    debugger
  }

  let series = [{
    name: 'Paid',
    data: paid
  }, {
    name: 'Due',
    data: due
  }]

  return NextResponse.json({series, categories: months})
}

// http://localhost:3000/api/charts/bar/inventory


