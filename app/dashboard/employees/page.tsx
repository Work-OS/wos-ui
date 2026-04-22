"use client"

import { useAuthStore } from "@/store/auth-store"
import { EmployeesSection } from "@/components/dashboard/hr/employees"
import { UsersSection } from "@/components/dashboard/admin/users"

export default function EmployeesPage() {
  const authorities = useAuthStore((s) => s.authorities)
  const canManageUsers = authorities.includes("USER_MANAGEMENT:VIEW_USERS")

  return (
    <div className="p-6 animate-in fade-in duration-300">
      {canManageUsers ? <UsersSection /> : <EmployeesSection />}
    </div>
  )
}
