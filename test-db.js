import { PrismaClient } from './app/generated/prisma/client.js';

async function test() {
  try {
    const prisma = new PrismaClient({});
    await prisma.$connect();
    console.log("Connected Successfully");
  } catch(e) {
    console.error("Error from Prisma:", e);
  }
}
test();
