"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function SecuritySection() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h3 className="text-[15px] font-semibold">Security</h3>
        <p className="text-[13px] text-muted-foreground">Manage your password and account security</p>
      </div>
      <Separator />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Current password</Label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <div className="space-y-1.5">
          <Label>New password</Label>
          <Input type="password" placeholder="Min. 8 characters" />
        </div>
        <div className="space-y-1.5">
          <Label>Confirm new password</Label>
          <Input type="password" placeholder="Repeat new password" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm">Update password</Button>
      </div>

      <Separator />

      <div>
        <h4 className="mb-1 text-[13px] font-semibold">Two-factor authentication</h4>
        <p className="text-[12px] text-muted-foreground">Add an extra layer of security to your account</p>
        <Button variant="outline" size="sm" className="mt-3">Enable 2FA</Button>
      </div>

      <Separator />

      <div>
        <h4 className="mb-1 text-[13px] font-semibold text-destructive">Danger zone</h4>
        <p className="text-[12px] text-muted-foreground">Permanently delete your account and all associated data</p>
        <Button variant="destructive" size="sm" className="mt-3">Delete account</Button>
      </div>
    </div>
  )
}
