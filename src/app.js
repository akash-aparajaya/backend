import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import {smsCron} from  "./workers/cron.js";
import logger from "./utils/logger.js";


// import { createBullBoard } from "@bull-board/api";
// import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
// import { ExpressAdapter } from "@bull-board/express";

// //queue imports
// import { smsQueue } from "./queues/sms.queue.js";
// import { emailQueue } from "./queues/email.queue.js";

dotenv.config();

const app = express();

// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath("/admin/queues");

// createBullBoard({
//   queues: [new BullMQAdapter(emailQueue), new BullMQAdapter(smsQueue)],
//   serverAdapter,
// });

// app.use("/admin/queues", serverAdapter.getRouter());

/* ---------------- SECURITY ---------------- */
app.use(helmet()); // Secure HTTP headers

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: "*", // change this in production
    credentials: true,
  }),
);

/* ---------------- BODY PARSER ---------------- */
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- LOGGER ---------------- */

  app.use(morgan("combined"));


/* ---------------- RATE LIMIT ---------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5000, // limit each IP
  message: "Too many requests, please try again later",
});
app.use(limiter);

/* ---------------- PERFORMANCE ---------------- */
app.use(compression());

/* ---------------- COOKIES ---------------- */
app.use(cookieParser());

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

/* ---------------- ROUTES ---------------- */
app.use(process.env.ROUTE_PREFIX || "/api", routes);

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------------- GLOBAL ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error("💥 Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export const initCronJobs = () => {
  logger.warn("⏱ Starting all cron jobs..!");

  smsCron();
 
  logger.warn("✅ All cron jobs started");
};

export default app;
