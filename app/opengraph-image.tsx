import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "WorkOS — Modern HR & Workforce Management"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0F172A 0%, #172554 55%, #1e3a8a 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid dots */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)",
          top: -100,
          right: -100,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
          bottom: -80,
          left: 80,
        }}
      />

      {/* Logo + wordmark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 36,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 20,
            background: "#2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow:
              "0 0 60px rgba(37,99,235,0.6), 0 0 20px rgba(37,99,235,0.4)",
          }}
        >
          <svg width="50" height="50" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" />
            <rect
              x="9"
              y="2"
              width="5"
              height="5"
              rx="1.5"
              fill="white"
              opacity="0.7"
            />
            <rect
              x="2"
              y="9"
              width="5"
              height="5"
              rx="1.5"
              fill="white"
              opacity="0.7"
            />
            <rect
              x="9"
              y="9"
              width="5"
              height="5"
              rx="1.5"
              fill="white"
              opacity="0.4"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              bottom: -6,
              right: -6,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#22D3EE",
              opacity: 0.85,
            }}
          />
        </div>

        {/* Brand name */}
        <span
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-3px",
            lineHeight: 1,
          }}
        >
          WorkOS
        </span>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: 30,
          color: "rgba(255,255,255,0.65)",
          margin: 0,
          letterSpacing: "-0.5px",
          textAlign: "center",
        }}
      >
        Modern HR &amp; Workforce Management Platform
      </p>

      {/* Feature pills */}
      <div style={{ display: "flex", gap: 14, marginTop: 52 }}>
        {["Attendance", "Payroll", "Leave Management", "Analytics"].map(
          (label) => (
            <div
              key={label}
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 20,
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(4px)",
              }}
            >
              {label}
            </div>
          )
        )}
      </div>
    </div>,
    { ...size }
  )
}
