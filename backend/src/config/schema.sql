-- SMD Digital Campus — PostgreSQL Schema
-- Run this on your Neon database

-- Users (all roles in one table)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  phone         VARCHAR(15),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Admissions
CREATE TABLE IF NOT EXISTS admissions (
  id              SERIAL PRIMARY KEY,
  student_name    VARCHAR(100) NOT NULL,
  dob             DATE,
  class_applying  VARCHAR(10) NOT NULL,
  parent_name     VARCHAR(100) NOT NULL,
  phone           VARCHAR(15) NOT NULL,
  email           VARCHAR(100),
  address         TEXT,
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  content     TEXT NOT NULL,
  active      BOOLEAN DEFAULT true,
  created_by  INTEGER REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  category    VARCHAR(50) DEFAULT 'general',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Students (extended profile)
CREATE TABLE IF NOT EXISTS students (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  roll_number VARCHAR(20) UNIQUE,
  class       VARCHAR(10),
  section     VARCHAR(5),
  parent_id   INTEGER REFERENCES users(id)
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER REFERENCES students(id),
  date        DATE NOT NULL,
  status      VARCHAR(10) CHECK (status IN ('present','absent','late')),
  marked_by   INTEGER REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Marks
CREATE TABLE IF NOT EXISTS marks (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER REFERENCES students(id),
  subject     VARCHAR(50) NOT NULL,
  exam_type   VARCHAR(30) NOT NULL,
  marks       NUMERIC(5,2),
  max_marks   NUMERIC(5,2) DEFAULT 100,
  teacher_id  INTEGER REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Seed admin user (password: admin123)
-- bcrypt hash of 'admin123'
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@smdschool.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;
