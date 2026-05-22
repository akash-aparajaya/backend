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
  const isEmailExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isEmailExists) {
    throw new Error("Email already exists");
  }
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
  const [adminCount, activeServices, activeProjects] = await Promise.all([
    prisma.user.count({
      where: {
        // role: "ADMIN",
        is_deleted: false,
      },
    }),

    prisma.ServiceType.count({
      where: {
        is_active: true,
      },
    }),

    prisma.project.count({
      where: {
        is_active: true,
      },
    }),
  ]);

  return {
    totalAdmins: adminCount,
    totalServices: activeServices,
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

export const getUserDetailsWithProjectsAndEnvironments = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { public_id: userId },
    select: {
      public_id: true,
      user_name: true,
      email: true,
      role: true,
      is_active: true,

      environmentEmployees: {
        where: { status: true },
        select: {
          project: {
            select: {
              public_id: true,
              project_name: true,
              project_description: true,
            },
          },
          environment: {
            select: {
              public_id: true,
              environment_name: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  // 🔥 group into clean structure
  const projectMap = new Map();

  user.environmentEmployees.forEach((item) => {
    const projectId = item.project.public_id;

    if (!projectMap.has(projectId)) {
      projectMap.set(projectId, {
        public_id: projectId,
        project_name: item.project.project_name,
        project_description: item.project.project_description,
        environments: [],
      });
    }

    projectMap.get(projectId).environments.push(item.environment);
  });

  return {
    public_id: user.public_id,
    user_name: user.user_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    projects: Array.from(projectMap.values()),
  };
};

export const removeEnvironmentFromUser = async (
  user_id,
  environment_id,
  project_id,
) => {
  await prisma.environmentEmployee.update({
    where: {
      environment_id_user_id_project_id: {
        environment_id,
        user_id,
        project_id,
      },
    },
    data: {
      status: false,
    },
  });
};
