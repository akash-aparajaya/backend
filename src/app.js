import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

/* ---------------- SECURITY ---------------- */
app.use(helmet()); // Secure HTTP headers

/* ---------------- CORS ---------------- */
app.use(cors({
  origin: "*", // change this in production
  credentials: true
}));

/* ---------------- BODY PARSER ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- LOGGER ---------------- */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

/* ---------------- RATE LIMIT ---------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP
  message: "Too many requests, please try again later"
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

export default app;