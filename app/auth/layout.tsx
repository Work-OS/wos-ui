import type { Metadata } from "next"

export const metadata: Metadata = { title: "WorkOS — Authentication" }

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
