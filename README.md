# WorkOS — HR & Workforce Management Platform

A modern, role-based HR and workforce management dashboard built with Next.js 16 and Tailwind CSS v4. WorkOS provides a unified platform for employees, HR managers, and administrators to manage attendance, payroll, leave, recruitment, and system configuration.

---

## Features

### Employee Portal
- **My Dashboard** — Overview of attendance status, leave balance, and recent activity
- **Daily Time Record (DTR)** — Real-time clock in/out with break controls (morning, lunch, afternoon, dinner), fullscreen mode, and progress tracking
- **Payroll** — View payslips, salary breakdown, YTD summary, and download PDF payslips
- **My Requests** — File and track leave requests, official business, certificate of employment (COE), DTR corrections, and overtime requests

### HR Manager Portal
- **Overview** — HR-level analytics and workforce summary
- **Employees** — Searchable employee directory with status tracking and profile management
- **Attendance** — Team-wide attendance monitoring
- **Payroll** — Payroll processing and disbursement management
- **Leave Management** — Review, approve, and decline leave requests with status tracking
- **Recruitment** — Pipeline management for open positions

### Admin Portal
- **Overview** — System-wide health and usage metrics
- **System Users** — User account management with role assignment (employee, HR, admin)
- **Audit Log** — Immutable activity log with export capability
- **Configuration** — System-level settings and platform configuration

### Settings
- **Profile** — Personal information and avatar with photo crop
- **Security** — Password management and connected login methods (Google, LinkedIn, GitHub, Microsoft)
- **Notifications** — Notification preferences per channel
- **Appearance** — Theme toggle (light/dark mode)

### Platform-wide
- **Role-based access** — Switch between Employee, HR, and Admin views from the topbar
- **GitHub-style attendance heatmap** — Full-year attendance visualization with year selector and motivational quotes
- **Pagination** — All data tables support configurable page sizes (5 / 10 / 25 rows)
- **Light/dark theme** — OKLCH-based color system, toggleable with `D` hotkey
- **OpenGraph metadata** — Rich link preview cards for sharing
- **Per-page SEO titles** — `Page Name — WorkOS` title template on every route

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React Server Components) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (PostCSS plugin, no config file) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) via Radix UI primitives |
| Icons | [HugeIcons](https://hugeicons.com/) (`@hugeicons/react`) |
| Animations | [Motion](https://motion.dev/) (formerly Framer Motion) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) with OKLCH color tokens |
| Fonts | Geist Sans + Geist Mono (Google Fonts) |
| Image Cropping | [react-easy-crop](https://github.com/ricardo-ch/react-easy-crop) |
| Linting | ESLint 9 with Next.js config |
| Formatting | Prettier + `prettier-plugin-tailwindcss` |
| Package Manager | pnpm |
| Bundler | Turbopack (dev), Next.js compiler (prod) |

---

## Project Structure

```
wos-ui/
├── app/
│   ├── layout.tsx               # Root layout with metadata, fonts, ThemeProvider
│   ├── opengraph-image.tsx      # Dynamic OG image (1200×630)
│   ├── dashboard/
│   │   ├── employee/            # Employee portal pages
│   │   ├── hr/                  # HR portal pages
│   │   ├── admin/               # Admin portal pages
│   │   └── settings/            # Settings pages
│   ├── auth/                    # Sign-in page
├── components/
│   ├── ui/                      # shadcn/ui generated components
│   └── custom/                  # App-specific components
│       ├── sidebar.tsx          # Role-aware navigation sidebar
│       ├── topbar.tsx           # Topbar with theme toggle and user menu
│       ├── clock-widget.tsx     # Live clock with break timer
│       ├── attendance-heatmap.tsx  # GitHub-style yearly heatmap
│       ├── table-pagination.tsx # Reusable pagination hook + UI
│       └── settings-tabs.tsx    # Settings tab navigation
├── lib/
│   ├── utils.ts                 # cn() utility (clsx + tailwind-merge)
│   ├── types.ts                 # Shared TypeScript types
│   ├── nav-config.ts            # Navigation structure per role
│   └── mock-data.ts             # Mock data for all sections
├── hooks/                       # Custom React hooks
└── public/
    └── favicon.svg              # SVG favicon matching brand logo
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
git clone <repo-url>
cd wos-ui
pnpm install
```

### Development

```bash
pnpm dev        # Start dev server with Turbopack at localhost:3000
```

### Other Commands

```bash
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm format     # Auto-format all .ts/.tsx files with Prettier
pnpm typecheck  # Type-check without emitting files
```

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

---

## Color System

Styles live in `app/globals.css` using CSS custom properties with **OKLCH** colors for perceptually uniform light/dark theming. The `.dark` class on `<html>` activates dark mode.

Key tokens:

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `#2563EB` (blue) | `#2563EB` | CTAs, active nav, brand |
| `--background` | `#F1F5F9` | `#0F172A` | Page background |
| `--card` | `#FFFFFF` | `#1E293B` | Card surfaces |
| `--foreground` | `#0F172A` | `#F8FAFC` | Primary text |

Press `D` anywhere to toggle between light and dark mode.

---

## Roles

WorkOS is a multi-role application. Switch roles from the user menu in the topbar.

| Role | Description |
|---|---|
| **Employee** | Personal dashboard — DTR, payroll, and request management |
| **HR Manager** | Team-level management — employees, attendance, leave, payroll, recruitment |
| **Admin** | System-level access — users, audit log, and configuration |

---

## License

Private — all rights reserved.
