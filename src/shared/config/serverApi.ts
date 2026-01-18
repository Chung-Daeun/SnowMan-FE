import { cookies } from "next/headers";

const DEFAULT_API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL;

export async function serverFetch(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const url = path.startsWith("/") ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;

  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}
