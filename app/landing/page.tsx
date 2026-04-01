"use client"

import Link from "next/link"
import { Logo } from "@/components/custom/logo"
import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { jobPostings } from "@/lib/mock-data"

const stats = [
  { value: "480+", label: "Team members" },
  { value: "34", label: "Countries" },
  { value: "4.8★", label: "Glassdoor" },
  { value: "$220M", label: "Series C" },
]

const statusVariant: Record<string, "green" | "amber" | "blue" | "gray"> = {
  new: "green",
  urgent: "amber",
  open: "blue",
  closed: "gray",
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex h-15 items-center border-b border-border bg-background/80 backdrop-blur-sm px-12 gap-4">
        <div className="flex-1">
          <Logo />
        </div>
        <div className="flex gap-6 text-[13px] text-muted-foreground">
          {["About", "Careers", "Culture"].map((l) => (
            <span
              key={l}
              className="cursor-pointer transition-colors hover:text-foreground"
            >
              {l}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth">Apply now</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center px-6 py-16 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Now hiring · {jobPostings.length} open roles
          </div>

          <h1 className="mx-auto mb-4 max-w-xl text-[40px] font-bold leading-tight tracking-tight text-foreground">
            Build what matters.{" "}
            <span className="text-primary">Work with the best.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-md text-[16px] leading-relaxed text-muted-foreground">
            Join a team redefining how companies manage people. Remote-first,
            globally distributed.
          </p>

          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/auth">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Browse open roles
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth">Employee login</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-4 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="py-5 text-center">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs */}
        <div className="mt-12 w-full max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[20px] font-semibold text-foreground">
              Open positions
            </h2>
            <span className="text-sm text-muted-foreground">
              {jobPostings.length} roles
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {jobPostings.map((job) => (
              <Link
                key={job.id}
                href="/auth"
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md"
              >
                <div>
                  <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </p>
                  <div className="mt-1 flex gap-4 text-[12px] text-muted-foreground">
                    <span>{job.department}</span>
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                  {job.tags.length > 0 && (
                    <div className="mt-2 flex gap-1.5">
                      {job.tags.map((t) => (
                        <StatusBadge key={t} variant="blue" dot={false}>
                          {t}
                        </StatusBadge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge variant={statusVariant[job.status]}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </StatusBadge>
                  <StatusBadge variant="gray" dot={false}>
                    {job.salary}
                  </StatusBadge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-border bg-card px-12 py-5">
        <span className="text-[12px] text-muted-foreground">
          © 2025 WorkOS Inc.
        </span>
        <Button variant="ghost" size="xs" asChild>
          <Link href="/">← Back to prototype</Link>
        </Button>
      </footer>
    </div>
  )
}
