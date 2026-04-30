import { PrismaClient } from "@prisma/client";
// import seedEnvironment from './environment.seed.js'
import seedUser from "./user.seed.js";
// const seedProvider = require('./provider.seed')

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  //   await seedEnvironment(prisma)
  await seedUser(prisma);
  //   await seedProvider(prisma)

  console.log("🎉 All seeds completed");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
