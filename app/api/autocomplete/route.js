import { NextResponse } from "next/server";
import prisma from "@/src/db"

export async function GET(req) {
  debugger
  console.log(req.query)
  const q = req.nextUrl.searchParams.get("q")
  const model = req.nextUrl.searchParams.get("model")

  const result = await prisma[model].findMany({
    where: {
      name: {
        search: q,
      },
    },
  })

  return NextResponse.json({ q, model, result });

}

// http://localhost:3000/api/autocomplete?q=sam&model=customers

