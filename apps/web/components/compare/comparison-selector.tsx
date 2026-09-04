"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { createComparisonHref } from "@/lib/urls"
import type { CatalogOptions, ComparisonEntryData } from "@/server/domain"
import { Button } from "@/components/ui/button"

export function ComparisonSelector({ catalog, entries, roleSlug, locationSlug }: { catalog: CatalogOptions; entries: ComparisonEntryData[]; roleSlug: string; locationSlug: string }) {
  const router = useRouter()
  const tokens = catalog.companies.flatMap((company) => catalog.companyLevels.filter((level) => level.companyId === company.id).map((level) => ({ token: `${company.slug}-${level.code.toLowerCase()}`, label: `${company.name} · ${level.code}`, company: company.slug, level: level.code })))
  const [selected, setSelected] = useState<string[]>(entries.map((entry) => `${entry.selection.companySlug}-${entry.selection.companyLevelCode.toLowerCase()}`))
  const [role, setRole] = useState(roleSlug)
  const [location, setLocation] = useState(locationSlug)
  function apply() { router.push(createComparisonHref({ a: selected[0], b: selected[1], c: selected[2], role, location })) }
  return <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5"><div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">{[0, 1, 2].map((index) => <label key={index} className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Company level {index + 1}<select aria-label={`Company level ${index + 1}`} className="h-11 rounded-lg border border-input bg-background px-3 text-sm" value={selected[index] ?? ""} onChange={(event) => setSelected((current) => { const next = [...current]; next[index] = event.target.value; return next })}><option value="">Choose a level</option>{tokens.map((item) => <option key={item.token} value={item.token}>{item.label}</option>)}</select></label>)}</div><div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Role<select className="h-11 rounded-lg border border-input bg-background px-3 text-sm" value={role} onChange={(event) => setRole(event.target.value)}>{catalog.roles.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label><label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Location<select className="h-11 rounded-lg border border-input bg-background px-3 text-sm" value={location} onChange={(event) => setLocation(event.target.value)}>{catalog.locations.map((item) => <option key={item.slug} value={item.slug}>{item.city}</option>)}</select></label><Button type="button" onClick={apply}>Update comparison</Button></div></div>
}
