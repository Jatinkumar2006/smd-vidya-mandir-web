import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'smdvidyamadir1@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password-here' 
  }
})

/**
 * Sends an email
 * @param {Object} options 
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"SMD Vidya Mandir" <${process.env.EMAIL_USER || 'smdvidyamadir1@gmail.com'}>`,
      to,
      subject,
      html
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: %s', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    // We don't throw here so that a failed email doesn't crash the main request (e.g., job application)
    // In a production system, you might want to queue these or handle them differently.
  }
}
