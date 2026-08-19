import { db } from "./index";
import { DEMO_ACCOUNTS } from "../../shared/demoAccounts";
import { SEED_UNIVERSITIES } from "./seedData";

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

// Universities
db.run(`
  CREATE TABLE IF NOT EXISTS universities (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    short_name    TEXT NOT NULL,
    slug          TEXT UNIQUE NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
  )
`);

// Faculties
db.run(`
  CREATE TABLE IF NOT EXISTS faculties (
    id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name          TEXT NOT NULL,
    slug          TEXT UNIQUE NOT NULL,
    university_id TEXT REFERENCES universities(id)
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

// hours_per_week used to be a 1-5 rating. It is now a number the student types,
// so the old CHECK constraint has to be rebuilt (SQLite cannot drop one in place).
const solicitudesSql = (
  db.query("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'solicitudes'").get() as
    | { sql: string }
    | null
)?.sql;

if (solicitudesSql?.includes("hours_per_week BETWEEN 1 AND 5")) {
  db.run("PRAGMA foreign_keys = OFF");
  db.run("BEGIN");
  db.run(`
    CREATE TABLE solicitudes_new (
      id                TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id           TEXT NOT NULL REFERENCES users(id),
      subject_id        TEXT NOT NULL REFERENCES subjects(id),
      difficulty        INTEGER NOT NULL CHECK(difficulty BETWEEN 1 AND 5),
      urgency           INTEGER NOT NULL CHECK(urgency BETWEEN 1 AND 5),
      hours_per_week    INTEGER NOT NULL CHECK(hours_per_week BETWEEN 1 AND 40),
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
  db.run("INSERT INTO solicitudes_new SELECT * FROM solicitudes");
  db.run("DROP TABLE solicitudes");
  db.run("ALTER TABLE solicitudes_new RENAME TO solicitudes");
  db.run("COMMIT");
  db.run("PRAGMA foreign_keys = ON");
  console.log("Migrated hours_per_week to accept 1-40 hours");
}

// Existing databases predate the universities table: add the column if missing
const facultyColumns = db.query("PRAGMA table_info(faculties)").all() as { name: string }[];
if (!facultyColumns.some((c) => c.name === "university_id")) {
  db.run("ALTER TABLE faculties ADD COLUMN university_id TEXT REFERENCES universities(id)");
}

// Seed / refresh the catalogue of universities, faculties and subjects.
// Upserts by id so re-running never duplicates rows or breaks existing solicitudes.
const universityColumns = db.query("PRAGMA table_info(universities)").all() as { name: string }[];
if (!universityColumns.some((c) => c.name === "display_order")) {
  db.run("ALTER TABLE universities ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0");
}

const upsertUniversity = db.prepare(`
  INSERT INTO universities (id, name, short_name, slug, display_order)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    name          = excluded.name,
    short_name    = excluded.short_name,
    slug          = excluded.slug,
    display_order = excluded.display_order
`);

const upsertFaculty = db.prepare(`
  INSERT INTO faculties (id, name, slug, university_id)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    name          = excluded.name,
    slug          = excluded.slug,
    university_id = excluded.university_id
`);

const findSubject = db.prepare("SELECT id FROM subjects WHERE faculty_id = ? AND name = ?");
const insertSubject = db.prepare("INSERT INTO subjects (name, faculty_id) VALUES (?, ?)");

let newSubjects = 0;

for (const [order, university] of SEED_UNIVERSITIES.entries()) {
  upsertUniversity.run(
    university.id,
    university.name,
    university.shortName,
    university.slug,
    order
  );

  for (const faculty of university.faculties) {
    upsertFaculty.run(faculty.id, faculty.name, faculty.slug, university.id);

    for (const subject of faculty.subjects) {
      if (!findSubject.get(faculty.id, subject)) {
        insertSubject.run(subject, faculty.id);
        newSubjects++;
      }
    }
  }
}

console.log(
  "Catalogue ready: " +
    SEED_UNIVERSITIES.length +
    " universities, " +
    newSubjects +
    " new subjects"
);

// Cuenta de administración real. Se crea sólo si se pasan las dos variables,
// para no dejar nunca una contraseña por defecto en el código.
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

if (adminEmail && adminPassword) {
  const bcrypt = await import("bcryptjs");
  const hash = await bcrypt.hash(adminPassword, 10);
  db.run(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES (?, ?, ?, 'admin')
     ON CONFLICT(email) DO UPDATE SET
       password_hash = excluded.password_hash,
       role          = excluded.role`,
    [adminEmail, hash, process.env.ADMIN_NAME ?? "Profesor Nicolas Stecar"]
  );
  console.log("Admin account ready: " + adminEmail);
}

// Seed / refresh demo accounts so the login screen credentials always work
if (process.env.SEED_DEMO_ACCOUNTS !== "false") {
  const bcrypt = await import("bcryptjs");

  for (const account of DEMO_ACCOUNTS) {
    const hash = await bcrypt.hash(account.password, 10);
    db.run(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         password_hash = excluded.password_hash,
         name          = excluded.name,
         role          = excluded.role`,
      [account.email, hash, account.name, account.role]
    );
  }

  const summary = DEMO_ACCOUNTS.map((a) => a.email + " / " + a.password).join(", ");
  console.log("Demo accounts ready: " + summary);
}

console.log("Migration complete");
