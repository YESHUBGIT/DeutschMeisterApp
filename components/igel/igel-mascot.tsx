"use client"

import { motion } from "framer-motion"

export type IgelMood = "idle" | "happy" | "sad" | "celebrate" | "cheering" | "sleeping" | "thinking"

interface IgelMascotProps {
  mood?: IgelMood
  size?: number
  className?: string
  breathing?: boolean
}

const spineColor: Record<IgelMood, string> = {
  idle: "#8B6914",
  happy: "#58CC02",
  sad: "#FF4B4B",
  celebrate: "#FFC800",
  cheering: "#58CC02",
  sleeping: "#6B7280",
  thinking: "#1CB0F6",
}

const eyeVariant: Record<IgelMood, "open" | "closed" | "sparkle"> = {
  idle: "open",
  happy: "sparkle",
  sad: "open",
  celebrate: "sparkle",
  cheering: "sparkle",
  sleeping: "closed",
  thinking: "open",
}

export function IgelMascot({ mood = "idle", size = 48, className, breathing = true }: IgelMascotProps) {
  const spine = spineColor[mood]
  const eyes = eyeVariant[mood]

  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`Igel mascot feeling ${mood}`}
    >
      {/* Spines */}
      <ellipse cx="32" cy="34" rx="24" ry="20" fill={spine} />
      {/* Spine texture */}
      <path d="M14 28 L18 22 L22 28" fill={spine} opacity="0.7" />
      <path d="M22 24 L26 17 L30 24" fill={spine} opacity="0.7" />
      <path d="M30 22 L34 14 L38 22" fill={spine} opacity="0.7" />
      <path d="M38 24 L42 17 L46 24" fill={spine} opacity="0.7" />
      <path d="M44 28 L48 22 L50 28" fill={spine} opacity="0.7" />
      {/* Body */}
      <ellipse cx="32" cy="40" rx="18" ry="15" fill="#D2A24C" />
      {/* Belly */}
      <ellipse cx="32" cy="44" rx="12" ry="9" fill="#F5DEB3" />
      {/* Face */}
      <circle cx="32" cy="34" r="13" fill="#D2A24C" />
      {/* Cheeks */}
      {(mood === "happy" || mood === "celebrate" || mood === "cheering") && (
        <>
          <circle cx="23" cy="36" r="3" fill="#FBBF24" opacity="0.4" />
          <circle cx="41" cy="36" r="3" fill="#FBBF24" opacity="0.4" />
        </>
      )}
      {/* Eyes */}
      {eyes === "open" && (
        <>
          <circle cx="27" cy="31" r="2.5" fill="#1a1a1a" />
          <circle cx="37" cy="31" r="2.5" fill="#1a1a1a" />
          <circle cx="28" cy="30" r="0.8" fill="#FFFFFF" />
          <circle cx="38" cy="30" r="0.8" fill="#FFFFFF" />
        </>
      )}
      {eyes === "sparkle" && (
        <>
          <circle cx="27" cy="31" r="2.5" fill="#1a1a1a" />
          <circle cx="37" cy="31" r="2.5" fill="#1a1a1a" />
          <circle cx="28" cy="30" r="1" fill="#FFFFFF" />
          <circle cx="38" cy="30" r="1" fill="#FFFFFF" />
          <circle cx="26" cy="29.5" r="0.5" fill="#FFFFFF" />
          <circle cx="36" cy="29.5" r="0.5" fill="#FFFFFF" />
        </>
      )}
      {eyes === "closed" && (
        <>
          <path d="M24 31 Q27 33 30 31" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M34 31 Q37 33 40 31" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* Nose */}
      <ellipse cx="32" cy="35" rx="2" ry="1.5" fill="#1a1a1a" />
      {/* Mouth */}
      {(mood === "happy" || mood === "celebrate" || mood === "cheering") && (
        <path d="M27 38 Q32 43 37 38" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {mood === "sad" && (
        <path d="M28 40 Q32 37 36 40" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {mood === "idle" && (
        <path d="M29 38.5 Q32 40 35 38.5" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      )}
      {mood === "sleeping" && (
        <>
          <line x1="29" y1="39" x2="35" y2="39" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" />
          <text x="44" y="24" fontSize="8" fill="#1CB0F6" fontWeight="bold">z</text>
          <text x="48" y="18" fontSize="6" fill="#1CB0F6" fontWeight="bold">z</text>
        </>
      )}
      {mood === "thinking" && (
        <>
          <circle cx="28" cy="38" r="0.5" fill="#1a1a1a" />
          <circle cx="32" cy="38.5" r="0.5" fill="#1a1a1a" />
          <circle cx="36" cy="38" r="0.5" fill="#1a1a1a" />
        </>
      )}
      {/* Crown for celebrate */}
      {mood === "celebrate" && (
        <path d="M24 20 L28 14 L32 18 L36 14 L40 20 Z" fill="#FFC800" stroke="#E5A800" strokeWidth="0.5" />
      )}
    </svg>
  )

  if (!breathing) return svg

  return (
    <motion.div
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size, display: "inline-flex" }}
    >
      {svg}
    </motion.div>
  )
}
