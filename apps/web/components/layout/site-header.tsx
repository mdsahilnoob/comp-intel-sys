"use client"

import {
  BookOpen,
  Building2,
  ChartNoAxesCombined,
  GitCompareArrows,
  Layers3,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { MobileNav } from "@/components/layout/mobile-nav"

const navItems = [
  { href: "/#product", label: "Product", icon: Layers3 },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/methodology", label: "Methodology", icon: BookOpen },
]
const mobileNavItems = navItems.map(({ href, label }) => ({ href, label }))

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        frame = 0
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header className={`site-header sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header-inner mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          aria-label="CompGrid home"
        >
          <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="absolute inset-2 grid grid-cols-2 gap-0.5 opacity-90">
              <span className="rounded-[2px] bg-primary-foreground/90" />
              <span className="rounded-[2px] bg-primary-foreground/45" />
              <span className="rounded-[2px] bg-primary-foreground/45" />
              <span className="rounded-[2px] bg-primary-foreground/90" />
            </span>
            <span className="sr-only">CG</span>
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-base font-bold tracking-tight">
              CompGrid
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:block">
              Compensation intelligence
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="site-header-link inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
          <Link href="/research" className="sr-only focus:not-sr-only">
            Research
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/research"
            className="site-header-link hidden min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 lg:inline-flex"
          >
            <ChartNoAxesCombined className="size-4" aria-hidden="true" />
            Research
          </Link>
          <Link
            href="/explore"
            className="site-header-cta hidden min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 sm:inline-flex"
          >
            Explore compensation
          </Link>
          <MobileNav items={mobileNavItems} />
        </div>
      </div>
    </header>
  )
}
