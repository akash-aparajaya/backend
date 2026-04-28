import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export const createAdminService = async ({ name, email, password, role }) => {
  const hashed = await bcrypt.hash(password, 10);

  // 1. Changed findUnique to findFirst to allow the is_deleted check
  const checkExistingAdmin = await prisma.user.findFirst({
    where: { 
      email: email, 
      is_deleted: false 
    },
  });

  if (checkExistingAdmin) throw new Error("User already exists");

  console.log("Creating user:", name, email, role);

  // 2. Wrapped everything in the 'data' property
  return prisma.user.create({
    data: {
      user_name: name,
      email: email,
      password: hashed,
      role: "ADMIN", // Forced to uppercase to match your Enum
    },
  });
};