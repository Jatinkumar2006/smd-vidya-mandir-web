-- SMD Digital Campus — MySQL Schema
-- Run this in MySQL Workbench or phpMyAdmin (XAMPP)

CREATE DATABASE IF NOT EXISTS smd_campus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smd_campus;

-- Users (all roles in one table)
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','teacher','student','parent') NOT NULL,
  phone         VARCHAR(15),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admissions
CREATE TABLE IF NOT EXISTS admissions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  student_name    VARCHAR(100) NOT NULL,
  dob             DATE,
  gender          VARCHAR(10),
  class_applying  VARCHAR(10) NOT NULL,
  parent_name     VARCHAR(100) NOT NULL,
  relation        VARCHAR(20) DEFAULT 'Father',
  phone           VARCHAR(15) NOT NULL,
  email           VARCHAR(100),
  address         TEXT,
  status          ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact inquiries
CREATE TABLE IF NOT EXISTS contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100),
  phone      VARCHAR(15),
  subject    VARCHAR(200),
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  content    TEXT NOT NULL,
  active     TINYINT(1) DEFAULT 1,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  image_url  VARCHAR(500) NOT NULL,
  category   VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students extended profile
CREATE TABLE IF NOT EXISTS students (
  id          INT AUTO_INCREMENT PRIMARY KEY,
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
  id         INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  date       DATE NOT NULL,
  status     ENUM('present','absent','late') NOT NULL,
  marked_by  INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (student_id, date),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by)  REFERENCES users(id) ON DELETE SET NULL
);

-- Marks
CREATE TABLE IF NOT EXISTS marks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
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

-- Seed admin user (password: admin123)
-- bcrypt hash of 'admin123'
INSERT IGNORE INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@smdschool.in',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Seed demo teacher
INSERT IGNORE INTO users (name, email, password_hash, role, phone)
VALUES ('Rajesh Kumar', 'teacher@smdschool.in',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', '9001234567');

-- Seed demo student user
INSERT IGNORE INTO users (name, email, password_hash, role, phone)
VALUES ('Ravi Sharma', 'student@smdschool.in',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', '9007654321');

-- Seed student profile (run after users are inserted)
INSERT IGNORE INTO students (user_id, roll_number, class, section)
SELECT id, 'SMD-001', '10', 'A' FROM users WHERE email = 'student@smdschool.in';

-- Seed sample notices
INSERT IGNORE INTO notices (title, content, created_by)
SELECT 'Annual Sports Day 2025',
  'The Annual Sports Day will be held on January 15, 2025. All students are requested to participate. Practice sessions begin December 20.',
  id FROM users WHERE email = 'admin@smdschool.in';

INSERT IGNORE INTO notices (title, content, created_by)
SELECT 'Winter Break Schedule',
  'School will remain closed from December 25, 2024 to January 5, 2025 for winter break. Classes resume on January 6, 2025.',
  id FROM users WHERE email = 'admin@smdschool.in';

INSERT IGNORE INTO notices (title, content, created_by)
SELECT 'Half-Yearly Examination Timetable',
  'Half-Yearly examinations for classes VI-XII will commence from November 18, 2024. Detailed timetable is available on the notice board.',
  id FROM users WHERE email = 'admin@smdschool.in';

-- Seed sample marks for student
INSERT IGNORE INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'Mathematics', 'Half-Yearly', 85, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';

INSERT IGNORE INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'Science', 'Half-Yearly', 78, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';

INSERT IGNORE INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'English', 'Half-Yearly', 90, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';

INSERT IGNORE INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'Social Science', 'Half-Yearly', 82, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';

INSERT IGNORE INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id)
SELECT s.id, 'Hindi', 'Half-Yearly', 88, 100, u.id
FROM students s, users u WHERE s.roll_number = 'SMD-001' AND u.email = 'teacher@smdschool.in';
