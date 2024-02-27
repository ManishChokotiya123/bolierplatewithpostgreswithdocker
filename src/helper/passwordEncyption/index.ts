import { compare, hash } from "bcrypt";

export async function createhash(data: string) {
  return await hash(data, 10);
}

export async function comparePassword(password: any, hashPassword: any) {
  return await compare(password, hashPassword);
}
