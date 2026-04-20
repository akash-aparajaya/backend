import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export const createAdminService = async ({ user_name, email, password }) => {

  const hashed = await bcrypt.hash(password, 10);

  const checkExistingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN", is_deleted: false },
  });

  if (checkExistingAdmin) throw new Error("User already exists");

  return prisma.user.create({
    data: {
      user_name,
      email,
      password: hashed,
      role: "ADMIN",
    },
  });
};