"use server";

import { cookies } from "next/headers";
import prisma from "@/src/db";
import jose from "jose";
import { signJWT } from "@/src/token"




export const createAuthCookie = async (values: any) => {
  let user = await prisma.users.findFirst({
    where: values
  })
  if(user){
    let token = await signJWT(user)
    cookies().set("userAuth", token, { secure: true });
    cookies().set("email", user.email, { secure: true });
    cookies().set("name", user.name, { secure: true });
    return true
  }/* else {
    await prisma.users.create({
      data: {...values, name: "Troy"}
    })
    let token = await signJWT(values)
    cookies().set("userAuth", token, { secure: true });
    cookies().set("email", values.email, { secure: true });
    cookies().set("name", values.email, { secure: true });
  return true
  }*/
  return false

};

export const deleteAuthCookie = async () => {
  cookies().delete("userAuth");
};
