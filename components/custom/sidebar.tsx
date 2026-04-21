"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navConfig, roleLabels } from "@/lib/nav-config"
import { Logo } from "./logo"
import { StatusBadge } from "./status-badge"
import type { Role } from "@/lib/types"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  GridViewIcon,
  Clock01Icon,
  CreditCardIcon,
  Calendar01Icon,
  UserCircleIcon,
  UserGroup02Icon,
  CheckListIcon,
  Briefcase01Icon,
  UserMultiple02Icon,
  Audit01Icon,
  Setting06Icon,
  ShieldUserIcon,
  UserShield01Icon,
  Notification01Icon,
  Sun01Icon,
  ArrowRight01Icon,
  Logout01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { useAuthStore } from "@/store/auth-store"
import { useLogout } from "@/hooks/use-auth"

const roleVariant: Record<Role, "blue" | "purple" | "amber" | "gray"> = {
  employee: "blue",
  hr:       "purple",
  admin:    "amber",
  settings: "gray",
}

const NAV_ICONS: Record<string, IconSvgElement> = {
  overview:      GridViewIcon,
  dtr:           Clock01Icon,
  payroll:       CreditCardIcon,
  leave:         Calendar01Icon,
  profile:       UserCircleIcon,
  employees:     UserGroup02Icon,
  attendance:    CheckListIcon,
  recruitment:   Briefcase01Icon,
  users:         UserMultiple02Icon,
  roles:         UserShield01Icon,
  audit:         Audit01Icon,
  config:        Setting06Icon,
  security:      ShieldUserIcon,
  notifications: Notification01Icon,
  appearance:    Sun01Icon,
  request:       Calendar01Icon,
}

function NavIcon({ section }: { section: string }) {
  const icon = NAV_ICONS[section] ?? GridViewIcon
  return <HugeiconsIcon icon={icon} size={14} strokeWidth={1.8} />
}

// Dashboard roles accessible per API role
const ACCESSIBLE_ROLES: Record<string, Role[]> = {
  ADMIN:    ["admin", "employee"],
  HR:       ["employee"],
  EMPLOYEE: ["employee"],
}

export function Sidebar() {
  const pathname       = usePathname()
  const logoutMutation = useLogout()

  const { user, apiRole, dashboardRole, userRoleNames } = useAuthStore()

  const rawRole       = (pathname.split("/")[2] as Role) ?? "employee"
  const isSettings    = rawRole === "settings"
  const activeSection = pathname.split("/")[3]

  // For settings pages, display nav for the persisted dashboardRole
  const displayRole: Role = isSettings ? dashboardRole : rawRole

  // Which dashboard views this user may access
  const accessible: Role[] = apiRole
    ? (ACCESSIBLE_ROLES[apiRole.toUpperCase()] ?? ["employee"])
    : [rawRole]

  const items      = navConfig[displayRole] ?? navConfig.employee
  const roleLabel  = userRoleNames[0] ?? roleLabels[displayRole]

  const initials    = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : rawRole.slice(0, 2).toUpperCase()
  const displayName = user ? `${user.firstName} ${user.lastName}` : "—"
  const employeeId  = user?.employeeId ?? ""

  return (
    <aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Logo */}
      <div className="flex h-15 shrink-0 items-center gap-2 border-b border-border px-5">
        <Logo />
        <StatusBadge variant={roleVariant[displayRole] ?? "gray"} dot={false} className="ml-auto text-[10px]">
          {roleLabel}
        </StatusBadge>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-1 px-2 pb-1 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Navigation
          </p>
        </div>

        {items.map((item) => {
          const isOverview = item.section === "overview"
          const isActive   = isOverview ? !activeSection : activeSection === item.section
          return (
            <Link
              key={item.section}
              href={isOverview ? `/dashboard/${displayRole}` : `/dashboard/${displayRole}/${item.section}`}
              className={cn(
                "group mb-0.5 flex items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
                isActive
                  ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
              )}
            >
              <span className={cn(
                "shrink-0 transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground",
              )}>
                <NavIcon section={item.section} />
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className={cn(
                  "flex min-w-4.5 items-center justify-center rounded-full px-1.5 py-px text-[10px] font-semibold",
                  isActive ? "bg-white/20 text-white" : "bg-red-500 text-white",
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}

        {/* Switch view — only if user has access to more than one dashboard */}
        {accessible.length > 1 && (
          <>
            <div className="mx-2 my-2 border-t border-border" />
            <div className="mb-1 px-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Switch view
              </p>
            </div>
            {accessible
              .filter((r) => r !== displayRole)
              .map((r) => (
                <Link
                  key={r}
                  href={`/dashboard/${r}`}
                  className="group mb-0.5 flex items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-all hover:border-border hover:bg-muted hover:text-foreground"
                >
                  <span className="shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.8} />
                  </span>
                  <span className="flex-1">{roleLabels[r]}</span>
                </Link>
              ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-foreground">{displayName}</p>
            <p className="truncate text-[10px] text-muted-foreground">{employeeId}</p>
          </div>
          <div className="flex gap-1">
            <Link
              href="/dashboard/settings"
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={Settings01Icon} size={13} strokeWidth={1.8} />
            </Link>
            <button
              onClick={() => logoutMutation.mutate()}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            >
              <HugeiconsIcon icon={Logout01Icon} size={13} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
