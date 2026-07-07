export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body" | "method"> & {
  params?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(
    path,
    typeof window === "undefined" ? "http://localhost" : window.location.origin
  );
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return path.startsWith("http") ? url.toString() : url.pathname + url.search;
}

async function request<T>(
  method: string,
  path: string,
  { params, body, ...init }: RequestOptions & { body?: unknown } = {}
): Promise<T> {
  const url = buildUrl(path, params);
  const start = Date.now();

  const res = await fetch(url, {
    ...init,
    method,
    headers: { "Content-Type": "application/json", ...init.headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const durationMs = Date.now() - start;

  if (!res.ok) {
    const errorBody = await res.json().catch(() => undefined);
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[api] ${method} ${url} -> ${res.status} (${durationMs}ms)`,
        errorBody
      );
    }
    throw new ApiError(
      (errorBody as { message?: string })?.message ?? res.statusText,
      res.status,
      errorBody
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.debug(`[api] ${method} ${url} -> ${res.status} (${durationMs}ms)`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, options),
};
