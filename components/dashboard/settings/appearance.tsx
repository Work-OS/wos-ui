"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function AppearanceSection() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const themes = [
    { value: "light", label: "Light", desc: "Clean and bright" },
    { value: "dark", label: "Dark", desc: "Easy on the eyes" },
    { value: "system", label: "System", desc: "Matches OS preference" },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h3 className="text-[15px] font-semibold">Appearance</h3>
        <p className="text-[13px] text-muted-foreground">Customize how WorkOS looks on your device</p>
      </div>
      <Separator />

      <div>
        <p className="mb-3 text-[13px] font-medium">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all duration-150",
                mounted && resolvedTheme === t.value
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/30 hover:bg-muted/50",
              )}
            >
              <div className={cn(
                "mb-2 h-12 rounded-lg border",
                t.value === "dark" ? "border-zinc-700 bg-zinc-900" :
                t.value === "light" ? "border-zinc-200 bg-white" :
                "border-zinc-300 bg-gradient-to-br from-white to-zinc-900"
              )} />
              <p className="text-[13px] font-medium">{t.label}</p>
              <p className="text-[11px] text-muted-foreground">{t.desc}</p>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Tip: press <kbd className="rounded border border-border bg-muted px-1 text-[10px]">D</kbd> anywhere to toggle dark mode
        </p>
      </div>
    </div>
  )
}
