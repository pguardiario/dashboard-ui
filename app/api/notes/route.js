import { NextResponse } from "next/server";
import prisma from "@/src/db"
import {getUser} from "@/src/token"

export async function POST(req) {
  let body = await req.json()
  let user = await getUser(req)

  // debugger

  let {
    startDate,
    endDate,
    note,
    officeOnly
  } = body

  let createdAt = new Date()
  let createdBy = user.name

  startDate = new Date(startDate)
  endDate = new Date(endDate)
  officeOnly = !!officeOnly

  let data = {
    startDate,
    endDate,
    note,
    officeOnly,
    createdAt,
    createdBy,
    status: "new"
  }

  let result = await prisma.notes.create({data})

  return NextResponse.json(result)
}

// http://localhost:3000/api/autocomplete?q=sam&model=customers

