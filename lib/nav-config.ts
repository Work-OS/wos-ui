import type { NavItem } from "./types"

// All dashboard nav items — sidebar filters by user's authorities
export const navConfig: NavItem[] = [
  { label: "Overview",           section: "overview",    authority: null },
  { label: "Daily Time Record",  section: "dtr",         authority: "DTR:VIEW_ATTENDANCE",                    badge: 1 },
  { label: "My Payroll",         section: "payroll",     authority: "PAYROLL:VIEW_PAYSLIP" },
  { label: "My Request",         section: "request",     authority: "LEAVE:VIEW_OWN_LEAVE",                   badge: 2 },
  { label: "Employees",          section: "employees",   authority: "EMPLOYEE_MANAGEMENT:VIEW_EMPLOYEES" },
  { label: "Attendance",         section: "attendance",  authority: "ATTENDANCE_MANAGEMENT:VIEW_ALL_ATTENDANCE" },
  { label: "Leave Management",   section: "leave",       authority: "LEAVE_MANAGEMENT:VIEW_ALL_LEAVE_REQUESTS", badge: 4 },
  { label: "Recruitment",        section: "recruitment", authority: "RECRUITMENT:VIEW_JOB_POSTINGS" },
  { label: "Roles & Permissions",section: "roles",       authority: "ROLES_AND_PERMISSIONS:VIEW_ROLES" },
  { label: "Audit Log",          section: "audit",       authority: "AUDIT_LOG:VIEW_AUDIT_LOGS" },
  { label: "Configuration",      section: "config",      authority: "CONFIGURATION:VIEW_CONFIG" },
]

// Settings nav (always shown on /dashboard/settings/*)
export const settingsNavConfig: NavItem[] = [
  { label: "Profile",       section: "general",       authority: null },
  { label: "Security",      section: "security",      authority: null },
  { label: "Notifications", section: "notifications", authority: null },
  { label: "Appearance",    section: "appearance",    authority: null },
]

export const roleLabels: Record<string, string> = {
  EMPLOYEE: "Employee",
  HR:       "HR Manager",
  ADMIN:    "Admin",
}

export const sectionTitles: Record<string, string> = {
  overview:      "Overview",
  dtr:           "Daily Time Record",
  payroll:       "Payroll",
  request:       "My Request",
  leave:         "Leave Management",
  employees:     "Employees",
  attendance:    "Attendance",
  recruitment:   "Recruitment",
  roles:         "Roles & Permissions",
  audit:         "Audit Log",
  config:        "Configuration",
  settings:      "Settings",
  general:       "My Profile",
  security:      "Security",
  notifications: "Notifications",
  appearance:    "Appearance",
}
