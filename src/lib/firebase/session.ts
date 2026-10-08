import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, database } from "./server";
import { ZodError } from "zod";

export const sessionCookie = "myos-session";
const csrfCookie = "myos-csrf";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function cloudMode() {
  return process.env.NEXT_PUBLIC_MYOS_MODE !== "local";
}
export function cookieOptions(request: NextRequest) {
  return {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax" as const,
    path: "/",
  };
}
export function issueCsrf(request: NextRequest, response: NextResponse) {
  const existing = request.cookies.get(csrfCookie)?.value ?? "";
  const token = /^[a-f0-9]{64}$/.test(existing)
    ? existing
    : randomBytes(32).toString("hex");
  response.cookies.set(csrfCookie, token, {
    ...cookieOptions(request),
    maxAge: 3600,
  });
  return token;
}
export function requireCsrf(request: NextRequest) {
  const origin = process.env.APP_ORIGIN || request.nextUrl.origin;
  if (
    request.headers.get("origin") !== origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new HttpError(403, "Yêu cầu không xuất phát từ MyOS.");
  const header = request.headers.get("x-myos-csrf") ?? "";
  const cookie = request.cookies.get(csrfCookie)?.value ?? "";
  if (
    !/^[a-f0-9]{64}$/.test(header) ||
    header.length !== cookie.length ||
    !timingSafeEqual(Buffer.from(header), Buffer.from(cookie))
  )
    throw new HttpError(
      403,
      "Phiên thao tác đã hết hạn. Tải lại trang rồi thử lại.",
    );
}
export async function authenticatedUser(token?: string) {
  const value = token ?? (await cookies()).get(sessionCookie)?.value;
  if (!value) throw new HttpError(401, "Vui lòng đăng nhập để tiếp tục.");
  try {
    const auth = adminAuth();
    const [jwt, nonce] = value.split("~");
    if (!nonce || !/^[a-f0-9]{64}$/.test(nonce))
      throw new HttpError(401, "Phiên đăng nhập không hợp lệ.");
    const claims = await auth.verifySessionCookie(jwt);
    // Verify signature first; check revocation/disabled with the same UserRecord
    // returned to the DAL instead of fetching it twice through the Admin SDK.
    const [user, session] = await Promise.all([
      auth.getUser(claims.uid),
      sessionReference(claims.uid, value).get(),
    ]);
    if (!session.exists || Number(session.get("expiresAt")) <= Date.now())
      throw new HttpError(401, "Phiên đăng nhập đã kết thúc.");
    if (user.disabled)
      throw new HttpError(401, "Tài khoản không còn hoạt động.");
    if (
      user.tokensValidAfterTime &&
      claims.auth_time * 1000 < new Date(user.tokensValidAfterTime).getTime()
    )
      throw new HttpError(
        401,
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      );
    return user;
  } catch (cause) {
    if (cause instanceof HttpError) throw cause;
    const code =
      typeof cause === "object" && cause !== null && "code" in cause
        ? String(cause.code)
        : "";
    if (
      [
        "auth/session-cookie-expired",
        "auth/session-cookie-revoked",
        "auth/argument-error",
        "auth/invalid-session-cookie",
        "auth/user-not-found",
        "auth/user-disabled",
      ].includes(code)
    )
      throw new HttpError(
        401,
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      );
    throw cause;
  }
}
export function sessionReference(uid: string, value: string) {
  return database().doc(
    `users/${uid}/sessions/${createHash("sha256").update(value).digest("hex")}`,
  );
}
export async function requirePageUser() {
  try {
    return await authenticatedUser();
  } catch (cause) {
    if (cause instanceof HttpError && cause.status === 401) redirect("/login");
    throw cause;
  }
}
export function apiError(cause: unknown) {
  const code =
    typeof cause === "object" && cause !== null && "code" in cause
      ? String(cause.code)
      : "";
  if (
    [
      "auth/id-token-expired",
      "auth/id-token-revoked",
      "auth/invalid-id-token",
      "auth/argument-error",
    ].includes(code)
  )
    cause = new HttpError(
      401,
      "Thông tin đăng nhập không hợp lệ. Hãy đăng nhập lại.",
    );
  if (cause instanceof ZodError)
    return NextResponse.json(
      { error: cause.issues[0]?.message ?? "Dữ liệu không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store, private" } },
    );
  if (cause instanceof HttpError)
    return NextResponse.json(
      { error: cause.message },
      {
        status: cause.status,
        headers: { "Cache-Control": "no-store, private" },
      },
    );
  return NextResponse.json(
    {
      error:
        "Không kết nối được Firebase phía server. Kiểm tra credentials, database và quyền truy cập rồi thử lại.",
    },
    { status: 503, headers: { "Cache-Control": "no-store, private" } },
  );
}

export async function readJson(request: NextRequest, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Thiếu dữ liệu.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > limit) {
      await reader.cancel();
      throw new HttpError(413, "Yêu cầu vượt kích thước cho phép.");
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new HttpError(400, "Dữ liệu JSON không hợp lệ.");
  }
}
