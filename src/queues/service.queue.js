import prisma from "../config/prisma.js";

export const createSmsQueueService = async (data) => {
  return prisma.smsQueue.create({
    data,
  });
};

export const createEmailQueueService = async (data) => {
  return prisma.emailQueue.create({
    data,
  });
};

export const createWhatsappQueueService = async (data) => {
  return prisma.whatsappQueue.create({
    data,
  });
};