"use client"

import type { CSSProperties, ReactNode, Ref } from "react"
import { useEffect, useRef, useState } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: "div" | "section" | "article"
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    setReducedMotion(prefersReducedMotion)
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return

    const isInitiallyVisible =
      element.getBoundingClientRect().top < window.innerHeight * 0.9
    if (!isInitiallyVisible) setVisible(false)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const Component = as
  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties

  return (
    <Component
      ref={ref as unknown as Ref<HTMLDivElement>}
      className={`landing-reveal ${visible ? "is-visible" : "is-hidden"} ${reducedMotion ? "motion-reduced" : ""} ${className}`}
      style={style}
    >
      {children}
    </Component>
  )
}
