import { NextResponse } from "next/server";
import prisma from "@/src/db"
import {getUser} from "@/src/token"

export async function DELETE(req, route) {
  let user = await getUser(req)
  let id = Number(route.params.id)
  let job = await prisma.jobs.findFirst({where: {id}})
  if(job){
    job = await prisma.jobs.delete({where: {id}})
  }

  // debugger


  return NextResponse.json({ok: true})
}

export async function PUT(req, route) {
  let body = await req.json()
  let user = await getUser(req)
  let id = Number(route.params.id)

  let {owner, job, vehicle, isBooking} = body

  let ownerRecord, vehicleRecord

  let ownerData = {...owner}
  delete ownerData.id

  let vehicleData = {...vehicle}
  delete vehicleData.id

  // let jopbvehicleData = {...vehicle}
  // delete vehicleData.id

  if(owner.id){
    ownerRecord = await prisma.customers.update({where: {id: owner.id}, data: ownerData})
  } else {
    ownerRecord = await prisma.customers.create({data: ownerData})
  }
  // debugger

  if(!vehicleData.noVehicleRequired){
    if(vehicle.id){
      vehicleRecord = await prisma.vehicles.update({where: {id: vehicle.id}, data: vehicleData})
    } else {
      vehicleRecord = await prisma.vehicles.create({data: {...vehicleData, customerId: ownerRecord.id}})
    }
  }

  // debugger
  let time = job.time ? new Date(job.time) : null
  let finishTime = job.finishTime ? new Date(job.finishTime) : null
  let pickupTime = job.pickupTime ? new Date(job.pickupTime) : null
  let jobData = {
    ...job,
    time,
    finishTime,
    pickupTime,
    customerId: ownerRecord.id,
    vehicleId: vehicleRecord?.id || 0,
    isBooking,
  }
  if(isBooking){
    jobData.bookedBy = user.name
  }

  let result = await prisma.jobs.update({
    where: { id },
    data: jobData
  })

  return NextResponse.json(result)
}


// http://localhost:3000/api/autocomplete?q=sam&model=customers

