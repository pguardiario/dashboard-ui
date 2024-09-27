import { NextResponse } from "next/server";
import prisma from "@/src/db"

export async function GET(req) {
  let customerId = Number(req.url.replace(/.*\//, ''))

  const results = await prisma.vehicles.findMany({
    where: {
      customerId
    },
    take: 10
  })

  return NextResponse.json(results);

}

// http://localhost:3001/api/ownerVehicles/23

