import nodemailer from "nodemailer";
import axios from "axios";

// Primary transporter
const primaryTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Secondary transporter
const secondaryTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL2_USER,
    pass: process.env.EMAIL2_PASS,
  },
});

// Slack alert
const sendSlackAlert = async (message) => {
  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `🚨 Email Service Failed:\n${message}`,
    });
  } catch (err) {
    console.error("Slack alert failed:", err.message);
  }
};

export const sendEmail = async ({ to, subject, message }) => {
  try {
    // 🔹 Try Primary
    const res = await primaryTransport.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    });

    return { success: true, provider: "PRIMARY", messageId: res.messageId };

  } catch (err1) {
    console.warn("Primary failed, trying secondary...");

    try {
      // 🔹 Try Secondary
      const res2 = await secondaryTransport.sendMail({
        from: process.env.EMAIL2_USER,
        to,
        subject,
        text: message,
      });

      return { success: true, provider: "SECONDARY", messageId: res2.messageId };

    } catch (err2) {
      console.error("Both email providers failed");

      // 🔹 Slack Alert
      await sendSlackAlert(
        `Primary Error: ${err1.message}\nSecondary Error: ${err2.message}`
      );

      return {
        success: false,
        error: "Both providers failed. Slack alerted.",
      };
    }
  }
};