import type { NavItem, Role } from "./types"

export const navConfig: Record<Role, NavItem[]> = {
  employee: [
    { label: "My Dashboard", section: "overview" },
    { label: "Daily Time Record", section: "dtr", badge: 1 },
    { label: "My Payroll", section: "payroll" },
    { label: "Leave & Requests", section: "leave", badge: 2 },
    { label: "My Profile", section: "profile" },
  ],
  hr: [
    { label: "Overview", section: "overview" },
    { label: "Employees", section: "employees" },
    { label: "Attendance", section: "attendance" },
    { label: "Payroll", section: "payroll" },
    { label: "Leave Management", section: "leave", badge: 4 },
    { label: "Recruitment", section: "recruitment" },
  ],
  admin: [
    { label: "Overview", section: "overview" },
    { label: "System Users", section: "users" },
    { label: "Audit Log", section: "audit" },
    { label: "Configuration", section: "config" },
  ],
  settings: [
    { label: "Profile", section: "profile" },
    { label: "Security", section: "security" },
    { label: "Notifications", section: "notifications" },
    { label: "Appearance", section: "appearance" },
  ],
}

export const roleLabels: Record<Role, string> = {
  employee: "Employee",
  hr: "HR Manager",
  admin: "Admin",
  settings: "Settings",
}

export const roleUsers: Record<
  Role,
  { name: string; initials: string; title: string }
> = {
  employee: {
    name: "Alex Johnson",
    initials: "AJ",
    title: "UX Designer L2",
  },
  hr: {
    name: "Maria Santos",
    initials: "MS",
    title: "HR Manager",
  },
  admin: {
    name: "Robert Chen",
    initials: "RC",
    title: "System Administrator",
  },
  settings: {
    name: "Alex Johnson",
    initials: "AJ",
    title: "UX Designer L2",
  },
}

export const sectionTitles: Record<string, string> = {
  overview: "Overview",
  dtr: "Daily Time Record",
  payroll: "Payroll",
  leave: "Leave & Requests",
  profile: "My Profile",
  employees: "Employees",
  attendance: "Attendance",
  "leave-mgmt": "Leave Management",
  recruitment: "Recruitment",
  users: "System Users",
  audit: "Audit Log",
  config: "Configuration",
  security: "Security",
  notifications: "Notifications",
  appearance: "Appearance",
}
