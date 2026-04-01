import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: React.ReactNode
  delta?: string
  deltaUp?: boolean
  meta?: string
  icon?: React.ReactNode
  accent?: "blue" | "green" | "amber" | "red" | "purple" | "gray"
  className?: string
}

const accentBar: Record<string, string> = {
  blue: "bg-primary",
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
}

export function StatCard({
  title,
  value,
  delta,
  deltaUp,
  meta,
  icon,
  accent,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      {accent && (
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-0.5 rounded-l-xl",
            accentBar[accent],
          )}
        />
      )}
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        {icon && (
          <span className="text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      {delta && (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs",
            deltaUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
          )}
        >
          <span>{deltaUp ? "↑" : "↓"}</span>
          {delta}
        </p>
      )}
      {meta && !delta && (
        <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
      )}
    </div>
  )
}
