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
  green:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900",
  red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900",
  amber:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
  blue: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30",
  purple:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900",
  gray: "bg-muted text-muted-foreground border-border",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-900",
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
        className,
      )}
    >
      {dot && (
        <span className="size-1.5 rounded-full bg-current shrink-0" />
      )}
      {children}
    </span>
  )
}
