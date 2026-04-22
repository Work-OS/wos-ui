"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Camera01Icon,
  Alert01Icon,
  Sun01Icon,
  ArrowExpand01Icon,
  ArrowShrink01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons"

type CamStatus =
  | "init"
  | "denied"
  | "too-dark"
  | "no-face"
  | "deny-multi"
  | "deny-mouth"
  | "deny-partial"
  | "warn-far"
  | "warn-close"
  | "warn-align"
  | "ready"
  | "flash"

const STATUS_CONFIG: Record<
  CamStatus,
  {
    label: string
    sub: string
    color: string
    badgeClass: string
    icon: string
    canCapture: boolean
    ovalStroke: string
    isDeny: boolean
  }
> = {
  init: {
    label: "Starting camera...",
    sub: "Please wait",
    color: "text-muted-foreground",
    badgeClass: "border-white/20 bg-black/40",
    icon: "camera",
    canCapture: false,
    ovalStroke: "#60a5fa",
    isDeny: false,
  },
  denied: {
    label: "Camera access denied",
    sub: "Allow camera in browser settings",
    color: "text-red-400",
    badgeClass: "border-red-500/40 bg-red-500/20",
    icon: "alert",
    canCapture: false,
    ovalStroke: "#ef4444",
    isDeny: true,
  },
  "too-dark": {
    label: "Too dark",
    sub: "Move to a brighter area",
    color: "text-amber-400",
    badgeClass: "border-amber-500/40 bg-amber-500/20",
    icon: "sun",
    canCapture: false,
    ovalStroke: "#f59e0b",
    isDeny: false,
  },
  "no-face": {
    label: "No face detected",
    sub: "Position your face inside the oval",
    color: "text-red-400",
    badgeClass: "border-red-500/40 bg-red-500/20",
    icon: "alert",
    canCapture: false,
    ovalStroke: "#ef4444",
    isDeny: true,
  },
  "deny-multi": {
    label: "Only 1 face allowed",
    sub: "Only one face should be inside the oval",
    color: "text-red-400",
    badgeClass: "border-red-500/40 bg-red-500/20",
    icon: "alert",
    canCapture: false,
    ovalStroke: "#ef4444",
    isDeny: true,
  },
  "deny-mouth": {
    label: "Close your mouth",
    sub: "Mouth must be closed to capture",
    color: "text-red-400",
    badgeClass: "border-red-500/40 bg-red-500/20",
    icon: "alert",
    canCapture: false,
    ovalStroke: "#ef4444",
    isDeny: true,
  },
  "deny-partial": {
    label: "Show full face",
    sub: "Partial face detected - face the camera fully",
    color: "text-red-400",
    badgeClass: "border-red-500/40 bg-red-500/20",
    icon: "alert",
    canCapture: false,
    ovalStroke: "#ef4444",
    isDeny: true,
  },
  "warn-far": {
    label: "Move closer",
    sub: "You are too far - move closer to the camera",
    color: "text-amber-400",
    badgeClass: "border-amber-500/40 bg-amber-500/20",
    icon: "expand",
    canCapture: false,
    ovalStroke: "#f59e0b",
    isDeny: false,
  },
  "warn-close": {
    label: "Move back",
    sub: "Too close - move back a little",
    color: "text-amber-400",
    badgeClass: "border-amber-500/40 bg-amber-500/20",
    icon: "shrink",
    canCapture: false,
    ovalStroke: "#f59e0b",
    isDeny: false,
  },
  "warn-align": {
    label: "Align face in oval",
    sub: "Center your face completely inside the oval",
    color: "text-amber-400",
    badgeClass: "border-amber-500/40 bg-amber-500/20",
    icon: "alert",
    canCapture: false,
    ovalStroke: "#f59e0b",
    isDeny: false,
  },
  ready: {
    label: "Full face detected",
    sub: "Press capture when ready",
    color: "text-green-400",
    badgeClass: "border-green-500/40 bg-green-500/20",
    icon: "check",
    canCapture: true,
    ovalStroke: "#22c55e",
    isDeny: false,
  },
  flash: {
    label: "Captured!",
    sub: "",
    color: "text-green-400",
    badgeClass: "border-green-500/40 bg-green-500/20",
    icon: "check",
    canCapture: true,
    ovalStroke: "#22c55e",
    isDeny: false,
  },
}

function isSkin(r: number, g: number, b: number): boolean {
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b
  return cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173
}

function validateCapture(
  imageData: ImageData,
  W: number,
  H: number
): { valid: boolean; reason?: string; warnings: string[] } {
  const d = imageData.data
  const warnings: string[] = []

  const cx = W / 2
  const cy = H / 2
  const rx = W * 0.22
  const ry = H * 0.38

  type ZoneKey = "top" | "eye" | "mid" | "bot"
  const zones: Record<
    ZoneKey,
    { skin: number; dark: number; n: number; lumSum: number }
  > = {
    top: { skin: 0, dark: 0, n: 0, lumSum: 0 },
    eye: { skin: 0, dark: 0, n: 0, lumSum: 0 },
    mid: { skin: 0, dark: 0, n: 0, lumSum: 0 },
    bot: { skin: 0, dark: 0, n: 0, lumSum: 0 },
  }

  let mouthN = 0
  let mouthDark = 0
  let leftSkin = 0
  let leftN = 0
  let rightSkin = 0
  let rightN = 0

  const BUCKETS = 12
  const faceSkinCols = new Array<number>(BUCKETS).fill(0)
  const faceColTotals = new Array<number>(BUCKETS).fill(0)
  const faceZoneBottom = Math.floor(H * 0.75)

  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const dxN = (x - cx) / rx
      const dyN = (y - cy) / ry
      if (dxN * dxN + dyN * dyN > 1) continue

      const idx = (y * W + x) * 4
      const r = d[idx]
      const g = d[idx + 1]
      const b = d[idx + 2]
      const lum = r * 0.299 + g * 0.587 + b * 0.114
      const skin = isSkin(r, g, b)

      let zone: ZoneKey
      if (dyN < -0.3) zone = "top"
      else if (dyN < 0.1) zone = "eye"
      else if (dyN < 0.55) zone = "mid"
      else zone = "bot"

      zones[zone].n++
      zones[zone].lumSum += lum
      if (skin) zones[zone].skin++
      if (lum < 60) zones[zone].dark++

      if (x < cx) {
        leftN++
        if (skin) leftSkin++
      } else {
        rightN++
        if (skin) rightSkin++
      }

      if (dyN >= 0.3 && dyN < 0.8) {
        mouthN++
        if (lum < 50) mouthDark++
      }

      if (y < faceZoneBottom) {
        const col = Math.min(BUCKETS - 1, Math.floor((x / W) * BUCKETS))
        faceColTotals[col]++
        if (skin) faceSkinCols[col]++
      }
    }
  }

  const skinR = (z: ZoneKey) => (zones[z].n ? zones[z].skin / zones[z].n : 0)
  const lumAvg = (z: ZoneKey) => (zones[z].n ? zones[z].lumSum / zones[z].n : 0)

  const topSk = skinR("top")
  const eyeSk = skinR("eye")
  const midSk = skinR("mid")
  const botSk = skinR("bot")
  const eyeDk = zones.eye.n ? zones.eye.dark / zones.eye.n : 0
  const totalSkin =
    zones.top.skin + zones.eye.skin + zones.mid.skin + zones.bot.skin
  const totalN = zones.top.n + zones.eye.n + zones.mid.n + zones.bot.n

  if (!totalN || totalSkin / totalN < 0.08) {
    return {
      valid: false,
      reason:
        "No face detected. Position your face inside the oval and try again.",
      warnings: [],
    }
  }

  const colRatios = faceSkinCols.map((s, i) =>
    faceColTotals[i] ? s / faceColTotals[i] : 0
  )
  const MIN_FACE_PIX_CAP = 30
  let inFirstPeak = false
  let valleyCount = 0
  let twoFaces = false

  for (let i = 0; i < colRatios.length; i++) {
    const isPeak = colRatios[i] >= 0.18 && faceSkinCols[i] >= MIN_FACE_PIX_CAP
    const isValley = colRatios[i] <= 0.06
    if (!inFirstPeak) {
      if (isPeak) inFirstPeak = true
    } else if (valleyCount === 0) {
      if (isValley) valleyCount = 1
    } else if (isValley) {
      valleyCount++
    } else if (valleyCount >= 1 && isPeak) {
      twoFaces = true
      break
    } else {
      valleyCount = 0
    }
  }

  if (twoFaces) {
    return {
      valid: false,
      reason: "Only 1 face allowed - only one face should be inside the oval.",
      warnings: [],
    }
  }

  const leftR = leftN ? leftSkin / leftN : 0
  const rightR = rightN ? rightSkin / rightN : 0
  const stronger = Math.max(leftR, rightR)
  const weaker = Math.min(leftR, rightR)

  if (topSk >= 0.18 && eyeSk < 0.1 && midSk < 0.08) {
    return {
      valid: false,
      reason: "Show full face - only your forehead is visible.",
      warnings: [],
    }
  }
  if (botSk >= 0.2 && midSk < 0.1 && eyeSk < 0.08 && topSk < 0.08) {
    return {
      valid: false,
      reason: "Show full face - only your chin is visible.",
      warnings: [],
    }
  }
  if (topSk < 0.1 && eyeSk < 0.1 && midSk >= 0.15) {
    return {
      valid: false,
      reason: "Show full face - only the lower part of your face is visible.",
      warnings: [],
    }
  }
  if (topSk >= 0.15 && eyeSk >= 0.1 && midSk < 0.08 && botSk < 0.08) {
    return {
      valid: false,
      reason: "Show full face - only the upper part of your face is visible.",
      warnings: [],
    }
  }
  if (stronger > 0.18 && weaker < stronger * 0.28 && eyeDk < 0.04) {
    return {
      valid: false,
      reason: "Show full face - a side profile or ear was detected.",
      warnings: [],
    }
  }
  if (stronger > 0.18 && weaker < stronger * 0.285) {
    return {
      valid: false,
      reason:
        "Show full face - your face is not completely centered in the oval.",
      warnings: [],
    }
  }
  if (totalN && totalSkin / totalN < 0.18) {
    return {
      valid: false,
      reason:
        "Show full face - your full face must be visible inside the oval.",
      warnings: [],
    }
  }

  const overallCenterLum =
    (lumAvg("top") + lumAvg("eye") + lumAvg("mid") + lumAvg("bot")) / 4
  if (overallCenterLum > 190)
    warnings.push("Move back - you were too close to the camera.")

  const mouthDarkR = mouthN > 0 ? mouthDark / mouthN : 0
  if (mouthDarkR > 0.12) {
    return {
      valid: false,
      reason:
        "Close your mouth - mouth appears to be open in the captured photo.",
      warnings: [],
    }
  }

  return { valid: true, warnings }
}

export function AttendanceCameraCapture({
  punchType,
  onCapture,
  onBack,
}: {
  punchType: "in" | "out"
  onCapture: (time: string) => void
  onBack: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const statusRef = useRef<CamStatus>("init")

  const [status, setStatus] = useState<CamStatus>("init")
  const [flash, setFlash] = useState(false)
  const [review, setReview] = useState<{
    dataUrl: string
    valid: boolean
    reason?: string
    warnings: string[]
  } | null>(null)

  function pushStatus(next: CamStatus) {
    if (statusRef.current === next) return
    statusRef.current = next
    setStatus(next)
  }

  useEffect(() => {
    let cancelled = false
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        pushStatus("warn-far")
      })
      .catch(() => {
        if (!cancelled) pushStatus("denied")
      })

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) return
      if (statusRef.current === "init" || statusRef.current === "denied") return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const W = video.videoWidth || 640
      const H = video.videoHeight || 480
      canvas.width = W
      canvas.height = H
      ctx.drawImage(video, 0, 0, W, H)

      const data = ctx.getImageData(0, 0, W, H).data

      let totalLum = 0
      const pixelCount = data.length / 4
      for (let i = 0; i < data.length; i += 4) {
        totalLum += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      }
      const avgLum = totalLum / pixelCount
      if (avgLum < 55) {
        pushStatus("too-dark")
        return
      }

      const cx = W / 2
      const cy = H / 2
      const rx = W * 0.22
      const ry = H * 0.38

      let cSum = 0
      let cN = 0
      let oSum = 0
      let oN = 0
      let ovalSkin = 0
      let ovalN = 0
      let eyeN = 0
      let eyeDark = 0
      let mouthN = 0
      let mouthDark = 0
      let leftSkin = 0
      let leftN = 0
      let rightSkin = 0
      let rightN = 0

      let zTopN = 0
      let zTopSkin = 0
      let zEyeN = 0
      let zEyeSkin = 0
      let zMidN = 0
      let zMidSkin = 0
      let zBotN = 0
      let zBotSkin = 0

      const BUCKETS = 10
      const skinCols = new Array<number>(BUCKETS).fill(0)
      const totalCols = new Array<number>(BUCKETS).fill(0)
      const faceZoneBottom = Math.floor(H * 0.75)

      for (let y = 0; y < H; y += 3) {
        for (let x = 0; x < W; x += 3) {
          const dxN = (x - cx) / rx
          const dyN = (y - cy) / ry
          const idx = (y * W + x) * 4
          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]
          const lum = r * 0.299 + g * 0.587 + b * 0.114
          const skin = isSkin(r, g, b)
          const inOval = dxN * dxN + dyN * dyN <= 1

          if (inOval) {
            cSum += lum
            cN++
            ovalN++
            if (skin) ovalSkin++

            if (dyN < -0.3) {
              zTopN++
              if (skin) zTopSkin++
            } else if (dyN < 0.1) {
              zEyeN++
              if (skin) zEyeSkin++
            } else if (dyN < 0.55) {
              zMidN++
              if (skin) zMidSkin++
            } else {
              zBotN++
              if (skin) zBotSkin++
            }

            if (dyN >= -0.4 && dyN < 0.15) {
              eyeN++
              if (lum < 55) eyeDark++
            }
            if (dyN >= 0.3 && dyN < 0.8) {
              mouthN++
              if (lum < 50) mouthDark++
            }
            if (x < cx) {
              leftN++
              if (skin) leftSkin++
            } else {
              rightN++
              if (skin) rightSkin++
            }
          } else {
            oSum += lum
            oN++
          }

          if (y < faceZoneBottom) {
            const col = Math.min(BUCKETS - 1, Math.floor((x / W) * BUCKETS))
            totalCols[col]++
            if (skin) skinCols[col]++
          }
        }
      }

      const cAvg = cN > 0 ? cSum / cN : 0
      const oAvg = oN > 0 ? oSum / oN : 0
      const diff = Math.abs(cAvg - oAvg)
      const ovalSkinR = ovalN > 0 ? ovalSkin / ovalN : 0

      if (ovalSkinR < 0.08) {
        pushStatus("no-face")
        return
      }

      const eyeDarkR = eyeN > 0 ? eyeDark / eyeN : 0
      if (eyeDarkR < 0.018) {
        pushStatus("no-face")
        return
      }

      if (ovalSkinR < 0.22 && diff < 14) {
        pushStatus("warn-far")
        return
      }
      if (cAvg > 190 && diff > 50) {
        pushStatus("warn-close")
        return
      }

      const zTopSk = zTopN > 0 ? zTopSkin / zTopN : 0
      const zEyeSk = zEyeN > 0 ? zEyeSkin / zEyeN : 0
      const zMidSk = zMidN > 0 ? zMidSkin / zMidN : 0
      const zBotSk = zBotN > 0 ? zBotSkin / zBotN : 0
      const zonesFailing = [
        zTopSk < 0.02,
        zEyeSk < 0.03,
        zMidSk < 0.03,
        zBotSk < 0.02,
      ].filter(Boolean).length
      if (zonesFailing >= 2) {
        pushStatus("deny-partial")
        return
      }
      if (zTopSk < 0.05 || zEyeSk < 0.07 || zMidSk < 0.07 || zBotSk < 0.04) {
        pushStatus("warn-align")
        return
      }

      const colRatios = skinCols.map((s, i) =>
        totalCols[i] ? s / totalCols[i] : 0
      )
      const MIN_FACE_PIX = 18
      let inFirstPeak = false
      let valleyCount = 0
      let twoFaces = false
      for (let i = 0; i < colRatios.length; i++) {
        const isPeak = colRatios[i] >= 0.18 && skinCols[i] >= MIN_FACE_PIX
        const isValley = colRatios[i] <= 0.06
        if (!inFirstPeak) {
          if (isPeak) inFirstPeak = true
        } else if (valleyCount === 0) {
          if (isValley) valleyCount = 1
        } else if (isValley) {
          valleyCount++
        } else if (valleyCount >= 1 && isPeak) {
          twoFaces = true
          break
        } else {
          valleyCount = 0
        }
      }
      if (twoFaces) {
        pushStatus("deny-multi")
        return
      }

      const leftSkR = leftN ? leftSkin / leftN : 0
      const rightSkR = rightN ? rightSkin / rightN : 0
      const stronger = Math.max(leftSkR, rightSkR)
      const weaker = Math.min(leftSkR, rightSkR)
      if (stronger > 0.15 && weaker < stronger * 0.15) {
        pushStatus("deny-partial")
        return
      }
      if (stronger > 0.1 && weaker < stronger * 0.4) {
        pushStatus("warn-align")
        return
      }

      const mouthDarkR = mouthN > 0 ? mouthDark / mouthN : 0
      if (mouthDarkR > 0.12) {
        pushStatus("deny-mouth")
        return
      }

      pushStatus("ready")
    }, 200)

    return () => clearInterval(id)
  }, [])

  function handleCapture() {
    if (!STATUS_CONFIG[status].canCapture) return

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    setFlash(true)
    setTimeout(() => setFlash(false), 180)

    const snap = document.createElement("canvas")
    snap.width = video.videoWidth || 640
    snap.height = video.videoHeight || 480
    const ctx = snap.getContext("2d")
    if (!ctx) return

    ctx.translate(snap.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)

    const dataUrl = snap.toDataURL("image/jpeg", 0.92)
    const result = validateCapture(
      ctx.getImageData(0, 0, snap.width, snap.height),
      snap.width,
      snap.height
    )

    setTimeout(() => {
      setReview({
        dataUrl,
        valid: result.valid,
        reason: result.reason,
        warnings: result.warnings,
      })
    }, 280)
  }

  function handleRetry() {
    setReview(null)
  }

  function handleConfirm() {
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    onCapture(time)
  }

  const iconMap: Record<
    string,
    React.ComponentProps<typeof HugeiconsIcon>["icon"]
  > = {
    camera: Camera01Icon,
    alert: Alert01Icon,
    sun: Sun01Icon,
    expand: ArrowExpand01Icon,
    shrink: ArrowShrink01Icon,
    check: CheckmarkBadge01Icon,
  }

  const cfgRaw = STATUS_CONFIG[status]
  const cfgIcon = iconMap[cfgRaw.icon]
  const canCap = cfgRaw.canCapture
  const isReady = status === "ready"
  const isWarn = status.startsWith("warn-")
  const isDeny = cfgRaw.isDeny

  const capBtnClass = canCap
    ? punchType === "in"
      ? "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25"
      : "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25"
    : "bg-muted text-muted-foreground cursor-not-allowed"

  return (
    <div className="p-5">
      <div
        className="relative overflow-hidden rounded-2xl bg-black"
        style={{ aspectRatio: "4/3" }}
      >
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full scale-x-[-1] object-cover",
            review && "invisible"
          )}
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />

        {!review && (
          <>
            {status === "too-dark" && (
              <div className="absolute inset-0 bg-black/50" />
            )}
            {flash && <div className="absolute inset-0 bg-white/80" />}

            <div className="pointer-events-none absolute inset-0">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <mask id="oval-mask">
                    <rect width="400" height="300" fill="white" />
                    <ellipse cx="200" cy="150" rx="88" ry="114" fill="black" />
                  </mask>
                </defs>
                <rect
                  width="400"
                  height="300"
                  fill="rgba(0,0,0,0.55)"
                  mask="url(#oval-mask)"
                />
                <ellipse
                  cx="200"
                  cy="150"
                  rx="88"
                  ry="114"
                  fill="none"
                  strokeWidth="2.5"
                  stroke={cfgRaw.ovalStroke}
                  strokeDasharray={isReady ? "none" : "6 4"}
                />
                {(["tl", "tr", "bl", "br"] as const).map((pos) => {
                  const x = pos.includes("l") ? 108 : 292
                  const y = pos.includes("t") ? 36 : 264
                  const dx = pos.includes("l") ? 1 : -1
                  const dy = pos.includes("t") ? 1 : -1
                  const sc = isReady
                    ? "#22c55e"
                    : isWarn
                      ? "#f59e0b"
                      : isDeny
                        ? "#ef4444"
                        : "#ffffff"
                  return (
                    <g
                      key={pos}
                      stroke={sc}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1={x} y1={y} x2={x + dx * 14} y2={y} />
                      <line x1={x} y1={y} x2={x} y2={y + dy * 14} />
                    </g>
                  )
                })}
              </svg>
            </div>

            <div className="absolute top-3 right-0 left-0 flex justify-center">
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 backdrop-blur-md",
                  cfgRaw.badgeClass
                )}
              >
                <HugeiconsIcon
                  icon={cfgIcon}
                  size={13}
                  strokeWidth={2}
                  className={cfgRaw.color}
                />
                <span className={cn("text-[12px] font-semibold", cfgRaw.color)}>
                  {cfgRaw.label}
                </span>
              </div>
            </div>

            {cfgRaw.sub && (
              <div className="absolute right-0 bottom-3 left-0 flex justify-center">
                <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] text-white/80 backdrop-blur-sm">
                  {cfgRaw.sub}
                </span>
              </div>
            )}

            {status === "too-dark" && (
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2">
                <HugeiconsIcon
                  icon={Sun01Icon}
                  size={36}
                  strokeWidth={1.5}
                  className="text-amber-400 drop-shadow-lg"
                />
                <p className="text-[13px] font-semibold text-white drop-shadow">
                  Needs more lighting
                </p>
              </div>
            )}
          </>
        )}

        {review && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={review.dataUrl}
              alt="Captured"
              className="h-full w-full object-cover"
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-0 rounded-2xl border-4",
                !review.valid
                  ? "border-red-500"
                  : review.warnings.length > 0
                    ? "border-amber-500"
                    : "border-green-500"
              )}
            />
            <div className="absolute inset-x-0 top-3 flex justify-center">
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 backdrop-blur-md",
                  !review.valid
                    ? "border-red-500/40 bg-red-500/20"
                    : review.warnings.length > 0
                      ? "border-amber-500/40 bg-amber-500/20"
                      : "border-green-500/40 bg-green-500/20"
                )}
              >
                <HugeiconsIcon
                  icon={
                    !review.valid || review.warnings.length > 0
                      ? Alert01Icon
                      : CheckmarkBadge01Icon
                  }
                  size={13}
                  strokeWidth={2}
                  className={
                    !review.valid
                      ? "text-red-400"
                      : review.warnings.length > 0
                        ? "text-amber-400"
                        : "text-green-400"
                  }
                />
                <span
                  className={cn(
                    "text-[12px] font-semibold",
                    !review.valid
                      ? "text-red-400"
                      : review.warnings.length > 0
                        ? "text-amber-400"
                        : "text-green-400"
                  )}
                >
                  {!review.valid
                    ? "Capture rejected"
                    : review.warnings.length > 0
                      ? "Captured with notice"
                      : "Capture accepted"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {!review && isDeny && cfgRaw.sub && (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900/40 dark:bg-red-900/20">
          <HugeiconsIcon
            icon={Alert01Icon}
            size={14}
            strokeWidth={2}
            className="shrink-0 text-red-500"
          />
          <p className="text-[12px] text-red-700 dark:text-red-400">
            <span className="font-semibold">{cfgRaw.label}</span> - {cfgRaw.sub}
          </p>
        </div>
      )}

      {!review && isWarn && (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900/40 dark:bg-amber-900/20">
          <HugeiconsIcon
            icon={Alert01Icon}
            size={14}
            strokeWidth={2}
            className="shrink-0 text-amber-500"
          />
          <p className="text-[12px] text-amber-700 dark:text-amber-400">
            <span className="font-semibold">{cfgRaw.label}</span> - {cfgRaw.sub}
          </p>
        </div>
      )}

      {review && !review.valid && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-900/20">
          <HugeiconsIcon
            icon={Alert01Icon}
            size={15}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-red-500"
          />
          <p className="text-[12px] leading-relaxed text-red-700 dark:text-red-400">
            {review.reason}
          </p>
        </div>
      )}

      {review && review.valid && review.warnings.length > 0 && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-900/20">
          <HugeiconsIcon
            icon={Alert01Icon}
            size={15}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-amber-500"
          />
          <p className="text-[12px] leading-relaxed text-amber-700 dark:text-amber-400">
            {review.warnings[0]}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        {!review ? (
          <>
            <button
              onClick={onBack}
              className="flex h-11 items-center justify-center rounded-xl border border-border px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              Back
            </button>
            <button
              onClick={handleCapture}
              disabled={!canCap}
              className={cn(
                "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold transition-all duration-150",
                capBtnClass
              )}
            >
              <HugeiconsIcon icon={Camera01Icon} size={16} strokeWidth={2} />
              {canCap
                ? `Capture & Time ${punchType === "in" ? "In" : "Out"}`
                : "Waiting for face..."}
            </button>
          </>
        ) : review.valid ? (
          <>
            <button
              onClick={handleRetry}
              className="flex h-11 items-center justify-center rounded-xl border border-border px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              Retake
            </button>
            <button
              onClick={handleConfirm}
              className={cn(
                "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-colors",
                punchType === "in"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              )}
            >
              <HugeiconsIcon
                icon={CheckmarkBadge01Icon}
                size={16}
                strokeWidth={2}
              />
              Confirm Time {punchType === "in" ? "In" : "Out"}
            </button>
          </>
        ) : (
          <button
            onClick={handleRetry}
            className={cn(
              "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white transition-colors",
              punchType === "in"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            )}
          >
            <HugeiconsIcon icon={Camera01Icon} size={16} strokeWidth={2} />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
