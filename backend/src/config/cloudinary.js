import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smd-campus-gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }] // compress large images
  }
})

export const upload = multer({ storage })

const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smd-campus-resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw' // Required for non-image files like PDF/DOC in cloudinary
  }
})

export const resumeUpload = multer({ storage: resumeStorage })

const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.mimetype === 'application/pdf') {
      return {
        folder: 'smd-campus-documents',
        resource_type: 'raw'
      }
    }
    return {
      folder: 'smd-campus-documents',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1600, crop: 'limit' }] // keep high res for OCR
    }
  }
})

export const documentUpload = multer({ storage: documentStorage })

