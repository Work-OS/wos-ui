import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: {
    default: "WorkOS",
    template: "%s — WorkOS",
  },
  description:
    "WorkOS is a modern HR and workforce management platform — track attendance, manage payroll, approve leave, and gain workforce insights in one place.",
  keywords: [
    "HR",
    "workforce management",
    "attendance tracking",
    "payroll",
    "leave management",
    "employee portal",
  ],
  authors: [{ name: "WorkOS" }],
  creator: "WorkOS",
  metadataBase: new URL("https://workos.app"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "WorkOS",
    title: "WorkOS — Modern HR & Workforce Management",
    description:
      "Track attendance, manage payroll, approve leave, and gain workforce insights in one unified platform.",
    url: "https://workos.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkOS — Modern HR & Workforce Management",
    description:
      "Track attendance, manage payroll, approve leave, and gain workforce insights in one unified platform.",
    creator: "@workos",
  },
}

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
