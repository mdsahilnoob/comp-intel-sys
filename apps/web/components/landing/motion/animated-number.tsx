"use client"

import { useEffect, useRef, useState } from "react"

type AnimatedNumberProps = {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  className = "",
  duration = 850,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const displayRef = useRef(value)
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    if (reduceMotion) {
      displayRef.current = value
      return
    }

    let frame = 0
    const start = performance.now()
    const initialValue = displayRef.current

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const nextValue = initialValue + (value - initialValue) * eased
      displayRef.current = nextValue
      setDisplayValue(nextValue)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, reduceMotion, value])

  return (
    <span className={className}>
      {prefix}
      {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        Math.round(reduceMotion ? value : displayValue),
      )}
      {suffix}
    </span>
  )
}
