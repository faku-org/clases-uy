/**
 * Cuentas de demostración. Se recrean en cada migración (`bun run db:migrate`)
 * y se muestran en la pantalla de login para que cualquiera pueda probar los
 * dos flujos completos sin registrarse.
 *
 * Para ocultarlas en producción: VITE_SHOW_DEMO_CREDENTIALS=false
 * Para no crearlas en producción: SEED_DEMO_ACCOUNTS=false
 */
export type DemoAccount = {
  role: "alumno" | "admin";
  label: string;
  description: string;
  name: string;
  email: string;
  password: string;
};

export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    role: "alumno",
    label: "Alumno",
    description: "Solicita turnos y consulta el estado de sus clases",
    name: "Alumno de Prueba",
    email: "alumno@demo.com",
    password: "demo1234",
  },
  {
    role: "admin",
    label: "Profesor",
    description: "Aprueba o rechaza solicitudes desde el panel",
    name: "Profesor Nicolas Stecar",
    email: "profesor@demo.com",
    password: "demo1234",
  },
] as const;
