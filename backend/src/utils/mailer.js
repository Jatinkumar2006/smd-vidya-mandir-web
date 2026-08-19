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

const getEmailTemplate = (content) => `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f3f4f6">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header Banner -->
          <tr>
            <td align="center" bgcolor="#0a143c" style="padding: 30px 20px;">
              <img src="https://res.cloudinary.com/ap5wku4z/image/upload/v1783448132/smd_logo_email.png" alt="SMD Logo" style="height: 60px; margin-bottom: 15px; display: block;" />
              <h1 style="color: #f59e0b; margin: 0; font-size: 26px; letter-spacing: 1px; text-transform: uppercase;">SMD Vidya Mandir</h1>
              <p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 14px;">CBSE Affiliated • Raghunathgarh, Sikar</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; color: #334155; font-size: 16px; line-height: 1.6;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td bgcolor="#f8fafc" style="padding: 30px; border-top: 1px solid #e2e8f0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #0a143c; font-size: 16px;">Shri Mangalchand Didwaniya Vidya Mandir</h3>
              <p style="margin: 0 0 5px 0; font-size: 13px;">
                <a href="https://maps.google.com/?q=Shri+Mangalchand+Didwaniya+Vidya+Mandir+Raghunathgarh+Sikar+Rajasthan" style="color: #64748b; text-decoration: none;">📍 Raghunathgarh, Sikar, Rajasthan - 332027</a>
              </p>
              <p style="margin: 0 0 15px 0; color: #64748b; font-size: 13px;">
                📞 <a href="tel:+919001995272" style="color: #64748b; text-decoration: none;">+91 9001995272</a> &nbsp;|&nbsp; 
                ✉️ <a href="mailto:smdvidyamandir@gmail.com" style="color: #64748b; text-decoration: none;">smdvidyamandir@gmail.com</a>
              </p>
              
              <div style="margin-bottom: 5px;">
                <a href="https://www.youtube.com/@SMDsikar" style="color: #ef4444; text-decoration: none; font-weight: bold; margin: 0 10px; font-size: 14px;">▶ YouTube</a>
                <a href="https://www.facebook.com/SMDVidyaMandirCBSE/" style="color: #3b82f6; text-decoration: none; font-weight: bold; margin: 0 10px; font-size: 14px;">f Facebook</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

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
      html: getEmailTemplate(html)
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
