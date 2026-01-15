const DEFAULT_API_BASE_URL = "http://localhost:8080";


// 브라우저/서버 공통으로 사용할 API Base URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

// 사용 예시: fetch(getApiUrl("/users"))
export const getApiUrl = (path: string) => {
  if (!path.startsWith("/")) return `${API_BASE_URL}/${path}`;
  return `${API_BASE_URL}${path}`;
};

// 세션 기반 인증을 위한 fetch 래퍼
export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(getApiUrl(path), {
    ...init,
    credentials: "include", // ⭐ 세션 쿠키(JSESSIONID) 포함
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}
