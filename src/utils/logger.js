import winston from "winston";

const logger = winston.createLogger({
  level: "debug", // Set to 'debug' for detailed logging
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
       return `● |${timestamp}| ${message}`
        }),
        winston.format.colorize({ all: true }) // ✅ IMPORTANT (must be LAST)
      ),
    }),
  ],
});

export default logger;