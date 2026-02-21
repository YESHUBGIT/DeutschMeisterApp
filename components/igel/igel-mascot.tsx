"use client"

import dynamic from "next/dynamic"

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
)

export type IgelMood = "idle" | "happy" | "sad" | "celebrate"

interface IgelMascotProps {
  mood?: IgelMood
  size?: number
  loop?: boolean
  className?: string
  useFallback?: boolean
}

/** Hedgehog mascot: tries the Lottie animation; falls back to an inline SVG hedgehog. */
export function IgelMascot({ mood = "idle", size = 48, className, useFallback = false }: IgelMascotProps) {
  if (!useFallback) {
    return (
      <DotLottieReact
        src="/igel/igel.lottie"
        loop
        autoplay
        style={{ width: size, height: size }}
        className={className}
      />
    )
  }

  // SVG hedgehog fallback
  const moodColor =
    mood === "happy" || mood === "celebrate"
      ? "#22c55e"
      : mood === "sad"
        ? "#ef4444"
        : "#8B6914"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Igel mascot"
    >
      {/* Body spines */}
      <ellipse cx="32" cy="36" rx="22" ry="18" fill={moodColor} />
      {/* Inner body */}
      <ellipse cx="32" cy="40" rx="16" ry="14" fill="#D2A24C" />
      {/* Belly */}
      <ellipse cx="32" cy="44" rx="10" ry="8" fill="#F5DEB3" />
      {/* Face */}
      <circle cx="32" cy="32" r="12" fill="#D2A24C" />
      {/* Left eye */}
      <circle cx="28" cy="30" r="2" fill="#1a1a1a" />
      {/* Right eye */}
      <circle cx="36" cy="30" r="2" fill="#1a1a1a" />
      {/* Nose */}
      <circle cx="32" cy="34" r="1.5" fill="#1a1a1a" />
      {/* Mouth - changes with mood */}
      {mood === "happy" || mood === "celebrate" ? (
        <path d="M28 36 Q32 40 36 36" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : mood === "sad" ? (
        <path d="M28 38 Q32 35 36 38" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <line x1="29" y1="37" x2="35" y2="37" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  )
}
