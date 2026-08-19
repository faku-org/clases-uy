# Clases ORT

Plataforma de gestión de clases particulares para estudiantes universitarios.
Los alumnos solicitan turnos y el profesor los aprueba o rechaza desde un panel de administración.

## Stack

- **Runtime:** Bun
- **Frontend:** React 19, Vite, TailwindCSS v4, React Router, Apollo Client
- **Backend:** Elysia + GraphQL Yoga
- **DB:** SQLite (`bun:sqlite`)
- **Auth:** JWT en cookie httpOnly, contraseñas con bcrypt

## Setup

```bash
bun install
bun run db:migrate
bun dev
```

- Frontend: http://localhost:5173
- Backend GraphQL: http://localhost:3000/graphql

## Scripts

| Comando | Descripción |
| --- | --- |
| `bun dev` | Frontend y backend en paralelo |
| `bun run db:migrate` | Crea las tablas y carga los datos iniciales |
| `bun run typecheck` | Chequeo de tipos |
| `bun run lint` | OxLint |
| `bun run build` | Build de producción |

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `JWT_SECRET` | Clave para firmar los tokens de sesión. Obligatoria en producción. |

## Roles

- `alumno`: crea solicitudes de clase y consulta sus turnos.
- `admin`: revisa las solicitudes, asigna fecha y horario, o las rechaza.

La base de datos (`data/`) no se versiona.
