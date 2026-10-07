import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth } from "@/lib/firebase/server";
import { ensureProfile } from "@/lib/firebase/data";
import {
  readJson,
  apiError,
  authenticatedUser,
  cloudMode,
  cookieOptions,
  HttpError,
  issueCsrf,
  requireCsrf,
  sessionCookie,
  sessionReference,
} from "@/lib/firebase/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store, private" };

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ csrfToken: "" }, { headers: noStore });
  const csrfToken = issueCsrf(request, response);
  const result = NextResponse.json({ csrfToken }, { headers: noStore });
  for (const cookie of response.cookies.getAll()) result.cookies.set(cookie);
  return result;
}
export async function POST(request: NextRequest) {
  try {
    if (!cloudMode()) throw new HttpError(404, "Đang ở chế độ local.");
    requireCsrf(request);
    const input = z
      .object({ idToken: z.string().min(1).max(15000), remember: z.boolean() })
      .strict()
      .parse(await readJson(request, 20000));
    const auth = adminAuth();
    const token = await auth.verifyIdToken(input.idToken, true);
    if (Math.abs(Date.now() / 1000 - token.auth_time) > 600)
      throw new HttpError(401, "Vui lòng đăng nhập lại trước khi tạo phiên.");
    const user = await auth.getUser(token.uid);
    if (user.disabled) throw new HttpError(403, "Tài khoản bị vô hiệu hóa.");
    const profile = await ensureProfile(user);
    const expiresIn = input.remember ? 5 * 86400000 : 2 * 3600000;
    const value =
      (await auth.createSessionCookie(input.idToken, { expiresIn })) +
      "~" +
      randomBytes(32).toString("hex");
    await sessionReference(user.uid, value).set({
      expiresAt: Date.now() + expiresIn,
    });
    const response = NextResponse.json({ profile }, { headers: noStore });
    response.cookies.set(sessionCookie, value, {
      ...cookieOptions(request),
      ...(input.remember ? { maxAge: expiresIn / 1000 } : {}),
    });
    return response;
  } catch (cause) {
    return apiError(cause);
  }
}
export async function DELETE(request: NextRequest) {
  try {
    requireCsrf(request);
    const value = request.cookies.get(sessionCookie)?.value;
    if (value) {
      try {
        const user = await authenticatedUser(value);
        await sessionReference(user.uid, value).delete();
      } catch (cause) {
        if (!(cause instanceof HttpError && cause.status === 401)) throw cause;
      }
    }
    const response = NextResponse.json({ ok: true }, { headers: noStore });
    response.cookies.set(sessionCookie, "", {
      ...cookieOptions(request),
      maxAge: 0,
    });
    response.cookies.set("myos-csrf", "", {
      ...cookieOptions(request),
      maxAge: 0,
    });
    return response;
  } catch (cause) {
    return apiError(cause);
  }
}
