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

interface CoeModalProps {
  open: boolean
  onClose: () => void
}

export function CoeModal({ open, onClose }: CoeModalProps) {
  const [purpose, setPurpose] = useState("Loan application")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request certificate of employment</DialogTitle>
          <DialogDescription>
            HR will prepare and release your COE within 3–5 business days
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="coe-purpose">Purpose</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger id="coe-purpose">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Loan application", "Visa application", "New employment", "Bank requirement", "Government requirement", "Other"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {purpose === "Other" && (
            <div className="space-y-1.5">
              <Label htmlFor="coe-other">Please specify</Label>
              <Input id="coe-other" placeholder="Describe the purpose…" />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="coe-addressee">Addressed to</Label>
            <Input id="coe-addressee" placeholder="e.g. To whom it may concern, BDO Bank…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="coe-comp">With compensation?</Label>
              <Select defaultValue="no">
                <SelectTrigger id="coe-comp">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No — employment only</SelectItem>
                  <SelectItem value="yes">Yes — include salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coe-date">Date needed by</Label>
              <Input id="coe-date" type="date" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="coe-notes">Additional notes (optional)</Label>
            <Textarea id="coe-notes" placeholder="Special instructions…" rows={2} className="resize-none" />
          </div>

          <div className="rounded-lg border border-violet-border bg-violet-light px-3 py-2.5 text-[12px] text-violet">
            COE requests are typically processed within 3–5 business days. You will be notified once ready.
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
