import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development-only",
);

export const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "admin_auth_token";

export interface JWTSession extends JWTPayload {
  id: number;
  username: string;
  role: string;
  email: string;
  expires?: string | number | Date;
}

export async function encrypt(payload: JWTSession) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function decrypt(input: string): Promise<JWTSession> {
  const { payload } = await jwtVerify(input, secret, {
    algorithms: ["HS256"],
  });
  return payload as unknown as JWTSession;
}

export async function login(payload: JWTSession) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  const session = await encrypt(payload);

  (await cookies()).set(COOKIE_NAME, session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function logout() {
  (await cookies()).set(COOKIE_NAME, "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (!session) return null;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: COOKIE_NAME,
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
