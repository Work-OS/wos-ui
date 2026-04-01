"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { roleUsers, roleLabels, sectionTitles } from "@/lib/nav-config"
import { StatusBadge } from "./status-badge"
import { cn } from "@/lib/utils"
import type { Role } from "@/lib/types"

interface TopbarProps {
  clockedIn?: boolean
}

export function Topbar({ clockedIn }: TopbarProps) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [switchRoleOpen, setSwitchRoleOpen] = useState(false)
  useEffect(() => setMounted(true), [])

  const role = (pathname.split("/")[2] as Role) ?? "employee"
  const section = pathname.split("/")[3] ?? "overview"
  const user = roleUsers[role]

  const title =
    sectionTitles[section] ??
    section.charAt(0).toUpperCase() + section.slice(1)

  return (
    <div className="flex h-15 shrink-0 items-center gap-3 rounded-2xl border border-border bg-card px-5 shadow-sm">
      <span className="flex-1 text-[15px] font-semibold text-foreground">
        {title}
      </span>

      {clockedIn && (
        <StatusBadge variant="green">Online</StatusBadge>
      )}

      {/* Dark mode toggle */}
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Toggle dark mode"
        aria-label="Toggle dark mode"
      >
        {mounted && resolvedTheme === "dark" ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="outline-none" aria-label="User menu">
            <Avatar className="size-8 cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary/30">
              <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52" onCloseAutoFocus={() => setSwitchRoleOpen(false)}>
          <DropdownMenuLabel className="font-normal">
            <p className="text-[13px] font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.title}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Switch role accordion */}
          <DropdownMenuItem
            onSelect={(e) => { e.preventDefault(); setSwitchRoleOpen((v) => !v) }}
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              Switch role
            </span>
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={cn("transition-transform duration-200", switchRoleOpen && "rotate-180")}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </DropdownMenuItem>

          {switchRoleOpen && (
            <div className="mb-1 ml-2 space-y-0.5 border-l border-border pl-3">
              {(["employee", "hr", "admin", "settings"] as Role[]).map((r) => {
                if (r === role) return null
                return (
                  <DropdownMenuItem key={r} asChild>
                    <Link href={`/dashboard/${r}`} className="text-[12px]">
                      {roleLabels[r]}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </div>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mr-2">
                <circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
              </svg>
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
            <Link href="/">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mr-2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
