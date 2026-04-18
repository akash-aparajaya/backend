import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      password: true,
    },
  });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const accessToken = await generateAccessToken({
    id: user.id,
    role: user.role,
    email: user.email,
  });
  const refreshToken = await generateRefreshToken({
    id: user.id,
    role: user.role,
    email: user.email,
  });

  // 💾 store in DB
  await prisma.user.update({
    where: { id: user.id },
    data: {
      refresh_token_hash: await bcrypt.hash(refreshToken, 10),
      refresh_token_expires_at: null
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const createSuperAdminService = async ({
  user_name,
  email,
  password,
}) => {
  if (!user_name || !email || !password) throw new Error("Missing fields");

  const hashed = await bcrypt.hash(password, 12);

  const checkExistingSuperAdmin = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN", is_deleted: false },
  });

  if (checkExistingSuperAdmin) throw new Error("User already exists");

  return await prisma.user.create({
    data: {
      user_name,
      email,
      password: hashed,
      role: "SUPER_ADMIN",
    },
  });
};

export const refreshAccessByToken = async ({ refreshToken }) => {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findFirst({
    where: { id: payload.sub },
  });

  if (!user || !user.refresh_token_hash) {
    throw new Error("Refresh session not found");
  }

  // 🔐 Compare hashed token
  const isMatch = await bcrypt.compare(refreshToken, user.refresh_token_hash);

  if (!isMatch) {
    throw new Error("Refresh token does not match current session");
  }

  // ✅ Generate new access token
  const tokens = {
    accessToken: await generateAccessToken(user),
    refreshToken: await generateRefreshToken(user),
  };

  return tokens;
};

export const logoutService = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      refresh_token_hash: null,
    },
  });
};
