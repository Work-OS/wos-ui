"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminRolesApi, type UserRolePayload, type TemporaryAccessPayload } from "@/lib/admin-roles-api"

const USER_ROLES_KEY  = ["admin", "user-roles"]
const ACCESS_ROLES_KEY = ["admin", "access-roles"]

export function useUserRoles() {
  return useQuery({
    queryKey: USER_ROLES_KEY,
    queryFn:  adminRolesApi.listUserRoles,
  })
}

export function useAccessRoles() {
  return useQuery({
    queryKey: ACCESS_ROLES_KEY,
    queryFn:  adminRolesApi.listAccessRoles,
  })
}

export function useCreateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UserRolePayload) => adminRolesApi.createUserRole(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: USER_ROLES_KEY }),
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & UserRolePayload) =>
      adminRolesApi.updateUserRole(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_ROLES_KEY }),
  })
}

export function useDeleteUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminRolesApi.deleteUserRole(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: USER_ROLES_KEY }),
  })
}

export function useAddAccessRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userRoleId, accessRoleId }: { userRoleId: number; accessRoleId: number }) =>
      adminRolesApi.addAccessRole(userRoleId, accessRoleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_ROLES_KEY }),
  })
}

export function useRemoveAccessRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userRoleId, accessRoleId }: { userRoleId: number; accessRoleId: number }) =>
      adminRolesApi.removeAccessRole(userRoleId, accessRoleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_ROLES_KEY }),
  })
}

export function useSetTemporaryAccess() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      userRoleId,
      accessRoleId,
      payload,
    }: {
      userRoleId:   number
      accessRoleId: number
      payload:      TemporaryAccessPayload
    }) => adminRolesApi.setTemporaryAccess(userRoleId, accessRoleId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_ROLES_KEY }),
  })
}

export function useToggleFunctionality() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      userRoleId,
      accessRoleId,
      functionalityId,
      enabled,
    }: {
      userRoleId:      number
      accessRoleId:    number
      functionalityId: number
      enabled:         boolean
    }) => adminRolesApi.toggleFunctionality(userRoleId, accessRoleId, functionalityId, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_ROLES_KEY }),
  })
}
