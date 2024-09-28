import { SignJWT, jwtVerify } from "jose";
const secret = Buffer.from(process.env.JWT_SECRET_KEY)

export const signJWT = async (payload) => {
  try {
    const alg = "HS256";
    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime('24d')
      .setIssuedAt()
      // .setSubject(payload.sub)
      .sign(secret);
  } catch (error) {
    throw error;
  }
}



export const verifyJWT = async (token) => {
  try {
    return (
      await jwtVerify(
        token,
        secret
      )
    ).payload;
  } catch (error) {
    console.log(error);
    throw new Error("Your token has expired.");
  }
}

export const getUser = async (req) => {
  let token = req.cookies.get('userAuth').value
  return await verifyJWT(token)
}
