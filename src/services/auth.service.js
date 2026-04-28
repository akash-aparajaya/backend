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
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
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
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      refresh_token_hash: hash,
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

export const refreshService = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  // 🔐 Verify token
  let payload;
  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user || !user.refresh_token_hash) {
    throw new Error("Session not found");
  }

  // 🔍 Compare token with stored hash
  const isMatch = await bcrypt.compare(refreshToken, user.refresh_token_hash);

  // 🚨 Token reuse detection
  if (!isMatch) {
    await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token_hash: null },
    });

    throw new Error("Refresh token reuse detected");
  }

  // ✅ Generate new tokens
  const newAccessToken = await generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user);

  // 🔄 Rotate refresh token
  const newHash = await bcrypt.hash(newRefreshToken, 12);

  await prisma.user.update({
    where: { id: user.id },
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
    where: { id: userId },
    data: {
      refresh_token_hash: null,
    },
  });

  return { message: "Logged out successfully" };
};

export const forgotPasswordService = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  const resetLink = `http://localhost:${process.env.FRONTPORT}/forgot-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Tesseract Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Email sending failed");
  }

  return {
    message: "Password reset link sent successfully",
  };
};
export const resetPasswordService = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  let password = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: password,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: "Password reset successful" };
};
