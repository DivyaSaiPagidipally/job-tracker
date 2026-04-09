// @ts-ignore
import { PrismaClient } from "../app/generated/prisma/client.js";

async function main() {
  const p = new PrismaClient({} as any);
  await p.$connect();
  console.log('Connected natively to TiDB without adapter!');
  process.exit(0);
}
main().catch(console.error);
