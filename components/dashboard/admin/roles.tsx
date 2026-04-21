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

function RoleFormInline({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial?:  { name: string; description: string }
  onSave:    (name: string, description: string) => void
  onCancel:  () => void
  isPending: boolean
}) {
  const [name, setName]   = useState(initial?.name        ?? "")
  const [desc, setDesc]   = useState(initial?.description ?? "")

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
            if (e.key === "Enter" && name.trim()) onSave(name.trim(), desc.trim())
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
      <div className="flex gap-1.5 pt-1">
        <Button
          size="sm"
          className="h-7 flex-1 text-[11px]"
          disabled={!name.trim() || isPending}
          onClick={() => onSave(name.trim(), desc.trim())}
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

  const rolesQ       = useUserRoles()
  const accessRolesQ = useAccessRoles()

  const createMutation    = useCreateUserRole()
  const updateMutation    = useUpdateUserRole()
  const deleteMutation    = useDeleteUserRole()
  const addAccessRole     = useAddAccessRole()
  const removeAccessRole  = useRemoveAccessRole()
  const toggleFunc        = useToggleFunctionality()

  const roles       = rolesQ.data       ?? []
  const accessRoles = accessRolesQ.data ?? []
  const active      = roles.find((r) => r.id === activeId) ?? roles[0] ?? null

  // Helpers to read current state from the active role
  function getAssigned(accessRoleId: number) {
    return active?.accessRoles.find((ar) => ar.accessRoleId === accessRoleId) ?? null
  }

  function isFuncEnabled(accessRoleId: number, functionalityId: number): boolean {
    const assigned = getAssigned(accessRoleId)
    if (!assigned) return false
    return assigned.functionalities.find((f) => f.functionalityId === functionalityId)?.enabled ?? false
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
      // Auto-assign access role first, then rely on the server to handle the functionality
      addAccessRole.mutate({ userRoleId: active.id, accessRoleId }, {
        onSuccess: () =>
          toggleFunc.mutate({ userRoleId: active.id, accessRoleId, functionalityId, enabled: true }),
      })
    } else {
      toggleFunc.mutate({ userRoleId: active.id, accessRoleId, functionalityId, enabled: !currentlyEnabled })
    }
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

  if (rolesQ.isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={Alert01Icon} size={24} strokeWidth={1.5} className="text-red-400" />
        <p className="text-[13px]">Failed to load roles</p>
      </div>
    )
  }

  // Collect all unique functionality names across all access roles (for column headers)
  const allFuncNames = Array.from(
    new Set(accessRoles.flatMap((ar) => ar.functionalities.map((f) => f.name)))
  )

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
                initial={{ name: r.name, description: r.description }}
                isPending={updateMutation.isPending}
                onSave={(name, description) =>
                  updateMutation.mutate(
                    { id: r.id, name, description },
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
                  <p className={cn(
                    "truncate text-[12px] font-semibold",
                    (active?.id ?? roles[0]?.id) === r.id ? "text-primary-foreground" : "text-foreground",
                  )}>
                    {r.name}
                  </p>
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
            onSave={(name, description) =>
              createMutation.mutate(
                { name, description },
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
            {accessRolesQ.isError ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-[13px] text-muted-foreground">Failed to load access roles</p>
              </div>
            ) : accessRoles.length === 0 ? (
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
                      {allFuncNames.map((name) => (
                        <th key={name} className="w-24 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {accessRoles.map((ar) => {
                      const assigned   = getAssigned(ar.id)
                      const isAssigned = !!assigned
                      return (
                        <tr
                          key={ar.id}
                          className="border-b border-border/40 transition-colors hover:bg-muted/30"
                        >
                          <td className="py-3 pl-8 pr-4">
                            <span className="text-[13px] font-medium">{ar.name}</span>
                          </td>
                          {/* Row-level toggle */}
                          <td className="w-20 px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={isAssigned}
                                disabled={isMutating}
                                onChange={() => handleToggleAccessRole(ar.id)}
                                title={isAssigned ? "Remove access" : "Grant access"}
                              />
                            </div>
                          </td>
                          {/* Functionality toggles */}
                          {allFuncNames.map((funcName) => {
                            const funcDef = ar.functionalities.find((f) => f.name === funcName)
                            if (!funcDef) {
                              return (
                                <td key={funcName} className="w-24 px-4 py-3 text-center">
                                  <span className="text-muted-foreground/30">—</span>
                                </td>
                              )
                            }
                            const enabled = isFuncEnabled(ar.id, funcDef.id)
                            return (
                              <td key={funcName} className="w-24 px-4 py-3 text-center">
                                <div className="flex justify-center">
                                  <Checkbox
                                    checked={enabled}
                                    disabled={isMutating}
                                    onChange={() => handleToggleFunctionality(ar.id, funcDef.id)}
                                  />
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
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
