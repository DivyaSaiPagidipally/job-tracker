// @ts-ignore
import { PrismaClient } from "../app/generated/prisma/client";
// @ts-ignore
const p = new PrismaClient();
p.$connect().then(()=>console.log('Success connecting to TiDB!')).catch(e=>console.log(e));
