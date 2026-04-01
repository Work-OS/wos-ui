"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Logo } from "@/components/custom/logo"
import { cn } from "@/lib/utils"

const views = [
  {
    href: "/landing",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
      </svg>
    ),
    label: "Landing",
    meta: "Public + jobs",
  },
  {
    href: "/auth",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    label: "Auth",
    meta: "Login · signup",
  },
  {
    href: "/dashboard/employee",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    label: "Employee",
    meta: "DTR · payroll · leave",
  },
  {
    href: "/dashboard/hr",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    label: "HR Manager",
    meta: "Team · approvals",
  },
  {
    href: "/dashboard/admin",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    label: "Admin",
    meta: "System · audit",
  },
  {
    href: "/dashboard/settings",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    label: "Settings",
    meta: "Profile · theme",
  },
]

export default function EntryPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6">
      <div className="w-full max-w-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <Logo size="md" />
        </div>
        <p className="mb-8 text-sm text-muted-foreground">
          Interactive prototype — choose a view
        </p>

        {/* Grid */}
        <div className="mb-6 grid grid-cols-3 gap-2.5">
          {views.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className={cn(
                "group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 text-left shadow-sm",
                "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md",
              )}
            >
              <span className="text-muted-foreground transition-colors group-hover:text-primary">
                {v.icon}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  {v.label}
                </p>
                <p className="text-[11px] text-muted-foreground">{v.meta}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Dark toggle */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Dark mode</span>
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className={cn(
              "relative h-4.75 w-8.5 rounded-full border transition-colors duration-150",
              mounted && resolvedTheme === "dark"
                ? "border-primary bg-primary"
                : "border-border bg-muted",
            )}
            aria-label="Toggle dark mode"
          >
            <span
              className={cn(
                "absolute top-0.5 size-3.25 rounded-full bg-white shadow-sm transition-transform duration-150",
                mounted && resolvedTheme === "dark"
                  ? "left-0.5 translate-x-3.75"
                  : "left-0.5 translate-x-0",
              )}
            />
          </button>
          <span className="text-xs text-muted-foreground/60">
            or press{" "}
            <kbd className="rounded border border-border bg-muted px-1 text-[10px]">
              D
            </kbd>
          </span>
        </div>
      </div>
    </div>
  )
}
