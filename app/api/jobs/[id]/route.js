import { NextResponse } from "next/server";
import prisma from "@/src/db"
import {getUser} from "@/src/token"

export async function DELETE(req, route) {
  let user = await getUser(req)
  let id = Number(route.params.id)
  let job = await prisma.jobs.delete({where: {id}})
  // debugger


  return NextResponse.json({ok: true})
}

// http://localhost:3000/api/autocomplete?q=sam&model=customers

