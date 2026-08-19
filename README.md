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

## Deploy

El frontend se compila a `dist/` y lo sirve nginx. El backend corre como
servicio systemd y nginx le hace proxy de `/graphql`.

```bash
bun install
bun run db:migrate
VITE_SHOW_DEMO_CREDENTIALS=false bun run build
```

Variables del servicio:

| Variable | Ejemplo | Descripción |
| --- | --- | --- |
| `JWT_SECRET` | (32+ bytes aleatorios) | Obligatoria. Sin ella se usa una clave de desarrollo pública. |
| `NODE_ENV` | `production` | Marca la cookie de sesión como `Secure`. |
| `PORT` | `3002` | Puerto local del backend. |
| `CORS_ORIGIN` | `https://clases.wefaber.net` | Orígenes extra permitidos. |
| `SEED_DEMO_ACCOUNTS` | `false` | Evita crear las cuentas de prueba. |
| `ADMIN_EMAIL` | `profesor@…` | Crea o actualiza la cuenta de administración. |
| `ADMIN_PASSWORD` | (contraseña fuerte) | Requerida junto con `ADMIN_EMAIL`. |
| `DB_PATH` | `data/clases-uy.sqlite` | Ruta de la base, relativa al directorio de trabajo. |

> Las cuentas de prueba (`alumno@demo.com`, `profesor@demo.com`) tienen su
> contraseña en el código y este repositorio es público: sirven para demos,
> no para un entorno con alumnos reales. Antes de abrirlo al público, corré
> las migraciones con `SEED_DEMO_ACCOUNTS=false` y borrá esas dos cuentas.
