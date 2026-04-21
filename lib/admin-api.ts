import { api } from "./axios"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id:            number
  employeeId:    string
  firstName:     string
  lastName:      string
  email:         string
  role:          string
  userRoles:     {
    roleId:    number
    roleName:  string
    roleColor: string | null
  }[]
  active:        boolean
  createdAt:     string
  updatedAt:     string
}

export interface PageResponse<T> {
  content:       T[]
  totalElements: number
  totalPages:    number
  size:          number
  number:        number  // current page (0-indexed)
}

export interface ListUsersParams {
  page?: number
  size?: number
  role?: string    // "EMPLOYEE" | "HR" | "ADMIN" — omit for all
}

export interface CreateUserPayload {
  firstName:   string
  lastName:    string
  email:       string
  password:    string
  userRoleIds: number[]
}

export interface ActiveUserRole {
  id:          number
  name:        string
  description: string
  active:      boolean
}

export interface AuditLog {
  id:        number
  logCode:   string
  user:      string
  initials:  string
  action:    string
  target:    string
  ip:        string
  timestamp: string
  severity:  "info" | "warning" | "critical"
}

export interface AdminStats {
  totalUsers:     number
  activeSessions: number
  systemHealth:   number
  criticalAlerts: number
}

// ── API calls ─────────────────────────────────────────────────────────────────

export const adminAuditApi = {
  list: (params: { page?: number; size?: number; search?: string } = {}) =>
    api
      .get<PageResponse<AuditLog>>("/admin/audit-logs", { params: { page: 0, size: 20, ...params } })
      .then((r) => r.data),
}

export const adminStatsApi = {
  get: () =>
    api.get<AdminStats>("/admin/stats").then((r) => r.data),
}

export const adminUsersApi = {
  list: (params: ListUsersParams = {}) =>
    api
      .get<PageResponse<AdminUser>>("/admin/users", { params: { page: 0, size: 20, ...params } })
      .then((r) => r.data),

  create: (payload: CreateUserPayload) =>
    api.post<AdminUser>("/admin/users", payload).then((r) => r.data),

  listActiveUserRoles: () =>
    api.get<ActiveUserRole[]>("/admin/user-roles/active").then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/admin/users/${id}`),

  assignRoles: (id: number, userRoleIds: number[]) =>
    api.put<AdminUser>(`/admin/users/${id}/employee-roles`, { userRoleIds }).then((r) => r.data),
}
