import { NextResponse } from "next/server";
import prisma from "@/src/db"
import {getUser} from "@/src/token"

export async function POST(req) {
  let body = await req.json()
  let user = await getUser(req)

  let {owner, job, vehicle, isBooking} = body

  let ownerRecord, vehicleRecord

  let ownerData = {...owner}
  delete ownerData.id

  let vehicleData = {...vehicle}
  delete vehicleData.id

  if(owner.id){
    ownerRecord = await prisma.customers.update({where: {id: owner.id}, data: ownerData})
  } else {
    ownerRecord = await prisma.customers.create({data: ownerData})
  }
  debugger

  if(!vehicleData.noVehicleRequired){
    if(vehicle.id){
      vehicleRecord = await prisma.vehicles.update({where: {id: vehicle.id}, data: vehicleData})
    } else {
      vehicleRecord = await prisma.vehicles.create({data: {...vehicleData, customerId: ownerRecord.id}})
    }
  }

  let createdAt = new Date()
  let createdBy = user.name

  debugger
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
    createdAt,
    createdBy,
  }
  if(isBooking){
    jobData.bookedBy = user.name
  }

  let result = await prisma.jobs.create({
    data: jobData
  })

  return NextResponse.json(result)
}

// http://localhost:3000/api/autocomplete?q=sam&model=customers

