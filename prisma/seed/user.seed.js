import bcrypt from 'bcrypt'

export default async function seedUser(prisma) {
  const saltRounds = 12

  // hash passwords
  const adminPassword = await bcrypt.hash("123456789", saltRounds)

  await prisma.user.createMany({
    data: [
      {
        user_name: "admin",
        email: "admin@gmail.com",
        role: "SUPER_ADMIN",
        password: adminPassword
      }
    ],
    skipDuplicates: true
  })

  console.log("✅ User seeded with hashed passwords")
}