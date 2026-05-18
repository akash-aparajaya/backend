import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

/* -------- create user -------- */
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

/* -------- get all users -------- */
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      is_deleted: false,
    },
    select: {
      id: true,
      public_id: true,
      user_name: true,
      email: true,
      role: true,
      is_active: true,
    },

    orderBy: {
      created_at: "desc",
    },
  });

  // Use .map() to format every user in the list
  return users.map((user) => ({
    id: user.public_id,
    user_name: user.user_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  }));
};

/* -------- change user status -------- */
export const changeUserStatus = async (userId, is_active) => {
  return await prisma.user.update({
    where: { public_id: userId },
    data: { is_active },
    select: {
      public_id: true,
      is_active: true,
    },
  });
};

/* -------- get user by id -------- */
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { public_id: id },
    select: {
      id: true,
      user_name: true,
      email: true,
      role: true,
      is_active: true,
      last_login_at: true,
      created_at: true,
      is_deleted: true,
    },
  });
};

/*-------- get stats data -------- */
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
    //     is_active: true,
    //   },
    // }),

    prisma.project.count({
      where: {
        is_active: true,
      },
    }),
  ]);

  return {
    totalAdmins: adminCount,
    totalServices: 2, // unique service names
    totalActiveProjects: activeProjects,
  };
};

/* -------- change password -------- */
export const changePassword = async (userId, password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return await prisma.user.update({
    where: { public_id: userId },
    data: { password: hashedPassword },
  });
};

/* -------- update user -------- */
export const updateUser = async (userId, updatedData) => {
  return await prisma.user.update({
    where: { public_id: userId },
    data: updatedData,
  });
};

/* -------- delete user -------- */
export const deleteUser = async (userId) =>
  await prisma.user.update({
    where: { public_id: userId },
    data: { is_deleted: true },
  });
