"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminUsersApi, type CreateUserPayload, type ListUsersParams } from "@/lib/admin-api"

const USERS_KEY = (params: ListUsersParams) => ["admin", "users", params] as const

export function useAdminUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: USERS_KEY(params),
    queryFn:  () => adminUsersApi.list(params),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => adminUsersApi.create(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminUsersApi.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  })
}

export function useAssignRoles() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, userRoleIds }: { id: number; userRoleIds: number[] }) =>
      adminUsersApi.assignRoles(id, userRoleIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  })
}
