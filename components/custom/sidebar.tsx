"use client"

import { useState, useEffect } from "react"
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
} from "@hugeicons/core-free-icons"

const roleVariant: Record<Role, "blue" | "purple" | "amber" | "gray"> = {
  employee: "blue",
  hr: "purple",
  admin: "amber",
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
}

function NavIcon({ section }: { section: string }) {
  const icon = NAV_ICONS[section] ?? GridViewIcon
  return (
    <span className="shrink-0">
      <HugeiconsIcon icon={icon} size={14} strokeWidth={1.8} />
    </span>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  const rawRole = (pathname.split("/")[2] as Role) ?? "employee"
  const isSettings = rawRole === "settings"
  const activeSection = pathname.split("/")[3]

  const [sidebarRole, setSidebarRole] = useState<Role>(isSettings ? "employee" : rawRole)

  useEffect(() => {
    if (isSettings) {
      const stored = sessionStorage.getItem("wos_last_role") as Role | null
      if (stored && stored !== "settings") setSidebarRole(stored)
    } else {
      sessionStorage.setItem("wos_last_role", rawRole)
      setSidebarRole(rawRole)
    }
  }, [rawRole, isSettings])

  const role = sidebarRole
  const items = navConfig[role] ?? navConfig.employee
  const roleLabel = roleLabels[role]

  return (
    <aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Logo */}
      <div className="flex h-15 shrink-0 items-center gap-2 border-b border-border px-5">
        <Logo />
        <StatusBadge variant={roleVariant[role]} dot={false} className="ml-auto text-[10px]">
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
          const isActive = isOverview ? !activeSection : activeSection === item.section
          return (
            <Link
              key={item.section}
              href={isOverview ? `/dashboard/${role}` : `/dashboard/${role}/${item.section}`}
              className={cn(
                "group mb-0.5 flex items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
                isActive
                  ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground/60 group-hover:text-muted-foreground",
                )}
              >
                <NavIcon section={item.section} />
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span
                  className={cn(
                    "flex min-w-4.5 items-center justify-center rounded-full px-1.5 py-px text-[10px] font-semibold",
                    isActive ? "bg-white/20 text-white" : "bg-red-500 text-white",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}

      </nav>
    </aside>
  )
}
