import prisma from "../config/prisma.js";

export const createUser = async (data) => {
  return await prisma.user.create({
    data,
  });
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      user_name: true,
      email: true,
      role: true,
      is_active: true,
      created_at: true,
    },
  });

  // Use .map() to format every user in the list
  return users.map((user) => ({
    id: user.id,
    name: user.user_name,
    email: user.email,
    role: user.role,
    joined: user.created_at,
    active: user.is_active,
  }));
};
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      user_name: true,
      email: true,
      role: true,
      is_deleted: true,
    },
  });
};

export const getStatsData = async () => {
  const [adminCount, activeProjects] = await Promise.all([
    prisma.user.count({
      where: {
        OR: [
      { role: "ADMIN" },
      { role: "SUPER_ADMIN" }
    ],
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
