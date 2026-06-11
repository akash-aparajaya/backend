// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
console.log("Cloudinary ENV:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET ? "FOUND" : "MISSING",
});
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;