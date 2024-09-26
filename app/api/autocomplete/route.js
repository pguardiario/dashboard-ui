import { NextResponse } from "next/server";
import prisma from "@/src/db"

export async function GET(req) {
  debugger
  console.log(req.query)
  let q = req.nextUrl.searchParams.get("q")
  const model = req.nextUrl.searchParams.get("model")

  q = q.replace(/[^\w ]/g, '')
  const results = await prisma[model].findMany({

    where: {
      name: {
        search: q,
      },
    },
  })



  return NextResponse.json({
    count: results.length,
    next: null,
    previous: null,
    results
  });

}

// http://localhost:3000/api/autocomplete?q=sam&model=customers

