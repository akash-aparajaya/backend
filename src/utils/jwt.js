import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken =async (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = async (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, jti: crypto.randomUUID() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

export const verifyRefreshToken = async (token) => {
  const secret = process.env.JWT_REFRESH_SECRET ;
  return jwt.verify(token, secret);
};