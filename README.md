# SMD Digital Campus

AI-Powered School Management & Information Platform for Shree Mangal Chand Didwania Vidya Mandir, Sikar, Rajasthan.

**Built by:** Jatin Kumar | B.E. AI & Data Science, MBM University Jodhpur

---

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React.js + Vite + Tailwind CSS     |
| Backend    | Node.js + Express.js               |
| Database   | PostgreSQL (Neon - Serverless)     |
| Auth       | JWT + bcryptjs                     |
| AI         | Google Gemini API                  |
| Deploy     | Vercel (FE) + Render (BE)          |

---

## Project Structure

```
smd-digital-campus/
├── frontend/          # React + Vite app
│   └── src/
│       ├── components/
│       │   ├── common/     # ProtectedRoute, AIChatbot
│       │   ├── layout/     # Navbar, Footer, Sidebar, DashboardLayout
│       │   └── ui/         # Reusable UI components
│       ├── context/        # AuthContext
│       ├── hooks/          # Custom hooks
│       ├── pages/
│       │   ├── public/     # Home, About, Academics, etc.
│       │   ├── admin/      # Dashboard, Students, Notices...
│       │   ├── teacher/    # Marks, Attendance
│       │   ├── student/    # Results, Attendance
│       │   └── parent/     # Dashboard
│       ├── services/       # api.js, ai.js (Axios wrappers)
│       └── styles/         # Global CSS (Tailwind)
└── backend/           # Node + Express API
    └── src/
        ├── config/         # db.js, schema.sql
        ├── middleware/     # auth.js (JWT protect/authorize)
        ├── routes/         # auth, ai, admissions, notices, gallery
        ├── controllers/    # (Phase 2 — business logic separation)
        └── services/       # (Phase 2 — AI, email services)
```

---

## Phases

### Phase 1 — Ship & Deploy (Weeks 1–4) ✅
- Full public website (all pages)
- Admission inquiry form
- AI FAQ Chatbot (Gemini)
- Deployed on Vercel + Render + Neon

### Phase 2 — Admin Panel (Weeks 5–8)
- JWT Auth + Role-based login
- Admin dashboard: manage students, notices, gallery
- AI Notice Generator
- Admission review workflow

### Phase 3 — Portals + ML (Weeks 9–14)
- Teacher portal: marks + attendance
- Student portal: results + timetable
- Parent portal: child tracking
- Student Performance Prediction model (scikit-learn/TensorFlow)
- Analytics dashboard (Recharts)

---

## Setup

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # fill in VITE_API_URL
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
# Run schema.sql on your Neon DB
npm run dev
```
