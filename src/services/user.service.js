import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export const createUser = async (
  user_name,
  email,
  password,
  role,
  is_active,
) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return await prisma.user.create({
    data: {
      user_name,
      email,
      password: hashedPassword,
      role,
      is_active,
    },
  });
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany(
    {
      where: { is_deleted: false },
    },
    {
      select: {
        id: true,
        public_id:true,
        user_name: true,
        email: true,
        role: true,
        is_active: true,
      },
      orderBy: {
        created_at: "desc",
      },
    },
  );

  // Use .map() to format every user in the list
  return users.map((user) => ({
    id: user.public_id,
    user_name: user.user_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  }));
};

export const changeUserStatus = async (userId, is_active) => {
  return await prisma.user.update({
    where: { public_id: userId },
    data: { is_active },
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      user_name: true,
      email: true,
      role: true,
      is_active: true,
      lastLoginAt: true,
      created_at: true,
      is_deleted: true,
    },
  });
};

export const getStatsData = async () => {
  const [adminCount, activeProjects] = await Promise.all([
    prisma.user.count({
      where: {
        role: "ADMIN",
        is_deleted: false,
      },
    }),

    // prisma.service.groupBy({
    //   by: ["name"],
    //   where: {
    //     isActive: true,
    //   },
    // }),

    prisma.project.count({
      where: {
        isActive: true,
      },
    }),
  ]);

  return {
    totalAdmins: adminCount,
    totalServices: 2, // unique service names
    totalActiveProjects: activeProjects,
  };
};

export const changePassword = async (userId, password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

export const updateUser = async (userId, updatedData) => {
  return await prisma.user.update({
    where: { id: userId },
    data: updatedData,
  });
};

export const deleteUser = async (userId) =>
  await prisma.user.update({
    where: { public_id: userId },
    data: { is_deleted: true },
  });
