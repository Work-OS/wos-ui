import type { Metadata } from "next"
import { UsersSection } from "@/components/dashboard/admin/users"

export const metadata: Metadata = { title: "Users" }

export default function AdminUsersPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <UsersSection />
    </div>
  )
}
