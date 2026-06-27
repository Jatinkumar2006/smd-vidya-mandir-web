# SMD Digital Campus 🎓

**AI-Powered School Management & Information Platform**  
Shree Mangal Chand Didwania Vidya Mandir (CBSE), Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan

**Built by:** Jatin Kumar | B.E. AI & Data Science, MBM University Jodhpur

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js 18 + Vite + Tailwind CSS   |
| Backend    | Node.js + Express.js                |
| Database   | **MySQL** (local / cloud)           |
| Auth       | JWT + bcryptjs                      |
| AI         | **Groq API** (llama3-8b-8192) — FREE |
| Deploy     | Vercel (FE) + Render (BE)           |

---

## ⚡ Quick Start

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd smd-digital-campus
```

### 2. Database Setup (MySQL)

Using **XAMPP**, **MySQL Workbench**, or any MySQL client:

```sql
-- In MySQL Workbench or phpMyAdmin:
-- 1. Open the file: backend/src/config/schema.sql
-- 2. Run it — this creates the database, all tables, and seeds demo users
```

**Demo accounts (password: `admin123` for all):**
| Role    | Email                      |
|---------|----------------------------|
| Admin   | admin@smdschool.in         |
| Teacher | teacher@smdschool.in       |
| Student | student@smdschool.in       |

### 3. Backend Setup

```bash
cd backend
npm install

# Copy and edit the env file
copy .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # your MySQL root password (blank for XAMPP default)
DB_NAME=smd_campus
JWT_SECRET=change_this_to_something_secure
GROQ_API_KEY=gsk_...  # Get free key at https://console.groq.com
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
# ✅ SMD Backend running on port 5000 | DB: MySQL | AI: Groq
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

## Getting a Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up / Log in (it's free!)
3. Go to **API Keys** → **Create API Key**
4. Copy the key and paste into `backend/.env` as `GROQ_API_KEY=gsk_...`

---

## Features

### Public Website
- 🏠 Home — Hero, stats, about, notices (live from DB), CTA
- 📚 Academics — Classes I-XII, subjects, highlights
- 🏫 Facilities — Library, Labs, Digital Learning, Sports
- 🖼️ Gallery — Category filter, image grid, lightbox
- 📝 Admissions — Form → database → admin review workflow
- ☎️ Contact — Form → database
- 📄 MPD — CBSE Mandatory Public Disclosure

### Admin Panel (`/admin`)
- 📊 Dashboard — Live stats (students, pending admissions, notices, gallery)
- 👥 Students — Full CRUD table (add/edit/delete with modal)
- 📋 Admissions — Review applications, approve/reject with one click
- 🔔 Notices — Create + AI-powered notice generator (Groq)
- 🖼️ Gallery — Add/remove gallery items by category

### Teacher Portal (`/teacher`)
- 📝 Marks Entry — Select class + subject + exam → editable table → save
- ✅ Attendance — Daily attendance marking (present/absent/late) with batch save
- 🤖 AI Remark Generator per student

### Student Portal (`/student`)
- 📊 Dashboard — Average score, attendance %, recent marks
- 📜 Results — Marks with CBSE grading (A1-E), progress bars, exam filter
- 📅 Attendance — Month-by-month calendar, color-coded days, circular meter

### Parent Portal (`/parent`)
- 📣 Latest school notices
- Contact school links

---

## Git Safety

Your original code is saved as the first commit. To restore it at any time:

```bash
git log --oneline        # see all commits
git checkout <commit-id> # restore to any point
```

---

## Project Structure

```
smd-digital-campus/
├── frontend/              # React + Vite app
│   └── src/
│       ├── pages/
│       │   ├── public/    # Home, About, Academics, etc.
│       │   ├── admin/     # Dashboard, Students, Notices, Gallery, Admissions
│       │   ├── teacher/   # Dashboard, Marks, Attendance
│       │   ├── student/   # Dashboard, Results, Attendance
│       │   └── parent/    # Dashboard
│       ├── components/    # Navbar, Footer, Sidebar, AIChatbot, etc.
│       ├── context/       # AuthContext (JWT login/logout)
│       └── services/      # api.js, ai.js
└── backend/               # Node + Express API
    └── src/
        ├── config/        # db.js (MySQL), schema.sql
        ├── middleware/    # auth.js (JWT)
        └── routes/        # auth, ai, students, marks, attendance,
                           # admissions, notices, gallery, contact
```

---

## School Info

| Field    | Value |
|----------|-------|
| Name     | Shree Mangal Chand Didwania Vidya Mandir |
| Board    | CBSE |
| Location | Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan – 332001 |
| Phone    | +91-9001995272 |
| Email    | smdvidyamandir@gmail.com |
| Classes  | I to XII (Science & Commerce in XI-XII) |
| Est.     | 2009 |
