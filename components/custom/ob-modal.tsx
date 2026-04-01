"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ObModalProps {
  open: boolean
  onClose: () => void
}

export function ObModal({ open, onClose }: ObModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Official business request</DialogTitle>
          <DialogDescription>
            Request time away from office for work-related activities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ob-purpose">Purpose / activity</Label>
            <Input id="ob-purpose" placeholder="e.g. Client meeting, training, conference…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ob-date">Date</Label>
              <Input id="ob-date" type="date" defaultValue="2025-06-12" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-duration">Duration</Label>
              <Select defaultValue="Full day">
                <SelectTrigger id="ob-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Full day", "Half day AM", "Half day PM", "Custom hours"].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ob-location">Location / venue</Label>
            <Input id="ob-location" placeholder="e.g. Makati office, BGC, Remote" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ob-notes">Supporting details (optional)</Label>
            <Textarea id="ob-notes" placeholder="Add any relevant context…" rows={2} className="resize-none" />
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-[12px] text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            Official business days do not count against your leave balance
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={onClose}>Submit request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
