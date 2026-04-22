import { cn } from "@/lib/utils"

type BadgeVariant =
  | "green"
  | "red"
  | "amber"
  | "blue"
  | "purple"
  | "gray"
  | "cyan"

interface StatusBadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green: "bg-gbg text-green border-gt",
  red: "bg-rbg text-red border-rt",
  amber: "bg-abg text-amber border-at",
  blue: "bg-blue-light text-blue-foreground border-blue-border",
  purple: "bg-pbg text-purple border-pt",
  gray: "bg-muted text-muted-foreground border-border",
  cyan: "bg-cyan-light text-cyan-foreground border-cyan-border",
}

export function StatusBadge({
  variant = "gray",
  children,
  dot = true,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        variantClasses[variant],
        className
      )}
    >
      {dot && <span className="size-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  )
}
