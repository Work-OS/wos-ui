"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  authApi,
  AuthResponse,
  LoginPayload,
  SelectRolePayload,
  SwitchRolePayload,
} from "@/lib/auth-api"
import { useAuthStore } from "@/store/auth-store"

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
}

// ── Current user ──────────────────────────────────────────────────────────────

export function useMe() {
  const { apiRole, setUser } = useAuthStore()
  const q = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.me,
    enabled: !!apiRole,
    retry: false,
  })

  useEffect(() => {
    if (q.data) setUser(q.data)
  }, [q.data]) // eslint-disable-line react-hooks/exhaustive-deps

  return q
}

// ── Login ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const qc = useQueryClient()
  const router = useRouter()
  const { setFromAuth } = useAuthStore()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      if (data.requiresRoleSelection) return // caller handles role picker
      const res = data as AuthResponse
      setFromAuth(res) // cookies set by server automatically
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
      setFromAuth(res) // cookies set by server automatically
      qc.invalidateQueries({ queryKey: AUTH_KEYS.me })
      redirectByRole(res.role, router)
    },
  })
}

// ── Switch role (mid-session) ─────────────────────────────────────────────────

export function useSwitchRole() {
  const qc = useQueryClient()
  const { setFromAuth, setActiveUserRoleId } = useAuthStore()

  return useMutation({
    mutationFn: (payload: SwitchRolePayload) => authApi.switchRole(payload),
    onSuccess: (res, { userRoleId }) => {
      setFromAuth(res)
      setActiveUserRoleId(userRoleId)
      qc.invalidateQueries({ queryKey: AUTH_KEYS.me })
    },
  })
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogout() {
  const qc = useQueryClient()
  const router = useRouter()
  const { clear } = useAuthStore()

  return useMutation({
    mutationFn: () => authApi.logout(), // server clears cookies; browser sends them automatically
    onSettled: () => {
      clear()
      qc.clear()
      router.replace("/auth/login")
    },
  })
}

// ── Helper ────────────────────────────────────────────────────────────────────

function redirectByRole(_role: string, router: ReturnType<typeof useRouter>) {
  router.replace("/dashboard")
}
