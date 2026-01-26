import { v2 as cloudinary } from "cloudinary";

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const api_key = process.env.CLOUDINARY_API_KEY?.trim();
const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

if (!cloud_name || !api_key || !api_secret) {
  console.warn("Cloudinary environment variables are missing!");
}

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true
});

export default cloudinary;
