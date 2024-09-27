import { NextResponse } from "next/server";
import prisma from "@/src/db"

export async function GET(req) {

  let q = req.nextUrl.searchParams.get("q")
  if(!q || q.length < 3){
    return NextResponse.json({
      count: 0,
      next: null,
      previous: null,
      results: []
    });
  }
  const model = req.nextUrl.searchParams.get("model")

  q = q.replace(/[^\w ]/g, '')
  const results = await prisma[model].findMany({

    where: {
      name: {
        contains: q,
        mode: 'insensitive',
      },
    },
    take: 10
  })



  return NextResponse.json({
    count: results.length,
    next: null,
    previous: null,
    results
  });

}

// http://localhost:3000/api/autocomplete?q=sam&model=customers

