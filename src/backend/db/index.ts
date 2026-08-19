import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";
import { dirname, resolve } from "path";

const DB_PATH = resolve(process.cwd(), process.env.DB_PATH ?? "data/clases-uy.sqlite");

// SQLite crea el archivo pero no el directorio que lo contiene
mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH, { create: true });

// Enable WAL mode for better concurrent read performance
db.run("PRAGMA journal_mode = WAL");
db.run("PRAGMA foreign_keys = ON");
