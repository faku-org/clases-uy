import { db } from "./index";

// Users
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name       TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'alumno' CHECK(role IN ('alumno', 'admin')),
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

// Faculties
db.run(`
  CREATE TABLE IF NOT EXISTS faculties (
    id   TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
  )
`);

// Subjects
db.run(`
  CREATE TABLE IF NOT EXISTS subjects (
    id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name       TEXT NOT NULL,
    faculty_id TEXT NOT NULL REFERENCES faculties(id)
  )
`);

// Solicitudes
db.run(`
  CREATE TABLE IF NOT EXISTS solicitudes (
    id                TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id           TEXT NOT NULL REFERENCES users(id),
    subject_id        TEXT NOT NULL REFERENCES subjects(id),
    difficulty        INTEGER NOT NULL CHECK(difficulty BETWEEN 1 AND 5),
    urgency           INTEGER NOT NULL CHECK(urgency BETWEEN 1 AND 5),
    hours_per_week    INTEGER NOT NULL CHECK(hours_per_week BETWEEN 1 AND 5),
    difficult_topics  TEXT,
    preferred_days    TEXT,
    preferred_time_slot TEXT,
    exam_prep         TEXT,
    status            TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    rejection_reason  TEXT,
    assigned_date     TEXT,
    assigned_time     TEXT,
    duration_minutes  INTEGER,
    google_event_id   TEXT,
    google_event_link TEXT,
    created_at        INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at        INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

// Contact messages
db.run(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

// Seed faculties and subjects if empty
const facultyCount = db.query("SELECT COUNT(*) as n FROM faculties").get() as { n: number };

if (facultyCount.n === 0) {
  const insertFaculty = db.prepare("INSERT INTO faculties (id, name, slug) VALUES (?, ?, ?)");
  const insertSubject = db.prepare("INSERT INTO subjects (name, faculty_id) VALUES (?, ?)");

  const facultiesData = [
    {
      id: "fac-ingenieria",
      name: "Facultad de Ingeniería",
      slug: "ingenieria",
      subjects: [
        "Cálculo en una variable",
        "Cálculo en varias variables",
        "Cálculo vectorial",
        "Física 1",
        "Física 2",
        "Ecuaciones diferenciales",
        "Matemática discreta",
        "Química General",
        "Matemática 1",
        "Matemática 2",
        "Matemática 3",
        "Probabilidad y estadística",
      ],
    },
    {
      id: "fac-adm",
      name: "Facultad de Administración y Ciencias Sociales",
      slug: "administracion",
      subjects: [
        "Matemática 1",
        "Matemática 2",
        "Probabilidad y estadística",
        "Principios de economía",
        "Métodos de economía matemática 1",
        "Métodos de economía matemática 2",
        "Microeconomía intermedia",
        "Principios de estadística",
        "Teoría de juegos",
      ],
    },
    {
      id: "fac-arq",
      name: "Facultad de Arquitectura",
      slug: "arquitectura",
      subjects: ["Matemática 1", "Matemática 2"],
    },
  ];

  for (const faculty of facultiesData) {
    insertFaculty.run(faculty.id, faculty.name, faculty.slug);
    for (const subject of faculty.subjects) {
      insertSubject.run(subject, faculty.id);
    }
  }

  console.log("Seeded faculties and subjects");
}

// Seed admin user if none exists
const adminCount = db.query("SELECT COUNT(*) as n FROM users WHERE role = 'admin'").get() as {
  n: number;
};

if (adminCount.n === 0) {
  const bcrypt = await import("bcryptjs");
  const hash = await bcrypt.hash("admin1234", 10);
  db.run(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')",
    ["admin@clasesort.com", hash, "Profesor Nicolas Stecar"]
  );
  console.log("Created admin user: admin@clasesort.com / admin1234");
}

console.log("Migration complete");
