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

interface OvertimeModalProps {
  open: boolean
  onClose: () => void
}

export function OvertimeModal({ open, onClose }: OvertimeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Overtime request</DialogTitle>
          <DialogDescription>
            File pre-approved overtime hours for compensation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ot-date">Date of overtime</Label>
            <Input id="ot-date" type="date" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ot-start">Start time</Label>
              <Input id="ot-start" type="time" defaultValue="18:00" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ot-end">End time</Label>
              <Input id="ot-end" type="time" defaultValue="20:00" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ot-type">Overtime type</Label>
            <Select defaultValue="Regular OT">
              <SelectTrigger id="ot-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Regular OT", "Rest day OT", "Holiday OT", "Night differential"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ot-reason">Reason / task performed</Label>
            <Textarea
              id="ot-reason"
              placeholder="Briefly describe the work done during overtime…"
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ot-approver">Approved by (supervisor)</Label>
            <Input id="ot-approver" placeholder="e.g. Maria Santos" />
          </div>

          <div className="rounded-lg border border-danger-border bg-danger-light px-3 py-2.5 text-[12px] text-danger">
            Overtime must be pre-approved by your supervisor before filing. Unapproved OT may be subject to review.
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
