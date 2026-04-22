"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const INACTIVE_MS = 15 * 60 * 1000 // 15 minutes → show warning
const GRACE_MS = 2 * 60 * 1000 // 2 minutes grace → auto-logout
const TICK_MS = 1_000

type Phase = "active" | "warning" | "expired"

export function useInactivity() {
  const [phase, setPhase] = useState<Phase>("active")
  const [countdown, setCountdown] = useState(GRACE_MS / 1000) // seconds left in grace

  const inactiveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const graceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tickInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearAll = useCallback(() => {
    if (inactiveTimer.current) clearTimeout(inactiveTimer.current)
    if (graceTimer.current) clearTimeout(graceTimer.current)
    if (tickInterval.current) clearInterval(tickInterval.current)
  }, [])

  const startInactiveTimer = useCallback(() => {
    clearAll()
    setPhase("active")

    inactiveTimer.current = setTimeout(() => {
      // Show warning
      setPhase("warning")
      setCountdown(GRACE_MS / 1000)

      // Tick countdown
      tickInterval.current = setInterval(() => {
        setCountdown((c) => Math.max(0, c - 1))
      }, TICK_MS)

      // Auto-expire after grace period
      graceTimer.current = setTimeout(() => {
        if (tickInterval.current) clearInterval(tickInterval.current)
        setPhase("expired")
      }, GRACE_MS)
    }, INACTIVE_MS)
  }, [clearAll])

  // Reset timer on any user activity
  const handleActivity = useCallback(() => {
    // Only reset if still in active phase (warning stays until user dismisses)
    setPhase((prev) => {
      if (prev === "active") startInactiveTimer()
      return prev
    })
  }, [startInactiveTimer])

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ]
    events.forEach((e) =>
      window.addEventListener(e, handleActivity, { passive: true })
    )
    startInactiveTimer()

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity))
      clearAll()
    }
  }, [handleActivity, startInactiveTimer, clearAll])

  const reset = useCallback(() => {
    startInactiveTimer()
  }, [startInactiveTimer])

  const dismiss = useCallback(() => {
    clearAll()
    setPhase("active")
    startInactiveTimer()
  }, [clearAll, startInactiveTimer])

  return { phase, countdown, reset, dismiss }
}
