import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "./email.service.js";
import { accountSetupTemplate } from "../templates/accountSetup.template.js";
import cloudinary from "../config/cloudinary.js";

/* -------- create user -------- */
export const createUser = async (user_name, email, role, is_active) => {
  const isEmailExists = await prisma.user.findFirst({
    where: {
      email,
      is_deleted: false,
    },
  });

  if (isEmailExists) {
    throw {
      message: "Email already exists",
      statusCode: 400,
    };
  }

  const setupToken = crypto.randomBytes(32).toString("hex");

  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      user_name,
      email,
      password: null,
      credential_passkey: null,
      role,
      is_active,
      reset_token: setupToken,
      reset_token_expiry: expiry,
      reset_token_type: "SETUP_ACCOUNT",
    },
  });

  if (!user) {
    throw {
      message: "Failed to create user",
      statusCode: 500,
    };
  }

  const setupUrl = `${process.env.FRONTEND_URL}/#/setup-account/${setupToken}`;

  const html = accountSetupTemplate({
    userName: user_name,
    setupUrl,
  });

  const emailRes = await sendEmail({
    to: email,
    subject: "Setup Your Account",
    message: "Please setup your account.",
    html,
  });

  if (!emailRes.success) {
    throw {
      message: "Failed to send email",
      statusCode: 500,
    };
  }

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
      profile_image: true,
    },

    orderBy: {
      created_at: "desc",
    },
  });

  if (!users) {
    throw {
      message: "Failed to retrieve users",
      statusCode: 500,
    };
  }
  // Use .map() to format every user in the list
  return users.map((user) => ({
    id: user.public_id,
    user_name: user.user_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    profile_image: user.profile_image,
  }));
};

/* -------- change user status -------- */
export const changeUserStatus = async (userId, is_active) => {
  const user = await prisma.user.update({
    where: { public_id: userId },
    data: { is_active },
    select: {
      public_id: true,
      is_active: true,
    },
  });

  if (!user) {
    throw {
      message: "Failed to update user status",
      statusCode: 500,
    };
  }

  return user;
};

/* -------- get user by id -------- */
export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { public_id: id },
    select: {
      id: true,
      public_id: true,
      user_name: true,
      email: true,
      role: true,
      is_active: true,
      last_login_at: true,
      created_at: true,
      is_deleted: true,
    },
  });

  if (!user) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
  }

  if (user.last_login_at) {
    user.last_login_at = user.last_login_at.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
  }

  return user;
};

/*-------- get stats data -------- */
export const getStatsData = async () => {
  const [adminCount, activeServices, activeProjects] = await Promise.all([
    prisma.user.count({
      where: {
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
        is_deleted: false,
      },
    }),
  ]);

  console.log(adminCount, activeServices, activeProjects);
  if (adminCount == null || activeServices == null || activeProjects == null) {
    throw new Error("Failed to get stats data");
  }

  return {
    totalAdmins: adminCount,
    totalServices: activeServices,
    totalActiveProjects: activeProjects,
  };
};

/* -------- change password -------- */
export const changePassword = async (userId, password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.update({
    where: { public_id: userId },
    data: { password: hashedPassword },
  });

  if (!user) {
    throw {
      message: "Failed to change password",
      statusCode: 500,
    };
  }

  return user;
};

/* -------- update user -------- */
export const updateUser = async (userId, updatedData) => {
  const user = await prisma.user.update({
    where: { public_id: userId },
    data: updatedData,
  });

  if (!user) {
    throw {
      message: "Failed to update user",
      statusCode: 500,
    };
  }

  return user;
};

/* -------- delete user -------- */
export const deleteUser = async (userId) => {
  const user = await prisma.user.update({
    where: { public_id: userId },
    data: { is_deleted: true },
  });

  await prisma.environmentEmployee.updateMany({
    where: { user_id: userId },
    data: { status: false },
  });

  if (!user) {
    throw {
      message: "Failed to delete user",
      statusCode: 500,
    };
  }

  return user;
};

/* -------- get user details with projects and environments -------- */
export const getUserDetailsWithProjectsAndEnvironments = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { public_id: userId },
    select: {
      public_id: true,
      user_name: true,
      email: true,
      role: true,
      is_active: true,
      profile_image: true,

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

  if (!user) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
  }

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
    profile_image: user.profile_image,
    projects: Array.from(projectMap.values()),
  };
};

/* -------- remove environment from user -------- */
export const removeEnvironmentFromUser = async (
  user_id,
  environment_id,
  project_id,
) => {
  const removeEnvironmentFromUser = await prisma.environmentEmployee.update({
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

  if (!removeEnvironmentFromUser) {
    throw {
      message: "Failed to remove environment from user",
      statusCode: 500,
    };
  }

  return removeEnvironmentFromUser;
};

/*-------- get user assigned projects and environments -------- */

/*-------- mask value -------- */
const maskValue = (value) => {
  if (!value || typeof value !== "string") return value;

  const len = value.length;

  if (len <= 4) {
    return "****";
  }

  if (len <= 8) {
    return `${value.slice(0, 2)}****${value.slice(-2)}`;
  }

  return `${value.slice(0, 4)}${"*".repeat(Math.min(len - 8, 8))}${value.slice(-4)}`;
};

/*-------- sanitize credential -------- */
const NON_SECRET_KEYS = [
  "provider_name",
  "service_type",
  "service_description",
  "credential_id",
];
const STRIP_KEYS = ["mode", "endpoint"];

/*-------- service order -------- */
const SERVICE_ORDER = [
  "SMS",
  "Email",
  "WhatsApp",
  "IBV",
  "Credit Score",
  "Payment Gateway",
  "ACH",
];

function sanitizeCredential(service, mask_secrets) {
  const credential = {
    ...(service.credentials || {}),
    credential_id: service.public_id,
    provider_name: service.provider?.name || "",
    service_type: service.service_type.name || "",
  };
  STRIP_KEYS.forEach((key) => {
    delete credential[key];
  });

  if (mask_secrets) {
    Object.keys(credential).forEach((key) => {
      if (!NON_SECRET_KEYS.includes(key)) {
        credential[key] = maskValue(String(credential[key]));
      }
    });
  }

  return credential;
}

function formatApiKey(key) {
  const createdDate = new Date(key.created_at);
  const expiryDate = new Date(createdDate);

  expiryDate.setDate(expiryDate.getDate() + (key.expires_in_days || 0));

  const remainingDays = Math.max(
    Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    0,
  );

  return {
    public_id: key.public_id,
    prefix: key.prefix,
    mode: key.mode,
    expires_in_days: key.expires_in_days,
    created_at: key.created_at,
    last_used_at: key.last_used_at,
    expiry_date: expiryDate,
    remaining_days: remainingDays,
    token_status:
      key.prefix && remainingDays > 0 ? "Generated" : "Not Generated",
    is_expired: remainingDays <= 0,
  };
}

function sortByServiceOrder(a, b) {
  const ai = SERVICE_ORDER.indexOf(a.service_name);
  const bi = SERVICE_ORDER.indexOf(b.service_name);

  return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
}

/*-------- get user assigned projects and environments -------- */
export const userAssignedProjectsEnvironments = async (
  user_id,
  mask_secrets = true,
) => {
  if (!user_id) {
    throw {
      message: "User ID is required",
      statusCode: 400,
    };
  }
  const assignedEnvironments = await prisma.environmentEmployee.findMany({
    where: {
      user_id,
      status: true,
      project: {
        is_active: true,
        is_deleted: false,
      },
      environment: {
        is_active: true,
        is_deleted: false,
      }
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
                  base_endpoint: false,
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
  if (!assignedEnvironments) {
    return [];
  }

  const projectMap = new Map();

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
      const credentialData = sanitizeCredential(service, mask_secrets);
      const mode = (service.mode || "").toLowerCase();

      if (mode === "sandbox") serviceItem.sandbox.push(credentialData);
      if (mode === "live") serviceItem.live.push(credentialData);
    });

    projectMap.get(project.public_id).environments.push({
      public_id: environment.public_id,
      environment_name: environment.environment_name,
      api_keys: (environment.api_keys || []).map(formatApiKey),
      services: Array.from(serviceMap.values()).sort(sortByServiceOrder),
    });
  });

  return Array.from(projectMap.values());
};

/* -------- get profile -------- */
export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      public_id: userId,
    },
    select: {
      public_id: true,
      user_name: true,
      email: true,
      role: true,
      last_login_at: true,
      phone_number: true,
      description: true,
      profile_image: true,
      is_active: true,
    },
  });

  if (!user) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
  }

  return user;
};

/* -------- update profile -------- */
export const updateProfile = async (userId, data) => {
  let finalProfileImage;

  // Upload image to Cloudinary if provided
  if (data.profile_image && data.profile_image.startsWith("data:")) {
    const result = await cloudinary.uploader.upload(data.profile_image, {
      folder: "user-profile",
    });

    finalProfileImage = result.secure_url;
  }

  const user = await prisma.user.update({
    where: {
      public_id: userId,
    },

    data: {
      ...(data.user_name !== undefined && {
        user_name: data.user_name,
      }),

      ...(data.phone_number !== undefined && {
        phone_number: data.phone_number,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(finalProfileImage && {
        profile_image: finalProfileImage,
      }),
    },

    select: {
      public_id: true,
      user_name: true,
      email: true,
      role: true,
      phone_number: true,
      description: true,
      profile_image: true,
    },
  });

  return user;
};
