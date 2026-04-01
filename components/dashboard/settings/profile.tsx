"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CURRENT_USER } from "@/lib/mock-data"

export function ProfileSection() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h3 className="text-[15px] font-semibold">Profile</h3>
        <p className="text-[13px] text-muted-foreground">Manage your personal information</p>
      </div>
      <Separator />

      <div className="flex items-center gap-5">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
          {CURRENT_USER.initials}
        </div>
        <div>
          <Button variant="outline" size="sm">Change photo</Button>
          <p className="mt-1.5 text-[11px] text-muted-foreground">JPG, PNG up to 2 MB</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>First name</Label>
          <Input defaultValue="Alex" />
        </div>
        <div className="space-y-1.5">
          <Label>Last name</Label>
          <Input defaultValue="Johnson" />
        </div>
        <div className="space-y-1.5">
          <Label>Work email</Label>
          <Input type="email" defaultValue={CURRENT_USER.email} />
        </div>
        <div className="space-y-1.5">
          <Label>Phone</Label>
          <Input type="tel" defaultValue={CURRENT_USER.phone} />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Address</Label>
          <Input defaultValue={CURRENT_USER.address} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm">Save changes</Button>
      </div>
    </div>
  )
}
