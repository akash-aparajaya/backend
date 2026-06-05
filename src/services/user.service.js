import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "./email.service.js";
import {
  accountSetupTemplate
} from "../templates/accountSetup.template.js";

/* -------- create user -------- */
export const createUser = async (
  user_name,
  email,
  role,
  is_active,
) => {

  const isEmailExists = await prisma.user.findFirst({
    where: {
      email,
      is_deleted: false,
    },
  });

  if (isEmailExists) {
    throw new Error("Email already exists");
  }

  const setupToken =
    crypto.randomBytes(32).toString("hex");

  const expiry =
    new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

  const user =
    await prisma.user.create({
      data: {
        user_name,
        email,
        password: null,
        credential_passkey: null,
        role,
        is_active,
        reset_token: setupToken,
        reset_token_expiry: expiry,
      },
    });

  const setupUrl =
    `${process.env.FRONTEND_URL}/setup-account/${setupToken}`;

  const html =
    accountSetupTemplate({
      userName: user_name,
      setupUrl,
    });

  await sendEmail({
    to: email,
    subject: "Setup Your Account",
    message: "Please setup your account.",
    html,

  });
  console.log("Onboarding email sent");
  return user;
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

/*-------- get user assigned projects and environments -------- */

// Utility function to mask API keys (show only first 4 and last 4 characters)
const maskValue = (value) => {
  if (!value || typeof value !== "string") return value;

  if (value.length <= 5) {
    return "••••";
  }

  return `${value.slice(0, 4)}•••••${value.slice(-4)}`;
};

// Function to get user assigned projects and environments with masked API keys
export const userAssignedProjectsEnvironments = async (
  user_id,
  mask_secrets = true,
) => {
  const assignedEnvironments = await prisma.environmentEmployee.findMany({
    where: {
      user_id,
      status: true,
    },

    include: {
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

          api_keys: {
            where: {
              is_active: true,
              is_deleted: false,
            },

            select: {
              public_id: true,
              prefix: true,
              mode: true,
              expires_in_days: true,
              created_at: true,
              last_used_at: true,
            },
          },

          environment_service_providers: {
            where: {
              is_active: true,
            },
            orderBy: {
              sort_order: "asc",
            },
            include: {
              provider: {
                select: {
                  public_id: true,
                  name: true,
                  slug: true,
                  base_endpoint: true,
                },
              },

              service_type: {
                select: {
                  public_id: true,
                  name: true,
                  description: true,
                  service_base_endpoint: true,
                  is_failover: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const projectMap = new Map();

  const order = ["SMS", "Email", "WhatsApp", "IBV", "Credit Score", "Payment Gateway", "ACH"];

  assignedEnvironments.forEach(({ project, environment }) => {
    if (!project || !environment) return;

    if (!projectMap.has(project.public_id)) {
      projectMap.set(project.public_id, {
        public_id: project.public_id,
        project_name: project.project_name,
        project_description: project.project_description,
        environments: [],
      });
    }

    // ==================================================
    // GROUP BY SERVICE TYPE (EMAIL, SMS, WHATSAPP)
    // ==================================================

    const serviceMap = new Map();

    (environment.environment_service_providers || []).forEach((service) => {
      const serviceKey = service.service_type_id;

      if (!serviceMap.has(serviceKey)) {
        serviceMap.set(serviceKey, {
          id: service.service_type?.public_id,

          service_name: service.service_type?.name || "Unknown Service",

          is_failover: service.service_type?.is_failover || false,

          service_endpoint: service.service_type?.service_base_endpoint || "",

          service_description: service.service_type?.description || "",

          sandbox: [],
          live: [],
        });
      }

      const serviceItem = serviceMap.get(serviceKey);

      // ==================================================
      // BUILD CREDENTIAL OBJECT
      // ==================================================

      const credentialData = {
        ...(service.credentials || {}),
      };

      // ==================================================
      // MASK VALUES IF REQUESTED
      // ==================================================

      if (mask_secrets) {
        Object.keys(credentialData).forEach((key) => {
          credentialData[key] = maskValue(String(credentialData[key]));
        });
      }

      credentialData.provider_name = service.provider?.name || "";

      credentialData.service_type = service.service_type?.name || "";

      const mode = (service.mode || "").toLowerCase();

      if (mode === "sandbox") {
        serviceItem.sandbox.push(credentialData);
      }

      if (mode === "live") {
        serviceItem.live.push(credentialData);
      }
    });

    // ==================================================
    // FORMAT API KEYS
    // ==================================================

    const formattedApiKeys = (environment.api_keys || []).map((key) => {
      const currentDate = new Date();

      const createdDate = new Date(key.created_at);

      const expiryDate = new Date(createdDate);

      expiryDate.setDate(expiryDate.getDate() + (key.expires_in_days || 0));

      const remainingMs = expiryDate.getTime() - currentDate.getTime();

      const remainingDays = Math.max(
        Math.ceil(remainingMs / (1000 * 60 * 60 * 24)),
        0,
      );

      const generated = !!key.prefix && remainingDays > 0;

      return {
        public_id: key.public_id,

        prefix: key.prefix,

        mode: key.mode,

        expires_in_days: key.expires_in_days,

        created_at: key.created_at,

        last_used_at: key.last_used_at,

        expiry_date: expiryDate,

        remaining_days: remainingDays,

        token_status: generated ? "Generated" : "Not Generated",

        is_expired: remainingDays <= 0,
      };
    });

    const formattedEnvironment = {
      public_id: environment.public_id,

      environment_name: environment.environment_name,

      api_keys: formattedApiKeys,

      services: Array.from(serviceMap.values()).sort(
        (a, b) => order.indexOf(a.service_name) - order.indexOf(b.service_name),
      ),
    };

    projectMap.get(project.public_id).environments.push(formattedEnvironment);
  });

  return Array.from(projectMap.values());
};
