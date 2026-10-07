import { NextRequest, NextResponse } from "next/server";
import {
  readJson,
  apiError,
  authenticatedUser,
  cloudMode,
  HttpError,
  requireCsrf,
} from "@/lib/firebase/session";
import { kindSchema, readData, writeData } from "@/lib/firebase/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store, private" };
export async function GET(request: NextRequest) {
  try {
    if (!cloudMode()) throw new HttpError(404, "Đang ở chế độ local.");
    const user = await authenticatedUser();
    const kind = kindSchema.parse(request.nextUrl.searchParams.get("kind"));
    const id = request.nextUrl.searchParams.get("id") ?? undefined;
    return NextResponse.json(
      { value: await readData(user, kind, id) },
      { headers: noStore },
    );
  } catch (cause) {
    const result = apiError(cause);
    result.headers.set("Cache-Control", "no-store, private");
    return result;
  }
}
export async function POST(request: NextRequest) {
  try {
    if (!cloudMode()) throw new HttpError(404, "Đang ở chế độ local.");
    requireCsrf(request);
    const user = await authenticatedUser();
    const payload = await readJson(request, 2 * 1024 * 1024);
    return NextResponse.json(
      { value: await writeData(user, payload) },
      { headers: noStore },
    );
  } catch (cause) {
    const result = apiError(cause);
    result.headers.set("Cache-Control", "no-store, private");
    return result;
  }
}
