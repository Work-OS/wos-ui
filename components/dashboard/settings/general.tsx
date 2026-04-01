"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/custom/status-badge"
import { CURRENT_USER } from "@/lib/mock-data"

const PERSONAL_FIELDS = [
  { label: "Full name",   value: CURRENT_USER.name },
  { label: "Work email",  value: CURRENT_USER.email },
  { label: "Phone",       value: CURRENT_USER.phone },
  { label: "Address",     value: CURRENT_USER.address },
]

const EMPLOYMENT_FIELDS = [
  { label: "Employee ID", value: CURRENT_USER.employeeId },
  { label: "Position",    value: CURRENT_USER.title },
  { label: "Department",  value: CURRENT_USER.department },
  { label: "Team",        value: CURRENT_USER.team },
  { label: "Reports to",  value: CURRENT_USER.manager },
  { label: "Start date",  value: CURRENT_USER.startDate },
]

const DOCUMENTS = [
  { name: "Employment contract",  date: "Mar 15, 2022", icon: "📄" },
  { name: "NDA agreement",        date: "Mar 15, 2022", icon: "📋" },
  { name: "Tax form (BIR 2316)",  date: "Jan 31, 2025", icon: "🗂️" },
  { name: "Payslip — May 2025",   date: "May 30, 2025", icon: "💰" },
]

export function GeneralSection() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhotoUrl(URL.createObjectURL(file))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">

      {/* ── Account ── */}
      <div>
        <h3 className="text-[15px] font-semibold">General</h3>
        <p className="text-[13px] text-muted-foreground">Manage your account and employment information</p>
      </div>
      <Separator />

      {/* Avatar */}
      <div className="flex items-center gap-5">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile photo"
            className="size-16 shrink-0 rounded-full object-cover ring-2 ring-border"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {CURRENT_USER.initials}
          </div>
        )}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            Upload photo
          </Button>
          {photoUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-destructive hover:text-destructive"
              onClick={() => { setPhotoUrl(null); if (fileRef.current) fileRef.current.value = "" }}
            >
              Remove
            </Button>
          )}
          <p className="mt-1.5 text-[11px] text-muted-foreground">JPG or PNG · max 2 MB · recommended 256×256</p>
        </div>
      </div>

      {/* Display name & bio */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Display name</Label>
            <Input defaultValue={CURRENT_USER.name} />
          </div>
          <div className="space-y-1.5">
            <Label>Username</Label>
            <Input defaultValue="alex.johnson" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>
            Bio{" "}
            <span className="text-[11px] font-normal text-muted-foreground">(optional)</span>
          </Label>
          <textarea
            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            rows={3}
            placeholder="A short bio visible to your team..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm">Save changes</Button>
      </div>

      <Separator />

      {/* ── Employment record ── */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[13px] font-semibold">Employment record</h4>
          <p className="text-[12px] text-muted-foreground">Managed by HR · contact your manager to request changes</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge variant="green">Active</StatusBadge>
          <Button variant="outline" size="sm" className="h-7 text-[12px]">Request edit</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Personal information
          </p>
          <div className="space-y-2.5">
            {PERSONAL_FIELDS.map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-4 text-[13px]">
                <span className="shrink-0 text-muted-foreground">{f.label}</span>
                <span className="text-right font-medium">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Employment information
          </p>
          <div className="space-y-2.5">
            {EMPLOYMENT_FIELDS.map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-4 text-[13px]">
                <span className="shrink-0 text-muted-foreground">{f.label}</span>
                <span className="text-right font-medium">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="rounded-xl border border-border p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Documents on file
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {DOCUMENTS.map((doc) => (
            <div key={doc.name} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <span className="text-base">{doc.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium">{doc.name}</p>
                <p className="text-[11px] text-muted-foreground">{doc.date}</p>
              </div>
              <button className="shrink-0 text-[12px] text-primary hover:underline">View</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
