"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { employeeApi } from "@/lib/employee-api"

export function useAttendance(params: { page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: ["employee", "attendance", params],
    queryFn: () => employeeApi.attendance(params),
  })
}

export function useClockIn() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => employeeApi.clockIn(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["employee", "attendance"] }),
  })
}

export function useClockOut() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => employeeApi.clockOut(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["employee", "attendance"] }),
  })
}

export function usePayslips(params: { page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: ["employee", "payslips", params],
    queryFn: () => employeeApi.payslips(params),
  })
}

export function useEmployeeStats() {
  return useQuery({
    queryKey: ["employee", "stats"],
    queryFn: employeeApi.stats,
  })
}

export function useEmployeeProfile() {
  return useQuery({
    queryKey: ["employee", "profile"],
    queryFn: employeeApi.profile,
  })
}

export function useLeaveBalances() {
  return useQuery({
    queryKey: ["employee", "leave-balances"],
    queryFn: employeeApi.leaveBalances,
  })
}
