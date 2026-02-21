"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export type IgelMood = "idle" | "happy" | "sad" | "celebrate"

const animations: Record<IgelMood, string> = {
  idle: "/igel/igel.lottie",
  happy: "/igel/igel.lottie",
  sad: "/igel/igel.lottie",
  celebrate: "/igel/igel.lottie",
}

interface IgelMascotProps {
  mood?: IgelMood
  size?: number
  loop?: boolean
  className?: string
}

export function IgelMascot({ mood = "idle", size = 48, loop = true, className }: IgelMascotProps) {
  return (
    <DotLottieReact
      src={animations[mood]}
      loop={loop}
      autoplay
      style={{ width: size, height: size }}
      className={className}
    />
  )
}
