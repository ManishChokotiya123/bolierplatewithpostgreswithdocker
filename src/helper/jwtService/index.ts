import jwt from "jsonwebtoken";

export async function createToken(data: any) {
  const token = await jwt.sign({ data: data }, "this is my secret key ", {
    expiresIn: "1d",
  });
  return token;
}

export async function verifyToken(token: any) {
  const verifyToken = await jwt.verify(token, "this is my secret key ");
  return verifyToken;
}
