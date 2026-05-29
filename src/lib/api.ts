const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const storageKey = "aihindinews_session_id";
  let sessionId = window.localStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { revalidate?: number }
): Promise<T> {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options?.headers as Record<string, string>) ?? {}),
  };

  const sessionId = getSessionId();
  if (sessionId) {
    headers["X-Session-Id"] = sessionId;
  }

  if (process.env.NEXT_PHASE === "phase-production-build" && !process.env.NEXT_PUBLIC_API_URL) {
    throw new Error(`API unavailable during static build: ${path}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}
