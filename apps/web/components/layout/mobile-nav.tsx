"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"

interface MobileNavItem {
  href: string
  label: string
}

export function MobileNav({ items }: { items: MobileNavItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative md:hidden">
      <Button
        variant="outline"
        size="icon"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden={true} /> : <Menu aria-hidden={true} />}
      </Button>
      {open ? (
        <div className="absolute top-14 right-0 z-50 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl">
          {items.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
            >
              <span className="size-4 rounded-full border border-current/40" aria-hidden="true" />
              {label}
            </Link>
          ))}
          <Link
            href="/research"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            <span className="grid size-4 place-items-center rounded border border-current text-[9px] font-bold">
              R
            </span>
            Research
          </Link>
          <Link
            href="/submit"
            onClick={() => setOpen(false)}
            className="mt-1 flex min-h-11 items-center rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            Add compensation data
          </Link>
        </div>
      ) : null}
    </div>
  )
}
