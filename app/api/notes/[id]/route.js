import { NextResponse } from "next/server";
import prisma from "@/src/db"
import {getUser} from "@/src/token"

export async function PUT(req, route) {
  let body = await req.json()
  let user = await getUser(req)
  let id = Number(route.params.id)
  // debugger

  let {
    startDate,
    endDate,
    note,
    officeOnly
  } = body

  startDate = new Date(startDate)
  endDate = new Date(endDate)
  officeOnly = !!officeOnly

  let data = {
    startDate,
    endDate,
    note,
    officeOnly
  }

  let result = await prisma.notes.update({where: {id}, data})

  return NextResponse.json(result)
}

// http://localhost:3000/api/autocomplete?q=sam&model=customers

