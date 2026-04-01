"use client"

import { ClockWidget } from "@/components/custom/clock-widget"
import { StatCard } from "@/components/custom/stat-card"
import { CURRENT_USER } from "@/lib/mock-data"

export function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          Good morning, {CURRENT_USER.name.split(" ")[0]} 👋
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Days worked" value="22" meta="This month" accent="blue" />
        <StatCard title="OT hours" value="12.5" delta="3.5 hrs vs last month" deltaUp={true} accent="green" />
        <StatCard title="Leave remaining" value="8 VL" meta="11 SL · 3 EL" accent="amber" />
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <ClockWidget />
        </div>
        <div className="col-span-3 space-y-4">
          <div className="rounded-xl border border-border p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Today's schedule
            </p>
            <div className="space-y-3">
              {[
                { time: "9:00 AM", label: "Daily standup", tag: "Engineering", color: "bg-primary" },
                { time: "11:00 AM", label: "Design review — Q2 components", tag: "Design", color: "bg-purple-500" },
                { time: "2:00 PM", label: "1:1 with Maria Santos", tag: "Meeting", color: "bg-green-500" },
                { time: "4:30 PM", label: "Sprint retro", tag: "Engineering", color: "bg-primary" },
              ].map((e) => (
                <div key={e.time} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-[11px] tabular-nums text-muted-foreground">{e.time}</span>
                  <div className={`h-full w-0.5 self-stretch rounded-full ${e.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">{e.label}</p>
                    <p className="text-[11px] text-muted-foreground">{e.tag}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recent activity
            </p>
            <div className="space-y-3">
              {[
                { dot: "bg-green-500", text: "Clocked in", meta: "Today · 8:58 AM" },
                { dot: "bg-primary", text: "Leave request filed", meta: "Apr 1 · Vacation · 3 days" },
                { dot: "bg-amber-500", text: "March payslip released", meta: "Apr 1 · Net ₱41,951.88" },
                { dot: "bg-green-500", text: "OT approved", meta: "Mar 31 · 2.5 hrs" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 size-2 shrink-0 rounded-full ${a.dot}`} />
                  <div>
                    <p className="text-[13px] text-foreground">{a.text}</p>
                    <p className="text-[11px] text-muted-foreground">{a.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
