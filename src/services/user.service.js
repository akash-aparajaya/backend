import prisma from "../config/prisma.js";

export const createUser = async (data) => {
  return await prisma.user.create({
    data,
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      user_name: true,
      email: true,
      role: true,
      is_deleted: true
    },
  });
};

export const getStatsData = async () => {
  const [adminCount,  activeProjects] = await Promise.all([
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