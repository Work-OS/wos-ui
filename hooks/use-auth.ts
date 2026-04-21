"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authApi, AuthResponse, LoginPayload, SelectRolePayload } from "@/lib/auth-api"
import { useAuthStore } from "@/store/auth-store"

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
}

// ── Current user ──────────────────────────────────────────────────────────────

export function useMe() {
  const apiRole = useAuthStore((s) => s.apiRole)
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn:  authApi.me,
    enabled:  !!apiRole,   // cookies are sent automatically; use stored role as proxy for "logged in"
    retry:    false,
  })
}

// ── Login ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const qc = useQueryClient()
  const router = useRouter()
  const { setFromAuth } = useAuthStore()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      if (data.requiresRoleSelection) return  // caller handles role picker
      const res = data as AuthResponse
      setFromAuth(res)                       // cookies set by server automatically
      qc.invalidateQueries({ queryKey: AUTH_KEYS.me })
      redirectByRole(res.role, router)
    },
  })
}

// ── Select role (when requiresRoleSelection: true) ───────────────────────────

export function useSelectRole() {
  const qc = useQueryClient()
  const router = useRouter()
  const { setFromAuth } = useAuthStore()

  return useMutation({
    mutationFn: (payload: SelectRolePayload) => authApi.selectRole(payload),
    onSuccess: (res) => {
      setFromAuth(res)                       // cookies set by server automatically
      qc.invalidateQueries({ queryKey: AUTH_KEYS.me })
      redirectByRole(res.role, router)
    },
  })
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogout() {
  const qc = useQueryClient()
  const router = useRouter()
  const { clear } = useAuthStore()

  return useMutation({
    mutationFn: () => authApi.logout(),   // server clears cookies; browser sends them automatically
    onSettled: () => {
      clear()
      qc.clear()
      router.replace("/auth/login")
    },
  })
}

// ── Helper ────────────────────────────────────────────────────────────────────

function redirectByRole(role: string, router: ReturnType<typeof useRouter>) {
  const lower = role.toLowerCase()
  if (lower === "admin")    { router.replace("/dashboard/admin");    return }
  if (lower === "hr")       { router.replace("/dashboard/hr");       return }
  router.replace("/dashboard/employee")
}
