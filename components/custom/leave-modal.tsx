"use client"

import { useState } from "react"
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

interface LeaveModalProps {
  open: boolean
  onClose: () => void
}

export function LeaveModal({ open, onClose }: LeaveModalProps) {
  const [type, setType] = useState("Vacation leave")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>File a leave request</DialogTitle>
          <DialogDescription>
            Your request will be sent to HR for review
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="leave-type">Leave type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="leave-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vacation leave">Vacation leave</SelectItem>
                <SelectItem value="Sick leave">Sick leave</SelectItem>
                <SelectItem value="Emergency leave">Emergency leave</SelectItem>
                <SelectItem value="Special leave">Special leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="leave-from">From</Label>
              <Input id="leave-from" type="date" defaultValue="2025-06-14" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leave-to">To</Label>
              <Input id="leave-to" type="date" defaultValue="2025-06-16" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="leave-reason">Reason (optional)</Label>
            <Textarea
              id="leave-reason"
              placeholder="Brief description…"
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-[12px] text-primary">
            3 days requested · 8 vacation days remaining after this leave
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={onClose}>
            Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
