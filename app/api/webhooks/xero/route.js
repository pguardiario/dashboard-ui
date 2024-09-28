import { NextResponse } from "next/server";
import prisma from "@/src/db"
import { createHmac } from "crypto"
const fs = require('fs')

export async function GET(req) {
  console.log('get')
  return NextResponse.json({x: 1});
}

export async function POST(req) {
  console.log('post')
  // let data = await req.json()
  let buffer = Buffer.from(await req.arrayBuffer())
  let computedSignature = createHmac(
    "sha256",
    process.env.XERO_WEBHOOKS_KEY
  )
  .update(buffer.toString())
  .digest("base64");

  // console.log(data)
  let headers = [...req.headers].reduce((acc, [k, v]) => {
    acc[k] = v
    return acc
  }, {})

  console.log(headers)
  console.log(computedSignature)

  if(headers['x-xero-signature'] === computedSignature){
    let data = JSON.parse(buffer)
    let ts = new Date().getTime()
    fs.writeFileSync(`payoads/${ts}.json`, JSON.stringify(data, null, 2))
    // debugger
    return NextResponse.json({ok: true});
  } else {
    return NextResponse.json({ok: false}, { status: 401 });
  }
}

export async function PUT(req) {
  console.log('put')
  return NextResponse.json({x: 1});
}

export async function DELETE(req) {
  console.log('delete')
  return NextResponse.json({x: 1});
}

// curl http://localhost:3000/api/webhooks/xero
// curl https://7243-185-225-234-116.ngrok-free.app/api/webhooks/xero

