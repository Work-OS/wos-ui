"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Sun01Icon,
  Moon02Icon,
  UserMultiple02Icon,
  ArrowDown01Icon,
  Setting06Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons"

interface TopbarProps {
  clockedIn?: boolean
}

export function Topbar({ clockedIn }: TopbarProps) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
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
      {role === "settings" && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
          Back
        </button>
      )}
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
          <HugeiconsIcon icon={Sun01Icon} size={15} strokeWidth={1.8} />
        ) : (
          <HugeiconsIcon icon={Moon02Icon} size={15} strokeWidth={1.8} />
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
              <HugeiconsIcon icon={UserMultiple02Icon} size={13} strokeWidth={1.8} />
              Switch role
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={12}
              strokeWidth={2}
              className={cn("transition-transform duration-200", switchRoleOpen && "rotate-180")}
            />
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
              <HugeiconsIcon icon={Setting06Icon} size={13} strokeWidth={1.8} className="mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
            <Link href="/">
              <HugeiconsIcon icon={Logout01Icon} size={13} strokeWidth={1.8} className="mr-2" />
              Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
