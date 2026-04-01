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

interface DtrChangeModalProps {
  open: boolean
  onClose: () => void
}

export function DtrChangeModal({ open, onClose }: DtrChangeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request time in/out change</DialogTitle>
          <DialogDescription>
            Submit a correction to your daily time record for HR approval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="dtr-date">Date to correct</Label>
            <Input id="dtr-date" type="date" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dtr-type">Correction type</Label>
              <Select defaultValue="Missed clock-out">
                <SelectTrigger id="dtr-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Missed clock-out", "Missed clock-in", "Wrong time logged", "System error"].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dtr-entry">Affected entry</Label>
              <Select defaultValue="Time in">
                <SelectTrigger id="dtr-entry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Time in", "Time out", "Both"].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dtr-in">Correct time in</Label>
              <Input id="dtr-in" type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dtr-out">Correct time out</Label>
              <Input id="dtr-out" type="time" defaultValue="18:00" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dtr-reason">Reason / explanation</Label>
            <Textarea id="dtr-reason" placeholder="Briefly explain why the correction is needed…" rows={2} className="resize-none" />
          </div>

          <div className="rounded-lg border border-warning-border bg-warning-light px-3 py-2.5 text-[12px] text-warning">
            DTR corrections require HR approval and may affect your attendance record and salary computation.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={onClose}>Submit correction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
