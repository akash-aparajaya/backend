import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      is_deleted: false,
    },
  });

  if (!user) {
    throw new Error("email is incorrect");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Password is incorrect");
  }

  // ✅ Generate tokens
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  // 🔐 Store hashed refresh token
  const hash = await bcrypt.hash(refreshToken, 12);

  await prisma.user.update({
    where: { public_id: user.public_id },
    data: {
      last_login_at: new Date(),
      refresh_token_hash: hash,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshService = async ({
  refreshToken,
}) => {

  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  let payload;

  try {

    payload = await verifyRefreshToken(
      refreshToken
    );

  } catch (error) {

    throw new Error(
      "Invalid or expired refresh token"
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      public_id: payload.id,
    },
  });

  if (
    !user ||
    !user.refresh_token_hash
  ) {
    throw new Error("Session not found");
  }

  const isMatch = await bcrypt.compare(
    refreshToken,
    user.refresh_token_hash
  );

  if (!isMatch) {

    await prisma.user.update({
      where: {
        public_id: user.public_id,
      },
      data: {
        refresh_token_hash: null,
      },
    });

    throw new Error(
      "Refresh token reuse detected"
    );
  }

  const newAccessToken =
    await generateAccessToken(user);

  const newRefreshToken =
    await generateRefreshToken(user);

  const newHash = await bcrypt.hash(
    newRefreshToken,
    12
  );

  await prisma.user.update({
    where: {
      public_id: user.public_id,
    },
    data: {
      refresh_token_hash: newHash,
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutService = async (userId) => {
  await prisma.user.update({
    where: { public_id: userId },
    data: {
      refresh_token_hash: null,
    },
  });

  return { message: "Logged out successfully" };
};

export const forgotPasswordService = async ({ email }) => {

  const user = await prisma.user.findFirst({
    where: {
      email,
      is_deleted: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const reset_token = crypto.randomBytes(32).toString("hex");

  const reset_token_expiry = new Date(
    Date.now() + 60 * 60 * 1000
  );

  await prisma.user.update({
    where: {
      public_id: user.public_id,
    },
    data: {
      reset_token: reset_token,
      reset_token_expiry: reset_token_expiry,
    },
  });

  // remaining code...
};

export const resetPasswordService = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      reset_token: token,
      reset_token_expiry: {
        gte: new Date(),
      },
    },
  });
  if (!user) {
    console.log(user, "user");
    throw new Error("Invalid or expired token");
  }

  let password = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { public_id: user.public_id },
    data: {
      password: password,
      reset_token: null,
      reset_token_expiry: null,
    },
  });

  return { message: "Password reset successful" };
};

export const updatePasswordService = async (user_id, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      public_id: user_id,
      is_active: true,
      is_deleted: false,
    },
  });
  if (!user) {
    throw new Error("Invalid or expired token");
  }

  let password = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { public_id: user.public_id },
    data: {
      password: password,
    },
  });

  return { message: "Password reset successful" };
};
