"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// ── Provider icons ─────────────────────────────────────────────────────────────

function IconEmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}
function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}
function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}
function IconMicrosoft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#00A4EF" d="M13 1h10v10H13z"/>
      <path fill="#7FBA00" d="M1 13h10v10H1z"/>
      <path fill="#FFB900" d="M13 13h10v10H13z"/>
    </svg>
  )
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface LoginMethod {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
  account?: string
}

// ── Generic method row ─────────────────────────────────────────────────────────

function MethodRow({ method, onToggle }: { method: LoginMethod; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border px-4 py-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        {method.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium">{method.name}</p>
        <p className="text-[12px] text-muted-foreground">
          {method.connected && method.account ? method.account : "Not connected"}
        </p>
      </div>
      {method.connected ? (
        <Button
          size="sm" variant="outline"
          className="h-7 shrink-0 text-[12px] text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
          onClick={onToggle}
        >
          Disconnect
        </Button>
      ) : (
        <Button size="sm" variant="outline" className="h-7 shrink-0 text-[12px]" onClick={onToggle}>
          Connect
        </Button>
      )}
    </div>
  )
}

// ── Email method row (special: change email + disconnect) ─────────────────────

function EmailMethodRow({
  email, connected, onChangeEmail, onDisconnect,
}: {
  email: string
  connected: boolean
  onChangeEmail: (email: string) => void
  onDisconnect: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [newEmail, setNewEmail] = useState("")

  const handleSave = () => {
    if (newEmail.trim()) onChangeEmail(newEmail.trim())
    setEditing(false)
    setNewEmail("")
  }

  return (
    <div className={cn("rounded-xl border border-border px-4 py-3.5", editing && "space-y-3")}>
      <div className="flex items-center gap-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <IconEmail />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium">Email &amp; password</p>
          <p className="text-[12px] text-muted-foreground">
            {connected ? email : "Not connected"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {connected && (
            <Button
              size="sm" variant="outline"
              className="h-7 text-[12px]"
              onClick={() => { setEditing((v) => !v); setNewEmail("") }}
            >
              {editing ? "Cancel" : "Change email"}
            </Button>
          )}
          {connected ? (
            <Button
              size="sm" variant="outline"
              className="h-7 text-[12px] text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
              onClick={onDisconnect}
            >
              Disconnect
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="h-7 text-[12px]">Connect</Button>
          )}
        </div>
      </div>

      {editing && (
        <div className="flex items-center gap-2 pl-13">
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New email address"
            className="h-8 text-[13px]"
            onKeyDown={(e) => { if (e.key === "Enter") handleSave() }}
            autoFocus
          />
          <Button size="sm" className="h-8 shrink-0 text-[12px]" disabled={!newEmail.trim()} onClick={handleSave}>
            Save
          </Button>
        </div>
      )}
    </div>
  )
}

// ── SecuritySection ────────────────────────────────────────────────────────────

export function SecuritySection() {
  const [emailAccount, setEmailAccount] = useState("alex.johnson@workos.io")
  const [emailConnected, setEmailConnected] = useState(true)

  const [methods, setMethods] = useState<LoginMethod[]>([
    { id: "google",    name: "Google",    icon: <IconGoogle />,    connected: true,  account: "alex.johnson@gmail.com" },
    { id: "linkedin",  name: "LinkedIn",  icon: <IconLinkedIn />,  connected: false },
    { id: "github",    name: "GitHub",    icon: <IconGitHub />,    connected: false },
    { id: "microsoft", name: "Microsoft", icon: <IconMicrosoft />, connected: false },
  ])

  const toggle = (id: string) =>
    setMethods((prev) =>
      prev.map((m) =>
        m.id !== id ? m : {
          ...m,
          connected: !m.connected,
          account: !m.connected
            ? id === "google"    ? "alex.johnson@gmail.com"
            : id === "linkedin"  ? "Alex Johnson (LinkedIn)"
            : id === "github"    ? "alexj (GitHub)"
            : id === "microsoft" ? "alex@outlook.com"
            : undefined
            : undefined,
        }
      )
    )

  return (
    <div className="mx-auto max-w-2xl space-y-8">

      <div>
        <h3 className="text-[15px] font-semibold">Security</h3>
        <p className="text-[13px] text-muted-foreground">Manage your password and connected login methods</p>
      </div>
      <Separator />

      {/* Change password */}
      <div className="space-y-4">
        <h4 className="text-[13px] font-semibold">Change password</h4>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Current password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input type="password" placeholder="Min. 8 characters" />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm new password</Label>
              <Input type="password" placeholder="Repeat new password" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button size="sm">Update password</Button>
        </div>
      </div>

      <Separator />

      {/* Login methods */}
      <div>
        <h4 className="mb-1 text-[13px] font-semibold">Login methods</h4>
        <p className="mb-4 text-[12px] text-muted-foreground">
          Connect third-party accounts to sign in without a password. At least one method must remain active.
        </p>
        <div className="space-y-2.5">
          <EmailMethodRow
            email={emailAccount}
            connected={emailConnected}
            onChangeEmail={(e) => setEmailAccount(e)}
            onDisconnect={() => setEmailConnected(false)}
          />
          {methods.map((m) => (
            <MethodRow key={m.id} method={m} onToggle={() => toggle(m.id)} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Danger zone */}
      <div>
        <h4 className="mb-1 text-[13px] font-semibold text-destructive">Danger zone</h4>
        <p className="text-[12px] text-muted-foreground">Permanently delete your account and all associated data</p>
        <Button variant="destructive" size="sm" className="mt-3">Delete account</Button>
      </div>

    </div>
  )
}
