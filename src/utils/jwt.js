import jwt from "jsonwebtoken";
import crypto from "crypto";

/* -------- generate JWT tokens --------- */
export const generateAccessToken = async (user) => {
  return jwt.sign(
    {
      id: user.public_id,
      role: user.role,
      name: user.user_name,
      jti: crypto.randomUUID(),
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};

/* -------- generate JWT refresh token --------- */
export const generateRefreshToken = async (user) => {
  return jwt.sign(
    {
      id: user.public_id,
      role: user.role,
      name: user.user_name,
      jti: crypto.randomUUID(),
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
  );
};

/* -------- verify JWT refresh token --------- */
export const verifyRefreshToken = async (token) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  return jwt.verify(token, secret);
};
