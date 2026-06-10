import { PrismaClient } from "@prisma/client";
import seedUser from "./user.seed.js";
import seedProvider from "./service.provider.seed.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");


  //await seedUser(prisma);
      await seedProvider(prisma)

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
