"use client"

import { useQuery } from "@tanstack/react-query"
import { adminAuditApi, adminStatsApi } from "@/lib/admin-api"

export function useAuditLogs(
  params: { page?: number; size?: number; search?: string } = {}
) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: () => adminAuditApi.list(params),
  })
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminStatsApi.get,
  })
}
