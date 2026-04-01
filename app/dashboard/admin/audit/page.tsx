import type { Metadata } from "next"
import { AuditSection } from "@/components/dashboard/admin/audit"

export const metadata: Metadata = { title: "Audit Log" }

export default function AdminAuditPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <AuditSection />
    </div>
  )
}
