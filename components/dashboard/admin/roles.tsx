"use client"

import React, { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Edit01Icon,
  Delete01Icon,
  UserShield01Icon,
  User03Icon,
  ManagerIcon,
  UserStar01Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────

type Permission = "view" | "add" | "edit" | "delete"

interface ModulePermission {
  view: boolean
  add: boolean
  edit: boolean
  delete: boolean
}

interface RoleDefinition {
  id: string
  name: string
  description: string
  builtIn?: boolean
  permissions: Record<string, ModulePermission>
}

// ── Constants ──────────────────────────────────────────────────────────────

interface ModuleGroup {
  group: string
  modules: { key: string; label: string }[]
}

const MODULE_GROUPS: ModuleGroup[] = [
  {
    group: "Workforce",
    modules: [
      { key: "attendance",      label: "Attendance & DTR" },
      { key: "leave",           label: "Leave Management" },
      { key: "leave_approval",  label: "Leave Approvals" },
      { key: "overtime",        label: "Overtime Requests" },
      { key: "overtime_approval", label: "Overtime Approvals" },
    ],
  },
  {
    group: "Payroll",
    modules: [
      { key: "payroll",         label: "Payroll Processing" },
      { key: "payroll_config",  label: "Payroll Configuration" },
      { key: "payslips",        label: "Payslips" },
      { key: "deductions",      label: "Deductions & Benefits" },
    ],
  },
  {
    group: "People",
    modules: [
      { key: "employees",       label: "Employee Records" },
      { key: "recruitment",     label: "Recruitment" },
      { key: "departments",     label: "Departments" },
    ],
  },
  {
    group: "System",
    modules: [
      { key: "reports",         label: "Reports & Analytics" },
      { key: "users",           label: "System Users" },
      { key: "roles",           label: "Roles & Permissions" },
      { key: "audit",           label: "Audit Log" },
      { key: "config",          label: "Configuration" },
    ],
  },
]

const ALL_MODULES = MODULE_GROUPS.flatMap((g) => g.modules)

const PERMISSIONS: Permission[] = ["view", "add", "edit", "delete"]

function emptyPerms(): Record<string, ModulePermission> {
  return Object.fromEntries(
    ALL_MODULES.map((m) => [m.key, { view: false, add: false, edit: false, delete: false }]),
  )
}

function employeePerms(): Record<string, ModulePermission> {
  const p = emptyPerms()
  p.attendance = { view: true, add: false, edit: false, delete: false }
  p.leave      = { view: true, add: true,  edit: false, delete: false }
  p.payroll    = { view: false, add: false, edit: false, delete: false }
  p.payslips   = { view: true, add: false, edit: false, delete: false }
  p.overtime   = { view: true, add: true,  edit: false, delete: false }
  return p
}

function managerPerms(): Record<string, ModulePermission> {
  const p = emptyPerms()
  p.attendance       = { view: true, add: true,  edit: true,  delete: false }
  p.leave            = { view: true, add: true,  edit: true,  delete: false }
  p.leave_approval   = { view: true, add: true,  edit: true,  delete: false }
  p.overtime         = { view: true, add: true,  edit: true,  delete: false }
  p.overtime_approval = { view: true, add: true, edit: true,  delete: false }
  p.payroll          = { view: true, add: false, edit: false, delete: false }
  p.payslips         = { view: true, add: false, edit: false, delete: false }
  p.employees        = { view: true, add: false, edit: true,  delete: false }
  p.departments      = { view: true, add: false, edit: false, delete: false }
  p.reports          = { view: true, add: false, edit: false, delete: false }
  return p
}

function teamLeadPerms(): Record<string, ModulePermission> {
  const p = emptyPerms()
  p.attendance     = { view: true, add: true,  edit: false, delete: false }
  p.leave          = { view: true, add: true,  edit: false, delete: false }
  p.leave_approval = { view: true, add: true,  edit: false, delete: false }
  p.overtime       = { view: true, add: true,  edit: false, delete: false }
  p.payslips       = { view: true, add: false, edit: false, delete: false }
  p.employees      = { view: true, add: false, edit: false, delete: false }
  return p
}

const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: "employee",
    name: "Employee",
    description: "Standard employee access",
    builtIn: true,
    permissions: employeePerms(),
  },
  {
    id: "manager",
    name: "Manager",
    description: "Team & operations management",
    permissions: managerPerms(),
  },
  {
    id: "team-lead",
    name: "Team Lead",
    description: "Attendance oversight & approvals",
    permissions: teamLeadPerms(),
  },
]

const ROLE_ICONS: Record<string, React.ComponentProps<typeof HugeiconsIcon>["icon"]> = {
  employee:  User03Icon,
  manager:   ManagerIcon,
  "team-lead": UserStar01Icon,
}

// ── Component ──────────────────────────────────────────────────────────────

export function RolesSection() {
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES)
  const [activeId, setActiveId] = useState<string>("employee")
  const [creating, setCreating] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [dirty, setDirty] = useState(false)

  const active = roles.find((r) => r.id === activeId)!

  // ── Permission toggle ──────────────────────────────────────────────────

  function togglePerm(moduleKey: string, perm: Permission) {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== activeId) return r
        const updated = {
          ...r,
          permissions: {
            ...r.permissions,
            [moduleKey]: {
              ...r.permissions[moduleKey],
              [perm]: !r.permissions[moduleKey][perm],
            },
          },
        }
        return updated
      }),
    )
    setDirty(true)
  }

  function toggleAllPermsForModule(moduleKey: string) {
    const current = active.permissions[moduleKey]
    const allOn = PERMISSIONS.every((p) => current[p])
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== activeId) return r
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [moduleKey]: { view: !allOn, add: !allOn, edit: !allOn, delete: !allOn },
          },
        }
      }),
    )
    setDirty(true)
  }

  function toggleAllForPerm(perm: Permission) {
    const allOn = ALL_MODULES.every((m) => active.permissions[m.key][perm])
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== activeId) return r
        const newPerms = { ...r.permissions }
        ALL_MODULES.forEach((m) => {
          newPerms[m.key] = { ...newPerms[m.key], [perm]: !allOn }
        })
        return { ...r, permissions: newPerms }
      }),
    )
    setDirty(true)
  }

  // ── Create role ────────────────────────────────────────────────────────

  function createRole() {
    if (!newRoleName.trim()) return
    const id = newRoleName.toLowerCase().replace(/\s+/g, "-")
    const newRole: RoleDefinition = {
      id,
      name: newRoleName.trim(),
      description: "Custom role",
      permissions: employeePerms(),
    }
    setRoles((prev) => [...prev, newRole])
    setActiveId(id)
    setNewRoleName("")
    setCreating(false)
    setDirty(false)
  }

  function deleteRole(id: string) {
    setRoles((prev) => prev.filter((r) => r.id !== id))
    setActiveId("employee")
    setDirty(false)
  }

  function saveRole() {
    setDirty(false)
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-5 h-full">
      {/* ── Role list sidebar ── */}
      <div className="flex w-56 shrink-0 flex-col gap-1">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Roles
          </p>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <HugeiconsIcon icon={Add01Icon} size={12} strokeWidth={2} />
            New
          </button>
        </div>

        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => { setActiveId(r.id); setDirty(false) }}
            className={cn(
              "group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-150",
              activeId === r.id
                ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                : "border-transparent bg-muted/50 hover:bg-muted text-foreground",
            )}
          >
            <div className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-lg",
              activeId === r.id ? "bg-white/15" : "bg-background",
            )}>
              <HugeiconsIcon
                icon={ROLE_ICONS[r.id] ?? UserShield01Icon}
                size={14}
                strokeWidth={1.8}
                className={activeId === r.id ? "text-primary-foreground" : "text-muted-foreground"}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn("truncate text-[12px] font-semibold", activeId === r.id ? "text-primary-foreground" : "text-foreground")}>
                {r.name}
              </p>
              {r.builtIn && (
                <p className={cn("text-[10px]", activeId === r.id ? "text-white/60" : "text-muted-foreground")}>
                  Built-in
                </p>
              )}
            </div>
          </button>
        ))}

        {/* New role input */}
        {creating && (
          <div className="mt-1 rounded-xl border border-border bg-card p-2.5 shadow-sm">
            <Input
              autoFocus
              placeholder="Role name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") createRole(); if (e.key === "Escape") setCreating(false) }}
              className="mb-2 h-8 text-[12px]"
            />
            <div className="flex gap-1.5">
              <Button size="sm" className="h-7 flex-1 text-[11px]" onClick={createRole} disabled={!newRoleName.trim()}>
                Create
              </Button>
              <button
                onClick={() => setCreating(false)}
                className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Permission matrix ── */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <HugeiconsIcon icon={ROLE_ICONS[active.id] ?? UserShield01Icon} size={18} strokeWidth={1.8} className="text-primary" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">{active.name}</h2>
              <p className="text-[12px] text-muted-foreground">{active.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!active.builtIn && (
              <button
                onClick={() => deleteRole(active.id)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-destructive transition-colors hover:bg-destructive/5"
              >
                <HugeiconsIcon icon={Delete01Icon} size={13} strokeWidth={2} />
                Delete role
              </button>
            )}
            <Button
              size="sm"
              className="gap-1.5"
              onClick={saveRole}
              disabled={!dirty}
            >
              <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2} />
              Save changes
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-b border-border">
                <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Module
                </th>
                {PERMISSIONS.map((perm) => {
                  const allOn = ALL_MODULES.every((m) => active.permissions[m.key][perm])
                  return (
                    <th key={perm} className="w-24 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <div className="flex flex-col items-center gap-1.5">
                        <span>{perm}</span>
                        <Checkbox
                          checked={allOn}
                          onChange={() => toggleAllForPerm(perm)}
                          title={`Toggle all ${perm}`}
                        />
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {MODULE_GROUPS.map((group) => (
                <React.Fragment key={group.group}>
                  {/* Group header row */}
                  <tr className="bg-muted/40">
                    <td colSpan={5} className="py-2 pl-6 pr-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                        {group.group}
                      </span>
                    </td>
                  </tr>

                  {/* Module rows */}
                  {group.modules.map((mod) => {
                    const perms = active.permissions[mod.key]
                    const allOn = PERMISSIONS.every((p) => perms[p])
                    return (
                      <tr
                        key={mod.key}
                        className="border-b border-border/40 transition-colors hover:bg-muted/40"
                      >
                        <td className="py-3 pl-8 pr-4">
                          <div className="flex items-center gap-2.5">
                            <Checkbox
                              checked={allOn}
                              onChange={() => toggleAllPermsForModule(mod.key)}
                              title="Toggle all"
                            />
                            <span className="text-[13px] font-medium text-foreground">{mod.label}</span>
                          </div>
                        </td>
                        {PERMISSIONS.map((perm) => (
                          <td key={perm} className="w-24 px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={perms[perm]}
                                onChange={() => togglePerm(mod.key, perm)}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Checkbox ───────────────────────────────────────────────────────────────

function Checkbox({
  checked,
  onChange,
  title,
}: {
  checked: boolean
  onChange: () => void
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      title={title}
      className={cn(
        "flex size-4.5 items-center justify-center rounded border-2 transition-all duration-150",
        checked
          ? "border-primary bg-primary"
          : "border-border bg-background hover:border-primary/50",
      )}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
