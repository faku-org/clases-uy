import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "clases-ort-super-secret-dev-key-change-in-prod"
);

const COOKIE_NAME = "ort_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type JWTPayload = {
  sub: string;
  email: string;
  role: string;
  name: string;
};

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function cookieOptions(value: string, clear = false) {
  return {
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: clear ? 0 : COOKIE_MAX_AGE,
  };
}

export { COOKIE_NAME };
