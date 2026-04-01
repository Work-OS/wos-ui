"use client"

import { StatCard } from "@/components/custom/stat-card"
import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { jobPostings } from "@/lib/mock-data"

const statusVariant: Record<string, "green" | "amber" | "blue" | "gray"> = {
  new: "green",
  urgent: "amber",
  open: "blue",
  closed: "gray",
}

export function RecruitmentSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Open positions" value="4" accent="blue" />
        <StatCard title="Total applicants" value="74" delta="12 this week" deltaUp={true} accent="green" />
        <StatCard title="Interviews" value="8" meta="Scheduled this week" accent="amber" />
        <StatCard title="Offers sent" value="2" meta="1 accepted" accent="purple" />
      </div>

      <h3 className="font-semibold">Open positions</h3>
      <div className="space-y-2">
        {jobPostings.map((job) => (
          <div key={job.id} className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:border-primary/20 hover:shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold">{job.title}</p>
                <StatusBadge variant={statusVariant[job.status]}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </StatusBadge>
              </div>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {job.department} · {job.location} · {job.type}
              </p>
              {job.tags.length > 0 && (
                <div className="mt-1.5 flex gap-1.5">
                  {job.tags.map((t) => <StatusBadge key={t} variant="blue" dot={false}>{t}</StatusBadge>)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[13px] font-semibold">{job.applications}</p>
                <p className="text-[11px] text-muted-foreground">applicants</p>
              </div>
              <StatusBadge variant="gray" dot={false}>{job.salary}</StatusBadge>
              <Button size="sm" variant="outline">View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
