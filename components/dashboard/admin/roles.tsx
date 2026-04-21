"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Delete01Icon,
  UserShield01Icon,
  Cancel01Icon,
  Loading03Icon,
  Alert01Icon,
  Edit01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  useUserRoles,
  useAccessRoles,
  useCreateUserRole,
  useUpdateUserRole,
  useDeleteUserRole,
  useAddAccessRole,
  useRemoveAccessRole,
  useToggleFunctionality,
} from "@/hooks/use-admin-roles"
import type { AssignedAccessRole } from "@/lib/admin-roles-api"

// ── Checkbox ───────────────────────────────────────────────────────────────

function Checkbox({
  checked,
  disabled,
  onChange,
  title,
}: {
  checked:  boolean
  disabled?: boolean
  onChange: () => void
  title?:   string
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      title={title}
      disabled={disabled}
      className={cn(
        "flex size-4.5 items-center justify-center rounded border-2 transition-all duration-150",
        checked
          ? "border-primary bg-primary"
          : "border-border bg-background hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-40",
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

// ── Create / Edit Role Modal ───────────────────────────────────────────────

const DEFAULT_ROLE_COLOR = "#6366f1"

function RoleFormInline({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial?:  { name: string; description: string; color?: string }
  onSave:    (name: string, description: string, color: string) => void
  onCancel:  () => void
  isPending: boolean
}) {
  const [name,  setName]  = useState(initial?.name        ?? "")
  const [desc,  setDesc]  = useState(initial?.description ?? "")
  const [color, setColor] = useState(initial?.color       ?? DEFAULT_ROLE_COLOR)

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm space-y-2">
      <div className="space-y-1">
        <Label className="text-[11px]">Role name</Label>
        <Input
          autoFocus
          placeholder="e.g. Payroll Clerk"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) onSave(name.trim(), desc.trim(), color)
            if (e.key === "Escape") onCancel()
          }}
          className="h-8 text-[12px]"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-[11px]">Description</Label>
        <Input
          placeholder="Short description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="h-8 text-[12px]"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-[11px]">Badge color</Label>
        <div className="flex items-center gap-2">
          <label className="relative cursor-pointer shrink-0">
            <span
              className="block size-7 rounded-full border-2 border-border shadow-sm"
              style={{ backgroundColor: color }}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
          <Input
            value={color}
            onChange={(e) => {
              const v = e.target.value
              setColor(v)
            }}
            className="h-8 w-28 font-mono text-[12px] uppercase"
            maxLength={7}
            placeholder="#6366f1"
          />
        </div>
      </div>
      <div className="flex gap-1.5 pt-1">
        <Button
          size="sm"
          className="h-7 flex-1 text-[11px]"
          disabled={!name.trim() || isPending}
          onClick={() => onSave(name.trim(), desc.trim(), color)}
        >
          {isPending ? "Saving…" : initial ? "Update" : "Create"}
        </Button>
        <button
          onClick={onCancel}
          className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export function RolesSection() {
  const [activeId,   setActiveId]   = useState<number | null>(null)
  const [creating,   setCreating]   = useState(false)
  const [editingId,  setEditingId]  = useState<number | null>(null)
  const [deleteId,   setDeleteId]   = useState<number | null>(null)
  const [confirmDisable, setConfirmDisable] = useState<{ accessRoleId: number; label: string } | null>(null)

  const rolesQ       = useUserRoles()
  const accessRolesQ = useAccessRoles()

  const createMutation    = useCreateUserRole()
  const updateMutation    = useUpdateUserRole()
  const deleteMutation    = useDeleteUserRole()
  const addAccessRole     = useAddAccessRole()
  const removeAccessRole  = useRemoveAccessRole()
  const toggleFunc        = useToggleFunctionality()

  const roles             = rolesQ.data ?? []
  const accessRoles       = accessRolesQ.data ?? []
  const active            = roles.find((r) => r.id === activeId) ?? roles[0] ?? null

  function resolveAccessRoleId(ar: AssignedAccessRole): number | null {
    const raw = ar as unknown as {
      accessRoleId?: number
      id?: number
      accessRole?: { id?: number; accessRoleId?: number }
    }
    return raw.accessRoleId ?? raw.id ?? raw.accessRole?.id ?? raw.accessRole?.accessRoleId ?? null
  }

  function functionalityLabel(f: {
    name?: string
    functionalityName?: string
    functionality?: { name?: string }
  }) {
    const raw = f as { functionalityName?: string; functionality?: { name?: string } }
    return f.name ?? raw.functionalityName ?? raw.functionality?.name ?? "Unnamed functionality"
  }

  function catalogAccessRoleLabel(ar: {
    name?: string
    pageName?: string
    code?: string
    roleName?: string
  }) {
    return ar.name ?? ar.pageName ?? ar.code ?? ar.roleName ?? "Unnamed access role"
  }

  function resolveFunctionalityId(f: {
    id?: number
    functionalityId?: number
    functionality?: { id?: number }
  }): number | null {
    return f.functionalityId ?? f.id ?? f.functionality?.id ?? null
  }

  // Helpers to read current state from the active role
  function getAssigned(accessRoleId: number) {
    return active?.accessRoles.find((ar) => resolveAccessRoleId(ar) === accessRoleId) ?? null
  }

  function isFuncEnabled(accessRoleId: number, functionalityId: number): boolean {
    const assigned = getAssigned(accessRoleId)
    if (!assigned) return false
    return assigned.functionalities.find((f) => resolveFunctionalityId(f) === functionalityId)?.enabled ?? false
  }

  function handleToggleAccessRole(accessRoleId: number) {
    if (!active) return
    const assigned = getAssigned(accessRoleId)
    if (assigned) {
      removeAccessRole.mutate({ userRoleId: active.id, accessRoleId })
    } else {
      addAccessRole.mutate({ userRoleId: active.id, accessRoleId })
    }
  }

  function handleToggleFunctionality(accessRoleId: number, functionalityId: number) {
    if (!active) return
    const assigned = getAssigned(accessRoleId)
    const currentlyEnabled = isFuncEnabled(accessRoleId, functionalityId)

    if (!assigned) {
      addAccessRole.mutate({ userRoleId: active.id, accessRoleId }, {
        onSuccess: () => {
          toggleFunc.mutate({ userRoleId: active.id, accessRoleId, functionalityId, enabled: true })
        },
      })
      return
    }

    toggleFunc.mutate({ userRoleId: active.id, accessRoleId, functionalityId, enabled: !currentlyEnabled })
  }

  const isMutating =
    addAccessRole.isPending ||
    removeAccessRole.isPending ||
    toggleFunc.isPending

  // ── Loading / error states ─────────────────────────────────────────────

  if (rolesQ.isLoading || accessRolesQ.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={Loading03Icon} size={20} strokeWidth={1.8} className="animate-spin" />
        <span className="text-[13px]">Loading roles…</span>
      </div>
    )
  }

  if (rolesQ.isError || accessRolesQ.isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={Alert01Icon} size={24} strokeWidth={1.5} className="text-red-400" />
        <p className="text-[13px]">Failed to load roles data</p>
      </div>
    )
  }

  return (
    <div className="flex h-full gap-5">
      {/* ── Role list sidebar ── */}
      <div className="flex w-60 shrink-0 flex-col gap-1">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Roles
          </p>
          <button
            onClick={() => { setCreating(true); setEditingId(null) }}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <HugeiconsIcon icon={Add01Icon} size={12} strokeWidth={2} />
            New
          </button>
        </div>

        {roles.map((r) => (
          <div key={r.id}>
            {editingId === r.id ? (
              <RoleFormInline
                initial={{ name: r.name, description: r.description, color: r.color }}
                isPending={updateMutation.isPending}
                onSave={(name, description, color) =>
                  updateMutation.mutate(
                    { id: r.id, name, description, color },
                    { onSuccess: () => setEditingId(null) },
                  )
                }
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => { setActiveId(r.id); setCreating(false); setEditingId(null) }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setActiveId(r.id); setCreating(false); setEditingId(null) } }}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-150",
                  (active?.id ?? roles[0]?.id) === r.id
                    ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                    : "border-transparent bg-muted/50 hover:bg-muted text-foreground",
                )}
              >
                <div className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg",
                  (active?.id ?? roles[0]?.id) === r.id ? "bg-white/15" : "bg-background",
                )}>
                  <HugeiconsIcon
                    icon={UserShield01Icon}
                    size={14}
                    strokeWidth={1.8}
                    className={(active?.id ?? roles[0]?.id) === r.id ? "text-primary-foreground" : "text-muted-foreground"}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className={cn(
                      "truncate text-[12px] font-semibold",
                      (active?.id ?? roles[0]?.id) === r.id ? "text-primary-foreground" : "text-foreground",
                    )}>
                      {r.name}
                    </p>
                    {r.color && (
                      <span
                        className="shrink-0 rounded-full border px-1.5 py-px text-[9px] font-semibold leading-tight group-hover:hidden"
                        style={{
                          backgroundColor: `${r.color}1a`,
                          borderColor:     `${r.color}40`,
                          color:           r.color,
                        }}
                      >
                        {r.name}
                      </span>
                    )}
                  </div>
                  {r.description && (
                    <p className={cn(
                      "truncate text-[10px]",
                      (active?.id ?? roles[0]?.id) === r.id ? "text-white/60" : "text-muted-foreground",
                    )}>
                      {r.description}
                    </p>
                  )}
                </div>
                {/* Edit / delete buttons (visible on hover) */}
                <div
                  className="hidden items-center gap-1 group-hover:flex"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setEditingId(r.id); setCreating(false) }}
                    className="rounded p-0.5 opacity-70 hover:opacity-100"
                  >
                    <HugeiconsIcon icon={Edit01Icon} size={11} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setDeleteId(r.id)}
                    className="rounded p-0.5 opacity-70 hover:text-red-400 hover:opacity-100"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={11} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New role form */}
        {creating && (
          <RoleFormInline
            isPending={createMutation.isPending}
            onSave={(name, description, color) =>
              createMutation.mutate(
                { name, description, color },
                {
                  onSuccess: (created) => {
                    setActiveId(created.id)
                    setCreating(false)
                  },
                },
              )
            }
            onCancel={() => setCreating(false)}
          />
        )}

        {/* Delete confirm */}
        {deleteId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <HugeiconsIcon icon={Delete01Icon} size={18} strokeWidth={1.8} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold">Delete role?</h2>
                  <p className="text-[12px] text-muted-foreground">
                    {roles.find((r) => r.id === deleteId)?.name}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                This will permanently remove the role and cannot be undone.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex h-9 flex-1 items-center justify-center rounded-lg border border-border text-[13px] font-medium transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <Button
                  variant="destructive"
                  className="h-9 flex-1 text-[13px]"
                  disabled={deleteMutation.isPending}
                  onClick={() =>
                    deleteMutation.mutate(deleteId, {
                      onSuccess: () => {
                        setDeleteId(null)
                        setActiveId(null)
                      },
                    })
                  }
                >
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Permission matrix ── */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card">
        {active ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                  <HugeiconsIcon icon={UserShield01Icon} size={18} strokeWidth={1.8} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold">{active.name}</h2>
                  <p className="text-[12px] text-muted-foreground">{active.description}</p>
                </div>
              </div>
              {isMutating && (
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <HugeiconsIcon icon={Loading03Icon} size={13} strokeWidth={2} className="animate-spin" />
                  Saving…
                </div>
              )}
            </div>

            {/* Matrix */}
            {accessRoles.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-[13px] text-muted-foreground">No access roles defined</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-card">
                    <tr className="border-b border-border">
                      <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Access role
                      </th>
                      <th className="w-20 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Enabled
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Functionalities
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessRoles.map((ar) => {
                      const resolvedAccessRoleId = ar.id
                      const assigned = getAssigned(resolvedAccessRoleId)
                      const isAssigned = !!assigned
                      return (
                        <tr
                          key={resolvedAccessRoleId}
                          className="border-b border-border/40 transition-colors hover:bg-muted/30"
                        >
                          <td className="py-3 pl-8 pr-4">
                            <span className="text-[13px] font-medium">{catalogAccessRoleLabel(ar)}</span>
                          </td>
                          {/* Row-level toggle */}
                          <td className="w-20 px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={isAssigned}
                                disabled={isMutating}
                                onChange={() => {
                                  if (isAssigned) {
                                    setConfirmDisable({
                                      accessRoleId: resolvedAccessRoleId,
                                      label: catalogAccessRoleLabel(ar),
                                    })
                                    return
                                  }

                                  handleToggleAccessRole(resolvedAccessRoleId)
                                }}
                                title={isAssigned ? "Remove access" : "Grant access"}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {ar.functionalities.length === 0 ? (
                              <span className="text-[12px] text-muted-foreground">No functionalities</span>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {ar.functionalities.map((f) => (
                                  <label key={f.id} className="inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1">
                                    <Checkbox
                                      checked={isFuncEnabled(resolvedAccessRoleId, f.id)}
                                      disabled={isMutating}
                                      onChange={() => {
                                        const functionalityId = resolveFunctionalityId(f)
                                        if (functionalityId === null) return
                                        handleToggleFunctionality(resolvedAccessRoleId, functionalityId)
                                      }}
                                    />
                                    <span className="text-[12px]">{functionalityLabel(f)}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {confirmDisable !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDisable(null)} />
                <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                      <HugeiconsIcon icon={Alert01Icon} size={18} strokeWidth={1.8} className="text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-[14px] font-semibold">Disable access role?</h2>
                      <p className="text-[12px] text-muted-foreground">{confirmDisable.label}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                    This will remove this access role from the selected user role.
                  </p>
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => setConfirmDisable(null)}
                      className="flex h-9 flex-1 items-center justify-center rounded-lg border border-border text-[13px] font-medium transition-colors hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <Button
                      variant="destructive"
                      className="h-9 flex-1 text-[13px]"
                      disabled={removeAccessRole.isPending}
                      onClick={() => {
                        handleToggleAccessRole(confirmDisable.accessRoleId)
                        setConfirmDisable(null)
                      }}
                    >
                      {removeAccessRole.isPending ? "Disabling…" : "Disable"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <HugeiconsIcon icon={UserShield01Icon} size={32} strokeWidth={1.5} className="mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-[13px] text-muted-foreground">
                {roles.length === 0 ? "No roles yet. Create one to get started." : "Select a role to view permissions"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
