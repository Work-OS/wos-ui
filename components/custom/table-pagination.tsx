"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function usePagination<T>(items: T[], defaultPageSize = 5) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paginated = items.slice(start, start + pageSize)

  const handleSetPageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  return {
    page: safePage,
    setPage,
    pageSize,
    setPageSize: handleSetPageSize,
    paginated,
    total,
    totalPages,
  }
}

interface TablePaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  setPage: (p: number) => void
  setPageSize: (s: number) => void
  pageSizeOptions?: number[]
}

export function TablePagination({
  page,
  totalPages,
  total,
  pageSize,
  setPage,
  setPageSize,
  pageSizeOptions = [5, 10, 25],
}: TablePaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between border-t border-border pt-3 text-[12px] text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="rounded border border-input bg-transparent px-1.5 py-0.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <span>
          {total === 0 ? "0" : `${start}–${end}`} of {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="flex size-6 items-center justify-center rounded border border-border transition-colors hover:bg-muted disabled:opacity-40"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={12} strokeWidth={2} />
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="flex size-6 items-center justify-center rounded border border-border transition-colors hover:bg-muted disabled:opacity-40"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
