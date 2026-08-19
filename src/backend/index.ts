import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./schema/index";
import { resolvers } from "./resolvers/index";
import { verifyToken, COOKIE_NAME, cookieOptions } from "./lib/auth";

// Run migrations on startup
await import("./db/migrate");

const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({ schema, graphqlEndpoint: "/graphql", logging: false });

const app = new Elysia()
  .use(
    cors({
      // En producción el frontend se sirve desde el mismo origen detrás de nginx,
      // así que sólo hace falta listar orígenes extra vía CORS_ORIGIN.
      origin: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean),
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "OPTIONS"],
    })
  )
  .all("/graphql", async ({ request, set }) => {
    // Parse JWT from cookie and inject currentUser into context
    const cookieHeader = request.headers.get("cookie") ?? "";
    const match = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${COOKIE_NAME}=`));

    const token = match?.split("=")[1];
    const currentUser = token ? await verifyToken(token) : null;

    const pendingCookies: { name: string; opts: ReturnType<typeof cookieOptions> }[] = [];

    const response = await yoga.fetch(request, {
      currentUser: currentUser
        ? {
            id: currentUser.sub,
            email: currentUser.email,
            role: currentUser.role,
            name: currentUser.name,
          }
        : null,
      setCookie: (name: string, opts: ReturnType<typeof cookieOptions>) => {
        pendingCookies.push({ name, opts });
      },
    });

    // Copy yoga response headers & body
    const text = await response.text();
    const headers: Record<string, string> = {};
    response.headers.forEach((v, k) => {
      headers[k] = v;
    });

    // Append Set-Cookie headers
    for (const { name, opts } of pendingCookies) {
      const secure = opts.secure ? "; Secure" : "";
      const httpOnly = opts.httpOnly ? "; HttpOnly" : "";
      const sameSite = opts.sameSite ? `; SameSite=${opts.sameSite}` : "";
      const maxAge = opts.maxAge !== undefined ? `; Max-Age=${opts.maxAge}` : "";
      const path = opts.path ? `; Path=${opts.path}` : "";
      headers["set-cookie"] =
        `${name}=${opts.value}${path}${maxAge}${httpOnly}${secure}${sameSite}`;
    }

    set.headers = headers;
    set.status = response.status;
    return text;
  })
  .listen(3000);

console.log(`Backend running on http://localhost:${app.server?.port}`);
