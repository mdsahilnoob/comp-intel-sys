"use client"

import { SlidersHorizontal, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"

import type { CatalogOptions, ExplorerFilters } from "@/server/domain"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

export function FilterBar({ catalog, filters }: { catalog: CatalogOptions; filters: ExplorerFilters }) {
  const router = useRouter()
  const paramsRef = useRef<string | undefined>(undefined)
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [minTc, setMinTc] = useState(filters.minTc?.toString() ?? "")
  const [maxTc, setMaxTc] = useState(filters.maxTc?.toString() ?? "")
  const [minExperience, setMinExperience] = useState(filters.minExperience?.toString() ?? "")
  const [maxExperience, setMaxExperience] = useState(filters.maxExperience?.toString() ?? "")

  function update(values: Record<string, string>) {
    const next = new URLSearchParams(paramsRef.current ?? window.location.search)
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    next.delete("page")
    paramsRef.current = next.toString()
    startTransition(() => router.push(next.toString() ? `/?${next}` : "/"))
  }

  function submitRanges(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    update({ minTc, maxTc, minExperience, maxExperience })
    setOpen(false)
  }

  const controls = <>
    <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Role<Select aria-label="Role" value={filters.role ?? ""} onChange={(event) => update({ role: event.target.value })}><option value="">All roles</option>{catalog.roles.map((role) => <option key={role.slug} value={role.slug}>{role.name}</option>)}</Select></label>
    <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Location<Select aria-label="Location" value={filters.location ?? ""} onChange={(event) => update({ location: event.target.value })}><option value="">All cities</option>{catalog.locations.map((location) => <option key={location.slug} value={location.slug}>{location.city}</option>)}</Select></label>
    <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Company<Select aria-label="Company" value={filters.company ?? ""} onChange={(event) => update({ company: event.target.value })}><option value="">All companies</option>{catalog.companies.map((company) => <option key={company.slug} value={company.slug}>{company.name}</option>)}</Select></label>
    <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Canonical level<Select aria-label="Canonical level" value={filters.level ?? ""} onChange={(event) => update({ level: event.target.value })}><option value="">All levels</option>{catalog.careerLevels.map((level) => <option key={level.code} value={level.code}>{level.name}</option>)}</Select></label>
  </>

  return <section className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5" aria-label="Explorer filters">
    <div className="flex items-center justify-between gap-3 md:hidden"><div className="flex items-center gap-2 font-heading text-sm font-semibold"><SlidersHorizontal className="size-4 text-primary" />Filters</div><Button type="button" variant="ghost" size="sm" onClick={() => setOpen((value) => !value)} aria-expanded={open}>{open ? <><X className="size-4" /> Close</> : "Show filters"}</Button></div>
    <div className={`${open ? "grid" : "hidden"} mt-4 gap-3 md:mt-0 md:grid md:grid-cols-4`}>{controls}</div>
    <form onSubmit={submitRanges} className={`${open ? "grid" : "hidden"} mt-3 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] md:grid`}>
      <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Min total comp<input className="h-11 rounded-lg border border-input bg-background px-3.5 text-sm" inputMode="numeric" placeholder="₹ 10,00,000" value={minTc} onChange={(event) => setMinTc(event.target.value.replace(/[^0-9]/g, ""))} /></label>
      <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Max total comp<input className="h-11 rounded-lg border border-input bg-background px-3.5 text-sm" inputMode="numeric" placeholder="₹ 1,00,00,000" value={maxTc} onChange={(event) => setMaxTc(event.target.value.replace(/[^0-9]/g, ""))} /></label>
      <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Min experience<input className="h-11 rounded-lg border border-input bg-background px-3.5 text-sm" inputMode="numeric" placeholder="Years" value={minExperience} onChange={(event) => setMinExperience(event.target.value.replace(/[^0-9]/g, ""))} /></label>
      <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">Max experience<input className="h-11 rounded-lg border border-input bg-background px-3.5 text-sm" inputMode="numeric" placeholder="Years" value={maxExperience} onChange={(event) => setMaxExperience(event.target.value.replace(/[^0-9]/g, ""))} /></label>
      <div className="flex items-end gap-2"><Button type="submit" size="sm" disabled={pending}>Apply</Button><Button type="button" variant="ghost" size="sm" onClick={() => { setMinTc(""); setMaxTc(""); setMinExperience(""); setMaxExperience(""); update({ minTc: "", maxTc: "", minExperience: "", maxExperience: "" }) }}>Clear</Button></div>
    </form>
    <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/70 pt-3"><p className="text-xs text-muted-foreground">Every row is normalized to annual INR total compensation.</p>{pending && <span className="text-xs font-semibold text-primary" role="status">Updating…</span>}</div>
  </section>
}
