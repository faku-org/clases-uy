import bcrypt from "bcryptjs";
import { db } from "../db/index";
import { signToken, cookieOptions, COOKIE_NAME } from "../lib/auth";
import { buildGoogleCalendarLink } from "../lib/calendar";
import { badInput, unauthenticated, forbidden, notFound } from "../lib/errors";
type Context = {
  request: Request;
  setCookie: (name: string, opts: ReturnType<typeof cookieOptions>) => void;
  currentUser: { id: string; email: string; role: string; name: string } | null;
};

type DbUser = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: number;
};

type DbSolicitud = {
  id: string;
  user_id: string;
  subject_id: string;
  difficulty: number;
  urgency: number;
  hours_per_week: number;
  difficult_topics: string | null;
  preferred_days: string | null;
  preferred_time_slot: string | null;
  exam_prep: string | null;
  status: string;
  rejection_reason: string | null;
  assigned_date: string | null;
  assigned_time: string | null;
  duration_minutes: number | null;
  google_event_link: string | null;
  created_at: number;
};

type DbFaculty = { id: string; name: string; slug: string; university_id: string | null };
type DbUniversity = {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  display_order: number;
};
type DbSubject = { id: string; name: string; faculty_id: string };

function requireAuth(ctx: Context) {
  if (!ctx.currentUser) throw unauthenticated("No autorizado. Iniciá sesión.");
  return ctx.currentUser;
}

function requireAdmin(ctx: Context) {
  const user = requireAuth(ctx);
  if (user.role !== "admin") throw forbidden("Acceso denegado.");
  return user;
}

function withSubjects(faculty: DbFaculty) {
  const subjects = db
    .query("SELECT * FROM subjects WHERE faculty_id = ? ORDER BY name")
    .all(faculty.id) as DbSubject[];

  return {
    ...faculty,
    university: faculty.university_id
      ? mapUniversity(
          db.query("SELECT * FROM universities WHERE id = ?").get(faculty.university_id) as
            | DbUniversity
            | null
        )
      : null,
    subjects: subjects.map((s) => ({ ...s, faculty })),
  };
}

function mapUniversity(u: DbUniversity | null) {
  if (!u) return null;
  return { id: u.id, name: u.name, shortName: u.short_name, faculties: [] };
}

function mapSolicitud(s: DbSolicitud) {
  const user = db.query("SELECT * FROM users WHERE id = ?").get(s.user_id) as DbUser;
  const subject = db.query("SELECT * FROM subjects WHERE id = ?").get(s.subject_id) as DbSubject;
  const faculty = db
    .query("SELECT * FROM faculties WHERE id = ?")
    .get(subject.faculty_id) as DbFaculty;

  return {
    id: s.id,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    subject: {
      id: subject.id,
      name: subject.name,
      faculty: { id: faculty.id, name: faculty.name, subjects: [] },
    },
    difficulty: s.difficulty,
    urgency: s.urgency,
    hoursPerWeek: s.hours_per_week,
    difficultTopics: s.difficult_topics,
    preferredDays: s.preferred_days,
    preferredTimeSlot: s.preferred_time_slot,
    examPrep: s.exam_prep,
    status: s.status,
    rejectionReason: s.rejection_reason,
    assignedDate: s.assigned_date,
    assignedTime: s.assigned_time,
    durationMinutes: s.duration_minutes,
    googleEventLink: s.google_event_link,
    createdAt: new Date(s.created_at * 1000).toISOString(),
  };
}

export const resolvers = {
  Query: {
    me: (_: unknown, __: unknown, ctx: Context) => {
      if (!ctx.currentUser) return null;
      const user = db
        .query("SELECT * FROM users WHERE id = ?")
        .get(ctx.currentUser.id) as DbUser | null;
      if (!user) return null;
      return { id: user.id, name: user.name, email: user.email, role: user.role };
    },

    universities: () => {
      const universities = db
        .query("SELECT * FROM universities ORDER BY display_order, name")
        .all() as DbUniversity[];

      return universities.map((u) => ({
        id: u.id,
        name: u.name,
        shortName: u.short_name,
        faculties: (
          db
            .query("SELECT * FROM faculties WHERE university_id = ? ORDER BY name")
            .all(u.id) as DbFaculty[]
        ).map(withSubjects),
      }));
    },

    faculties: (_: unknown, { universityId }: { universityId?: string }) => {
      const faculties = (
        universityId
          ? db.query("SELECT * FROM faculties WHERE university_id = ? ORDER BY name").all(universityId)
          : db.query("SELECT * FROM faculties ORDER BY name").all()
      ) as DbFaculty[];

      return faculties.map(withSubjects);
    },

    subjects: (_: unknown, { facultyId }: { facultyId?: string }) => {
      const query = facultyId
        ? db.query("SELECT * FROM subjects WHERE faculty_id = ? ORDER BY name")
        : db.query("SELECT * FROM subjects ORDER BY name");
      const subjects = (facultyId ? query.all(facultyId) : query.all()) as DbSubject[];
      return subjects.map((s) => {
        const faculty = db
          .query("SELECT * FROM faculties WHERE id = ?")
          .get(s.faculty_id) as DbFaculty;
        return { ...s, faculty };
      });
    },

    solicitudes: (_: unknown, { status }: { status?: string }, ctx: Context) => {
      requireAdmin(ctx);
      const rows = status
        ? (db
            .query("SELECT * FROM solicitudes WHERE status = ? ORDER BY created_at DESC")
            .all(status) as DbSolicitud[])
        : (db
            .query("SELECT * FROM solicitudes ORDER BY created_at DESC")
            .all() as DbSolicitud[]);
      return rows.map(mapSolicitud);
    },

    misSolicitudes: (_: unknown, __: unknown, ctx: Context) => {
      const user = requireAuth(ctx);
      const rows = db
        .query("SELECT * FROM solicitudes WHERE user_id = ? ORDER BY created_at DESC")
        .all(user.id) as DbSolicitud[];
      return rows.map(mapSolicitud);
    },

    solicitud: (_: unknown, { id }: { id: string }, ctx: Context) => {
      requireAuth(ctx);
      const s = db
        .query("SELECT * FROM solicitudes WHERE id = ?")
        .get(id) as DbSolicitud | null;
      if (!s) throw notFound("Solicitud no encontrada");
      return mapSolicitud(s);
    },

    dashboard: (_: unknown, __: unknown, ctx: Context) => {
      requireAdmin(ctx);
      const pending = db
        .query("SELECT COUNT(*) as n FROM solicitudes WHERE status = 'pending'")
        .get() as { n: number };

      const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
      const approvedToday = db
        .query(
          "SELECT COUNT(*) as n FROM solicitudes WHERE status = 'approved' AND updated_at >= ?"
        )
        .get(todayStart) as { n: number };

      const totalStudents = db
        .query("SELECT COUNT(*) as n FROM users WHERE role = 'alumno'")
        .get() as { n: number };

      const recent = db
        .query("SELECT * FROM solicitudes ORDER BY created_at DESC LIMIT 10")
        .all() as DbSolicitud[];

      return {
        pendingCount: pending.n,
        approvedTodayCount: approvedToday.n,
        totalStudents: totalStudents.n,
        recentSolicitudes: recent.map(mapSolicitud),
      };
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { input }: { input: { name: string; email: string; password: string } },
      ctx: Context
    ) => {
      const email = input.email.trim().toLowerCase();
      const name = input.name.trim();

      if (!name) throw badInput("El nombre es requerido.");

      if (input.password.length < 8)
        throw badInput("La contraseña debe tener al menos 8 caracteres.");

      const existing = db.query("SELECT id FROM users WHERE email = ?").get(email);
      if (existing) throw badInput("El email ya está registrado.");

      const hash = await bcrypt.hash(input.password, 10);
      db.run("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)", [
        email,
        hash,
        name,
      ]);

      const user = db.query("SELECT * FROM users WHERE email = ?").get(email) as DbUser;

      const token = await signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      ctx.setCookie(COOKIE_NAME, cookieOptions(token));

      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      };
    },

    login: async (
      _: unknown,
      { email, password }: { email: string; password: string },
      ctx: Context
    ) => {
      const user = db
        .query("SELECT * FROM users WHERE email = ?")
        .get(email.trim().toLowerCase()) as DbUser | null;

      if (!user) throw unauthenticated("Credenciales inválidas.");

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) throw unauthenticated("Credenciales inválidas.");

      const token = await signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      ctx.setCookie(COOKIE_NAME, cookieOptions(token));

      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      };
    },

    logout: (_: unknown, __: unknown, ctx: Context) => {
      ctx.setCookie(COOKIE_NAME, cookieOptions("", true));
      return true;
    },

    createSolicitud: (
      _: unknown,
      {
        input,
      }: {
        input: {
          subjectId: string;
          difficulty: number;
          urgency: number;
          hoursPerWeek: number;
          difficultTopics?: string;
          preferredDays?: string;
          preferredTimeSlot?: string;
          examPrep?: string;
        };
      },
      ctx: Context
    ) => {
      const user = requireAuth(ctx);

      db.run(
        `INSERT INTO solicitudes
          (user_id, subject_id, difficulty, urgency, hours_per_week,
           difficult_topics, preferred_days, preferred_time_slot, exam_prep)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          input.subjectId,
          input.difficulty,
          input.urgency,
          input.hoursPerWeek,
          input.difficultTopics ?? null,
          input.preferredDays ?? null,
          input.preferredTimeSlot ?? null,
          input.examPrep ?? null,
        ]
      );

      const s = db
        .query("SELECT * FROM solicitudes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1")
        .get(user.id) as DbSolicitud;

      return mapSolicitud(s);
    },

    approveSolicitud: (
      _: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: { assignedDate: string; assignedTime: string; durationMinutes: number };
      },
      ctx: Context
    ) => {
      requireAdmin(ctx);

      const s = db
        .query("SELECT * FROM solicitudes WHERE id = ?")
        .get(id) as DbSolicitud | null;
      if (!s) throw notFound("Solicitud no encontrada");

      const subject = db
        .query("SELECT * FROM subjects WHERE id = ?")
        .get(s.subject_id) as DbSubject;
      const student = db
        .query("SELECT * FROM users WHERE id = ?")
        .get(s.user_id) as DbUser;

      const googleEventLink = buildGoogleCalendarLink({
        title: `Clase ORT - ${subject.name} - ${student.name}`,
        description: `Alumno: ${student.name}\nEmail: ${student.email}\nMateria: ${subject.name}`,
        date: input.assignedDate,
        time: input.assignedTime,
        durationMinutes: input.durationMinutes,
      });

      db.run(
        `UPDATE solicitudes
         SET status = 'approved',
             assigned_date = ?,
             assigned_time = ?,
             duration_minutes = ?,
             google_event_link = ?,
             updated_at = unixepoch()
         WHERE id = ?`,
        [input.assignedDate, input.assignedTime, input.durationMinutes, googleEventLink, id]
      );

      const updated = db
        .query("SELECT * FROM solicitudes WHERE id = ?")
        .get(id) as DbSolicitud;
      return mapSolicitud(updated);
    },

    rejectSolicitud: (
      _: unknown,
      { id, reason }: { id: string; reason?: string },
      ctx: Context
    ) => {
      requireAdmin(ctx);

      db.run(
        `UPDATE solicitudes
         SET status = 'rejected',
             rejection_reason = ?,
             updated_at = unixepoch()
         WHERE id = ?`,
        [reason ?? null, id]
      );

      const updated = db
        .query("SELECT * FROM solicitudes WHERE id = ?")
        .get(id) as DbSolicitud;
      return mapSolicitud(updated);
    },

    sendContactMessage: (
      _: unknown,
      { input }: { input: { name: string; email: string; subject: string; message: string } }
    ) => {
      db.run(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
        [input.name, input.email, input.subject, input.message]
      );
      return true;
    },
  },
};
