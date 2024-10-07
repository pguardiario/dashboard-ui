import { NextResponse } from "next/server";
import prisma from "@/src/db"
import {getUser} from "@/src/token"

export async function PUT(req, route) {
  let user = await getUser(req)
  let id = Number(route.params.id)
  let data = await req.json()
  delete data.id
  delete data.uuid

  for(let key of ['isCompany', 'isThirdParty']){
    if(Object.keys(data)){
      data[key] = data[key] ? "Y" : "N"
    }
  }


  let customer = await prisma.customers.update({where: {id}, data})

  console.log({data})
  // debugger


  return NextResponse.json(customer)
}

// http://localhost:3000/api/autocomplete?q=sam&model=customers

