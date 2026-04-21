import { api } from "./axios"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FunctionalityDef {
  id:   number
  name: string
}

export interface AccessRole {
  id:              number
  name:            string
  functionalities: FunctionalityDef[]
}

export interface AssignedFunctionality {
  id:              number
  functionalityId: number
  name:            string
  enabled:         boolean
}

export interface AssignedAccessRole {
  accessRoleId:    number
  name:            string
  functionalities: AssignedFunctionality[]
}

export interface UserRole {
  id:          number
  name:        string
  description: string
  color?:      string
  accessRoles: AssignedAccessRole[]
}

export interface UserRolePayload {
  name:        string
  description: string
  color?:      string
}

// ── API calls ─────────────────────────────────────────────────────────────────

export const adminRolesApi = {
  // User Roles CRUD
  listUserRoles: () =>
    api.get<UserRole[]>("/admin/user-roles").then((r) => r.data),

  createUserRole: (payload: UserRolePayload) =>
    api.post<UserRole>("/admin/user-roles", payload).then((r) => r.data),

  updateUserRole: (id: number, payload: UserRolePayload) =>
    api.put<UserRole>(`/admin/user-roles/${id}`, payload).then((r) => r.data),

  deleteUserRole: (id: number) =>
    api.delete(`/admin/user-roles/${id}`),

  // Access Roles assignment
  addAccessRole: (userRoleId: number, accessRoleId: number) =>
    api.post(`/admin/user-roles/${userRoleId}/access-roles`, { accessRoleId }).then((r) => r.data),

  removeAccessRole: (userRoleId: number, accessRoleId: number) =>
    api.delete(`/admin/user-roles/${userRoleId}/access-roles/${accessRoleId}`),

  // Functionality toggles
  toggleFunctionality: (
    userRoleId:      number,
    accessRoleId:    number,
    functionalityId: number,
    enabled:         boolean,
  ) =>
    api
      .put(
        `/admin/user-roles/${userRoleId}/access-roles/${accessRoleId}/functionalities/${functionalityId}`,
        { enabled },
      )
      .then((r) => r.data),

  // Available access roles (for the permission matrix)
  listAccessRoles: () =>
    api.get<AccessRole[]>("/admin/access-roles").then((r) => r.data),
}
