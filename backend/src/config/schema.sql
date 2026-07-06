-- SMD Vidya Mandir — PostgreSQL Schema (Neon)

-- Users (all roles in one table)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) CHECK (role IN ('admin','teacher','student','parent')) NOT NULL,
  phone         VARCHAR(15),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admissions
CREATE TABLE IF NOT EXISTS admissions (
  id              SERIAL PRIMARY KEY,
  student_name    VARCHAR(100) NOT NULL,
  dob             DATE,
  gender          VARCHAR(10),
  class_applying  VARCHAR(10) NOT NULL,
  parent_name     VARCHAR(100) NOT NULL,
  relation        VARCHAR(20) DEFAULT 'Father',
  phone           VARCHAR(15) NOT NULL,
  email           VARCHAR(100),
  address         TEXT,
  status          VARCHAR(20) CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact inquiries
CREATE TABLE IF NOT EXISTS contacts (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100),
  phone      VARCHAR(15),
  subject    VARCHAR(200),
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  content    TEXT NOT NULL,
  active     BOOLEAN DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  image_url  VARCHAR(500) NOT NULL,
  category   VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students extended profile
CREATE TABLE IF NOT EXISTS students (
  id          SERIAL PRIMARY KEY,
  user_id     INT,
  roll_number VARCHAR(20) UNIQUE,
  class       VARCHAR(10),
  section     VARCHAR(5),
  parent_id   INT,
  FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id         SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  date       DATE NOT NULL,
  status     VARCHAR(20) CHECK (status IN ('present','absent','late')) NOT NULL,
  marked_by  INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (student_id, date),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by)  REFERENCES users(id) ON DELETE SET NULL
);

-- Marks
CREATE TABLE IF NOT EXISTS marks (
  id         SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  subject    VARCHAR(50) NOT NULL,
  exam_type  VARCHAR(30) NOT NULL,
  marks      DECIMAL(5,2),
  max_marks  DECIMAL(5,2) DEFAULT 100,
  teacher_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Careers / Job Postings
CREATE TABLE IF NOT EXISTS careers (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  department  VARCHAR(100) NOT NULL,
  type        VARCHAR(50) NOT NULL,
  experience  VARCHAR(100) NOT NULL,
  description TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id              SERIAL PRIMARY KEY,
  career_id       INT NOT NULL,
  applicant_name  VARCHAR(100) NOT NULL,
  email           VARCHAR(100) NOT NULL,
  phone           VARCHAR(20) NOT NULL,
  experience      VARCHAR(100) NOT NULL,
  resume_url      VARCHAR(500) NOT NULL,
  payment_id      VARCHAR(100),
  order_id        VARCHAR(100),
  payment_status  VARCHAR(20) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
);

-- Seed admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@smdschool.in', '$2a$10$8p9m9obsJvzw/tVj0N/H.Oxq6svsJb1K4Ebac2.iIYNUNbnd07xye', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed demo teacher
INSERT INTO users (name, email, password_hash, role, phone)
VALUES ('Rajesh Kumar', 'teacher@smdschool.in', '$2a$10$8p9m9obsJvzw/tVj0N/H.Oxq6svsJb1K4Ebac2.iIYNUNbnd07xye', 'teacher', '9001234567')
ON CONFLICT (email) DO NOTHING;

-- Seed demo student user
INSERT INTO users (name, email, password_hash, role, phone)
VALUES ('Ravi Sharma', 'student@smdschool.in', '$2a$10$8p9m9obsJvzw/tVj0N/H.Oxq6svsJb1K4Ebac2.iIYNUNbnd07xye', 'student', '9007654321')
ON CONFLICT (email) DO NOTHING;

-- Seed student profile (run after users are inserted)
INSERT INTO students (user_id, roll_number, class, section)
SELECT id, 'SMD-001', '10', 'A' FROM users WHERE email = 'student@smdschool.in'
ON CONFLICT (roll_number) DO NOTHING;

-- Seed sample notices
INSERT INTO notices (title, content, created_by)
SELECT 'Annual Sports Day 2025', 'The Annual Sports Day will be held on January 15, 2025. All students are requested to participate. Practice sessions begin December 20.', id FROM users WHERE email = 'admin@smdschool.in';

INSERT INTO notices (title, content, created_by)
SELECT 'Winter Break Schedule', 'School will remain closed from December 25, 2024 to January 5, 2025 for winter break. Classes resume on January 6, 2025.', id FROM users WHERE email = 'admin@smdschool.in';

INSERT INTO notices (title, content, created_by)
SELECT 'Half-Yearly Examination Timetable', 'Half-Yearly examinations for classes VI-XII will commence from November 18, 2024. Detailed timetable is available on the notice board.', id FROM users WHERE email = 'admin@smdschool.in';

-- Seed sample marks for student
INSERT INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'Mathematics', 'Half-Yearly', 85, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';

INSERT INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'Science', 'Half-Yearly', 78, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';

INSERT INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'English', 'Half-Yearly', 90, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';

INSERT INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'Social Science', 'Half-Yearly', 82, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';

INSERT INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'Hindi', 'Half-Yearly', 88, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';
