import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

// Relative base so requests go to the Next.js origin (/api/*).
// app/api/[...path]/route.ts proxies /api/* → the backend, keeping cookies first-party.
export const api = axios.create({
  baseURL:         "/api",
  headers:         { "Content-Type": "application/json" },
  timeout:         15_000,
  withCredentials: true,
})

// ── Response: silent token refresh on 401 ────────────────────────────────────
let refreshing: Promise<void> | null = null

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Only retry once, never on the refresh endpoint itself
    if (err.response?.status !== 401 || original._retry || original.url?.includes("/auth/refresh")) {
      return Promise.reject(err)
    }

    original._retry = true

    try {
      // Coalesce concurrent 401s into a single refresh call
      if (!refreshing) {
        refreshing = api
          .post("/auth/refresh")  // browser sends refresh_token cookie automatically
          .then(() => {})
          .finally(() => { refreshing = null })
      }

      await refreshing
      return api(original)
    } catch {
      if (typeof window !== "undefined") window.location.href = "/auth/login"
      return Promise.reject(err)
    }
  },
)
