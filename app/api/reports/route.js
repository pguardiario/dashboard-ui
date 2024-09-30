import { NextResponse } from "next/server";
import prisma from "@/src/db"
import {getUser} from "@/src/token"


export async function GET(req) {
  let user = await getUser(req)
  // let data =

  // select count(*), status, sum("subTotal") from invoices group by status;
  // select
  return NextResponse.json({})
}

// http://localhost:3000/api/autocomplete?q=sam&model=customers

