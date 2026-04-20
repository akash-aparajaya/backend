import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, message }) => {
  return await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text: message,
  });
};