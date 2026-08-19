# SMD Vidya Mandir 🎓

**AI-Powered School Management & Information Platform**  
Shree Mangal Chand Didwania Vidya Mandir (CBSE), Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan

**Built by:** Jatin Kumar | B.E. AI & Data Science, MBM University Jodhpur

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js 18 + Vite + Tailwind CSS + Framer Motion |
| Backend    | Node.js + Express.js                |
| Database   | **PostgreSQL** (hosted on Neon)     |
| Auth       | JWT + bcryptjs                      |
| Cloud      | Cloudinary (Media/PDFs)             |
| AI         | **Groq API** (Llama OCR & Chatbot)  |
| Deploy     | Vercel (FE) + Render (BE)           |

---

## ⚡ Quick Start

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd smd-vidya-mandir
```

### 2. Database Setup (PostgreSQL)

You can use any PostgreSQL database (local or cloud like Neon, Supabase, Render).
The database tables are automatically managed via the backend initialization scripts, or you can run the SQL schema manually.

**Demo Admin Account:**
| Role    | Email                      | Password |
|---------|----------------------------|----------|
| Admin   | smdvidyamandir1@gmail.com  | admin123 |

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
JWT_SECRET=change_this_to_something_secure
GROQ_API_KEY=gsk_...
CLIENT_URL=http://localhost:5173

# Cloudinary (For Documents and Gallery)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Config
EMAIL_USER=smdvidyamandir1@gmail.com
EMAIL_PASS=your_app_password
```

```bash
npm run dev
# ✅ Backend running on port 5000
```

### 4. Frontend Setup

```bash
cd frontend
npm install

# Copy env file
copy .env.example .env
# .env content: VITE_API_URL=http://localhost:5000/api

npm run dev
# Open http://localhost:5173
```

---

## Features

### Public Website
- 🏠 **Home** — Hero, stats, animated UI, notices (live from DB)
- 📚 **Academics & Facilities** — CBSE curriculum details, labs, sports
- 🖼️ **Gallery** — Smart album sorting, image lightbox, auto-shifting priority
- 📝 **Admissions** — Application form → admin database workflow
- ☎️ **Contact** — Direct Gmail compose linking and map integration
- 📄 **MPD** — CBSE Mandatory Public Disclosure with automated OCR

### Admin Panel (`/admin`)
- 📊 **Dashboard** — Live stats, quick actions
- 👥 **Admissions** — Track applications (Pending/Approved/Rejected)
- 🔔 **Notices** — Create and broadcast school alerts
- 🖼️ **Gallery** — Manage photo albums, manual/automatic sorting
- 💼 **Careers** — Manage job postings and track applicant resumes

---

## School Info

| Field    | Value |
|----------|-------|
| Name     | Shree Mangal Chand Didwania Vidya Mandir |
| Board    | CBSE |
| Affiliation | 1730539 |
| Location | Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan – 332001 |
| Phone    | +91-9001995272 |
| Email    | smdvidyamandir@gmail.com |
| Classes  | I to XII (Science & Commerce in XI-XII) |
| Est.     | 2002 |
