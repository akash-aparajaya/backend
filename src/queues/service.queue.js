import prisma from "../config/prisma.js";

export const createSmsQueueService = async (data) => {
  return prisma.smsQueue.create({
    data,
  });
};

export const createEmailQueueService = async (data) => {
  console.log("Creating email queue with data:", data);
  return prisma.emailQueue.create({
    data,
  });
};

export const createWhatsappQueueService = async (data) => {
  console.log("Creating WhatsApp queue with data:", data);
  return prisma.whatsappQueue.create({
    data,
  });
};