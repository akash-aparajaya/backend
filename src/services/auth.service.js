import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import crypto from "crypto";
import { accountActivatedTemplate } from "../templates/accountActivated.template.js";
import { sendEmail } from "../services/email.service.js";
import { passkeyResetTemplate } from "../templates/passkeyReset.template.js";
import { passwordResetTemplate }
  from "../templates/passwordReset.template.js";

/* -------- LOGIN -------- */
export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      is_deleted: false,
    },
  });

  if (!user) {
    throw {
      message: "Invalid Email",
      statusCode: 404,
    };
  }
  if (!user.password) {
    throw {
      message: "Account not activated",
      statusCode: 400,
    };
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw {
      message: "Invalid Password",
      statusCode: 400,
    };
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

/* -------- REFRESH TOKEN -------- */
export const refreshService = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw {
      message: "Refresh token is required",
      statusCode: 400,
    };
  }

  let payload;

  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: {
      public_id: payload.id,
    },
  });

  if (!user || !user.refresh_token_hash) {
    throw {
      message: "Invalid or expired refresh token",
      statusCode: 400,
    };
  }

  const isMatch = await bcrypt.compare(refreshToken, user.refresh_token_hash);

  if (!isMatch) {
    await prisma.user.update({
      where: {
        public_id: user.public_id,
      },
      data: {
        refresh_token_hash: null,
      },
    });

    throw new Error("Refresh token reuse detected");
  }

  const newAccessToken = await generateAccessToken(user);

  const newRefreshToken = await generateRefreshToken(user);

  const newHash = await bcrypt.hash(newRefreshToken, 12);

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

/* -------- LOGOUT -------- */
export const logoutService = async (userId) => {
  if (!userId) {
    throw {
      message: "User ID is required",
      statusCode: 400,
    };
  }
  await prisma.user.update({
    where: { public_id: userId },
    data: {
      refresh_token_hash: null,
    },
  });

  return { message: "Logged out successfully" };
};

/* -------- RESET PASSWORD -------- */
export const resetPasswordService = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      reset_token: token,
      reset_token_expiry: {
        gte: new Date(),
      },
      reset_token_type: "PASSWORD_RESET"
    },
  });

  if (!user) {
    throw {
      message: "Invalid or expired token",
      statusCode: 400,
    };
  }

  let password = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { public_id: user.public_id },
    data: {
      password: password,
      reset_token: null,
      reset_token_expiry: null,
      reset_token_type: null,
    },
  });

  return { message: "Password reset successful" };
};

/* -------- UPDATE PASSWORD -------- */
export const updatePasswordService = async (user_id, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      public_id: user_id,
      is_active: true,
      is_deleted: false,
    },
  });

  if (!user) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
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

/* -------- USER VERIFY SENSITIVE USER ACCESS -------- */
export const userVerification = async (
  user_id,
  passKey
) => {

  const user = await prisma.user.findFirst({
    where: {
      public_id: user_id,
      is_active: true,
      is_deleted: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.credential_passkey) {
    throw new Error("Credential passkey not configured");
  }

  const isValid = await bcrypt.compare(
    passKey,
    user.credential_passkey
  );

  if (!isValid) {
    throw new Error("Invalid passkey");
  }

  return true;
};

/* -------- VALIDATE SETUP TOKEN -------- */
export const validateSetupTokenService = async (token) => {
  const user = await prisma.user.findFirst({
    where: {
      reset_token: token,
      reset_token_type: "SETUP_ACCOUNT",
    },
  });

  if (!user) {
    return {
      status: "configured",
    };
  }

  if (user.reset_token_expiry < new Date()) {
    return {
      status: "expired",
    };
  }

  return {
    status: "valid",
    email: user.email,
    user_name: user.user_name,
  };
};

/* -------- COMPLETE SETUP PASSWORD AND PASSKEY -------- */
export const completeSetupService = async ({
  token,
  password,
  credentialPasskey,
}) => {
  const user = await prisma.user.findFirst({
    where: {
      reset_token: token,
      reset_token_expiry: {
        gte: new Date(),
      },
      reset_token_type: "SETUP_ACCOUNT",
    },
  });

  if (!user) {
    throw {
      message: "Invalid or expired token",
      statusCode: 400,
    };
  }

  if (!/^\d{6}$/.test(credentialPasskey)) {
    throw {
      message: "Invalid Passkey",
      statusCode: 400,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const hashedPasskey = await bcrypt.hash(credentialPasskey, 12);

  await prisma.user.update({
    where: {
      public_id: user.public_id,
    },
    data: {
      password: hashedPassword,
      credential_passkey: hashedPasskey,
      reset_token: null,
      reset_token_expiry: null,
      reset_token_type: null,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Your Account Has Been Activated",
    html: accountActivatedTemplate({
      userName: user.user_name,
      loginUrl: `${process.env.FRONTEND_URL}/`,
    }),
  });

  return {
    success: true,
  };
};


// -------- UPDATE CREDENTIAL PASSKEY --------
export const updateCredentialPasskeyService = async (
  user_id,
  currentPasskey,
  newPasskey
) => {

  const user = await prisma.user.findFirst({
    where: {
      public_id: user_id,
      is_active: true,
      is_deleted: false,
    },
  });

  if (!user) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
  }

  if (!user.credential_passkey) {
    throw {
      message: "Credential passkey not configured",
      statusCode: 400,
    };
  }

  const isValid = await bcrypt.compare(
    currentPasskey,
    user.credential_passkey
  );

  if (!isValid) {
    throw {
      message: "Current passkey is incorrect",
      statusCode: 400,
    };
  }

  if (!/^\d{6}$/.test(newPasskey)) {
    throw {
      message: "Passkey must be exactly 6 digits",
      statusCode: 400,
    };
  }

  const samePasskey = await bcrypt.compare(
    newPasskey,
    user.credential_passkey
  );

  if (samePasskey) {
    throw {
      message: "New passkey cannot be same as current passkey",
      statusCode: 400,
    };
  }

  const hashedPasskey = await bcrypt.hash(
    newPasskey,
    12
  );

  await prisma.user.update({
    where: {
      public_id: user.public_id,
    },
    data: {
      credential_passkey: hashedPasskey,
    },
  });

  return {
    success: true,
  };
};

// Validate password or passkey before update
export const validateUserSecretService = async (
  user_id,
  value,
  type
) => {

  const user = await prisma.user.findFirst({
    where: {
      public_id: user_id,
      is_active: true,
      is_deleted: false,
    },
    select: {
      password: true,
      credential_passkey: true,
    },
  });

  if (!user) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
  }

  if (
    type !== "password" &&
    type !== "passkey"
  ) {
    throw {
      message: "Invalid validation type",
      statusCode: 400,
    };
  }

  const hash =
    type === "password"
      ? user.password
      : user.credential_passkey;

  const isValid = await bcrypt.compare(
    value,
    hash
  );

  if (!isValid) {
    throw {
      message:
        type === "password"
          ? "Current password is incorrect"
          : "Current passkey is incorrect",
      statusCode: 400,
    };
  }

  return true;
};


// -------- FORGOT PASSKEY --------
export const forgotPasskeyService = async (
  userId
) => {

  const user = await prisma.user.findFirst({
    where: {
      public_id: userId,
      is_deleted: false,
    },
  });

  if (!user) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
  }

  const token =
    crypto.randomBytes(32).toString("hex");

  const expiry =
    new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: {
      public_id: user.public_id,
    },
    data: {
      reset_token: token,
      reset_token_expiry: expiry,
      reset_token_type: "PASSKEY_RESET",
    },
  });

  const resetUrl =
    `${process.env.FRONTEND_URL}/reset-passkey/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Credential Passkey",
    html: passkeyResetTemplate({
      userName: user.user_name,
      resetUrl,
    }),
  });

  return true;
};


// -------- RESET PASSKEY --------
export const resetPasskeyService = async (
  token,
  passkey
) => {

  const user =
    await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_type:
          "PASSKEY_RESET",
        reset_token_expiry: {
          gte: new Date(),
        },
      },
    });

  if (!user) {
    throw {
      message:
        "Invalid or expired token",
      statusCode: 400,
    };
  }

  if (!/^\d{6}$/.test(passkey)) {
    throw {
      message:
        "Passkey must be exactly 6 digits",
      statusCode: 400,
    };
  }

  const hashedPasskey =
    await bcrypt.hash(passkey, 12);

  await prisma.user.update({
    where: {
      public_id: user.public_id,
    },
    data: {
      credential_passkey:
        hashedPasskey,

      reset_token: null,
      reset_token_expiry: null,
      reset_token_type: null,
    },
  });

  return true;
};

// -------- FORGOT PASSWORD - used inside the profile page to find whether the user is already logged in or not --------
export const forgotPasswordSelfService = async (
  userId
) => {

  const user =
    await prisma.user.findFirst({
      where: {
        public_id: userId,
        is_deleted: false,
      },
    });

  if (!user) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
  }

  const token =
    crypto.randomBytes(32).toString("hex");

  const expiry =
    new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: {
      public_id: user.public_id,
    },
    data: {
      reset_token: token,
      reset_token_expiry: expiry,
      reset_token_type: "PASSWORD_RESET",
    },
  });

  const resetUrl =
    `${process.env.FRONTEND_URL}/forgot-password/${token}`;

  const emailRes =
    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: passwordResetTemplate({
        userName: user.user_name,
        resetUrl,
      }),
    });

  if (!emailRes.success) {
    throw {
      message: "Failed to send reset email",
      statusCode: 500,
    };
  }

  return true;
};

// -------- VALIDATE PASSWORD RESET TOKEN --------
export const validatePasswordResetTokenService =
  async (token) => {

    const user =
      await prisma.user.findFirst({
        where: {
          reset_token: token,
          reset_token_type:
            "PASSWORD_RESET",
        },
      });

    if (!user) {
      return {
        status: "expired",
      };
    }

    if (
      user.reset_token_expiry <
      new Date()
    ) {
      return {
        status: "expired",
      };
    }

    return {
      status: "valid",
    };
  };

// -------- VALIDATE PASSKEY RESET TOKEN --------
export const validatePasskeyResetTokenService =
  async (token) => {

    const user =
      await prisma.user.findFirst({
        where: {
          reset_token: token,
          reset_token_type:
            "PASSKEY_RESET",
        },
      });

    if (!user) {
      return {
        status: "expired",
      };
    }

    if (
      user.reset_token_expiry <
      new Date()
    ) {
      return {
        status: "expired",
      };
    }

    return {
      status: "valid",
    };
  };

// -------- FORGOT PASSWORD --------
export const forgotPasswordService = async (
  email
) => {

  const user =
    await prisma.user.findFirst({
      where: {
        email,
        is_deleted: false,
      },
    });

  if (!user) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
  }

  const token =
    crypto.randomBytes(32).toString("hex");

  const expiry =
    new Date(
      Date.now() + 60 * 60 * 1000
    );

  await prisma.user.update({
    where: {
      public_id: user.public_id,
    },
    data: {
      reset_token: token,
      reset_token_expiry: expiry,
      reset_token_type:
        "PASSWORD_RESET",
    },
  });

  const resetUrl =
    `${process.env.FRONTEND_URL}/forgot-password/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    html: passwordResetTemplate({
      userName:
        user.user_name,
      resetUrl,
    }),
  });

  return true;
};