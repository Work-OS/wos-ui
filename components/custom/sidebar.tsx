"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navConfig, settingsNavConfig, roleLabels } from "@/lib/nav-config"
import { Logo } from "./logo"
import { StatusBadge } from "./status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Logout01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { useAuthStore } from "@/store/auth-store"
import { useLogout, useMe } from "@/hooks/use-auth"

const roleVariant: Record<string, "blue" | "purple" | "amber" | "gray"> = {
  EMPLOYEE: "blue",
  HR:       "purple",
  ADMIN:    "amber",
}

const NAV_ICONS: Record<string, IconSvgElement> = {
  overview:      GridViewIcon,
  dtr:           Clock01Icon,
  payroll:       CreditCardIcon,
  leave:         Calendar01Icon,
  request:       Calendar01Icon,
  profile:       UserCircleIcon,
  general:       UserCircleIcon,
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
}

function NavIcon({ section }: { section: string }) {
  const icon = NAV_ICONS[section] ?? GridViewIcon
  return <HugeiconsIcon icon={icon} size={14} strokeWidth={1.8} />
}

export function Sidebar() {
  const pathname       = usePathname()
  const logoutMutation = useLogout()
  useMe()

  const { user, apiRole, userRoleNames, authorities } = useAuthStore()

  // /dashboard → [2] is undefined (overview); /dashboard/dtr → [2] is "dtr"
  // /dashboard/settings/security → [2] is "settings", [3] is "security"
  const segments      = pathname.split("/")
  const section       = segments[2]        // top-level section
  const subSection    = segments[3]        // settings sub-section
  const isSettings    = section === "settings"

  const role         = apiRole?.toUpperCase() ?? "EMPLOYEE"
  const roleLabel    = userRoleNames[0] ?? roleLabels[role] ?? "Employee"
  const badgeVariant = roleVariant[role] ?? "gray"

  function hasAuthority(authority: string | null): boolean {
    if (authority === null) return true
    return authorities.includes(authority)
  }

  const initials    = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "—"
  const displayName = user ? `${user.firstName} ${user.lastName}` : "—"
  const employeeId  = user?.employeeId ?? ""

  // Choose which nav items to display
  const items = isSettings
    ? settingsNavConfig
    : navConfig.filter((item) => hasAuthority(item.authority))

  function isActive(itemSection: string) {
    if (isSettings) {
      return (subSection ?? "general") === itemSection
    }
    if (itemSection === "overview") return !section || section === "overview"
    return section === itemSection
  }

  function href(itemSection: string) {
    if (isSettings) return `/dashboard/settings/${itemSection}`
    if (itemSection === "overview") return "/dashboard"
    return `/dashboard/${itemSection}`
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Logo */}
      <div className="flex h-15 shrink-0 items-center gap-2 border-b border-border px-5">
        <Logo />
        <StatusBadge variant={badgeVariant} dot={false} className="ml-auto text-[10px]">
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
          const active = isActive(item.section)
          return (
            <Link
              key={item.section}
              href={href(item.section)}
              className={cn(
                "group mb-0.5 flex items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
                active
                  ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
              )}
            >
              <span className={cn(
                "shrink-0 transition-colors",
                active ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground",
              )}>
                <NavIcon section={item.section} />
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className={cn(
                  "flex min-w-4.5 items-center justify-center rounded-full px-1.5 py-px text-[10px] font-semibold",
                  active ? "bg-white/20 text-white" : "bg-red-500 text-white",
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={user?.profilePhoto ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
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
