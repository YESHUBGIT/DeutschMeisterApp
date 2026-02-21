"use client"

import Lottie from "lottie-react"
import idle from "@/components/igel/igel-idle.json"
import happy from "@/components/igel/igel-happy.json"
import sad from "@/components/igel/igel-sad.json"
import celebrate from "@/components/igel/igel-celebrate.json"

export type IgelMood = "idle" | "happy" | "sad" | "celebrate"

const animations: Record<IgelMood, object> = {
  idle,
  happy,
  sad,
  celebrate,
}

interface IgelMascotProps {
  mood?: IgelMood
  size?: number
  loop?: boolean
  className?: string
}

export function IgelMascot({ mood = "idle", size = 48, loop = true, className }: IgelMascotProps) {
  return (
    <Lottie
      animationData={animations[mood]}
      loop={loop}
      style={{ width: size, height: size }}
      className={className}
    />
  )
}
