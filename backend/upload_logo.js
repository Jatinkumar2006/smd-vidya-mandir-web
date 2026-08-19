import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.uploader.upload('../frontend/src/assets/images/logo.webp', { public_id: 'smd_logo_email' })
  .then(result => console.log('UPLOADED_URL:', result.secure_url))
  .catch(error => console.error('Error:', error));
