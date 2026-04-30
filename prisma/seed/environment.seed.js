export default async function seedEnvironment(prisma) {
  await prisma.environmentList.createMany({
    data: [
      { name: "Development (DEV)" },
      { name: "Local" },
      { name: "Testing / QA" },
      { name: "Integration" },
      { name: "Staging" },
      { name: "User Acceptance Testing (UAT)" },
      { name: "Pre-production" },
      { name: "Production (PROD)" },
      { name: "Sandbox" },
      { name: "Performance / Load Testing" },
      { name: "Disaster Recovery (DR)" },
      { name: "Demo" }
    ],
    skipDuplicates: true
  })

  console.log("✅ Environment seeded")
}