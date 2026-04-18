import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export const createAdminService = async ({ user_name, email, password }) => {

  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      user_name,
      email,
      password: hashed,
      role: "ADMIN",
    },
  });
};