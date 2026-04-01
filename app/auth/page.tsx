"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/custom/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type View = "login" | "signup" | "forgot"
type Role = "employee" | "hr" | "admin"

export default function AuthPage() {
  const router = useRouter()
  const [view, setView] = useState<View>("login")
  const [role, setRole] = useState<Role>("employee")

  const handleLogin = () => {
    router.push(`/dashboard/${role}`)
  }

  const handleSignup = () => {
    router.push("/dashboard/employee")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="mb-5 flex justify-center">
          <Logo />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          {view === "login" && (
            <LoginView
              role={role}
              setRole={setRole}
              onLogin={handleLogin}
              onSignup={() => setView("signup")}
              onForgot={() => setView("forgot")}
            />
          )}
          {view === "signup" && (
            <SignupView onSubmit={handleSignup} onBack={() => setView("login")} />
          )}
          {view === "forgot" && (
            <ForgotView onBack={() => setView("login")} />
          )}
        </div>

        <p className="mt-4 text-center text-[12px] text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            ← Return to prototype
          </Link>
        </p>
      </div>
    </div>
  )
}

function LoginView({
  role,
  setRole,
  onLogin,
  onSignup,
  onForgot,
}: {
  role: Role
  setRole: (r: Role) => void
  onLogin: () => void
  onSignup: () => void
  onForgot: () => void
}) {
  return (
    <>
      <h2 className="text-[18px] font-semibold">Welcome back</h2>
      <p className="mb-5 mt-1 text-[13px] text-muted-foreground">
        Sign in to your workspace
      </p>

      {/* Role tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-muted p-1">
        {(["employee", "hr", "admin"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-[12px] font-medium transition-all duration-150",
              role === r
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {r === "employee" ? "Employee" : r === "hr" ? "HR" : "Admin"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              onClick={onForgot}
              className="text-[11px] text-primary hover:underline"
            >
              Forgot?
            </button>
          </div>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
      </div>

      <Button className="mt-5 w-full justify-center" onClick={onLogin}>
        Sign in
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Button>
      <p className="mt-3 text-center text-[12px] text-muted-foreground">
        No account?{" "}
        <button
          onClick={onSignup}
          className="text-primary hover:underline"
        >
          Sign up
        </button>
      </p>
    </>
  )
}

function SignupView({
  onSubmit,
  onBack,
}: {
  onSubmit: () => void
  onBack: () => void
}) {
  return (
    <>
      <h2 className="text-[18px] font-semibold">Create account</h2>
      <p className="mb-5 mt-1 text-[13px] text-muted-foreground">
        Start your application
      </p>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="first">First name</Label>
            <Input id="first" placeholder="Jane" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" placeholder="Smith" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" placeholder="jane@email.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <Input id="signup-password" type="password" placeholder="Min. 8 characters" />
        </div>
      </div>

      <Button className="mt-5 w-full justify-center" onClick={onSubmit}>
        Create account
      </Button>
      <p className="mt-3 text-center text-[12px] text-muted-foreground">
        <button onClick={onBack} className="text-primary hover:underline">
          ← Back to login
        </button>
      </p>
    </>
  )
}

function ForgotView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <h2 className="text-[18px] font-semibold">Reset password</h2>
      <p className="mb-5 mt-1 text-[13px] text-muted-foreground">
        We'll send a reset link to your email
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="reset-email">Work email</Label>
        <Input id="reset-email" type="email" placeholder="you@company.com" />
      </div>

      <Button className="mt-4 w-full justify-center">Send reset link</Button>
      <p className="mt-3 text-center text-[12px] text-muted-foreground">
        <button onClick={onBack} className="text-primary hover:underline">
          ← Back to login
        </button>
      </p>
    </>
  )
}
