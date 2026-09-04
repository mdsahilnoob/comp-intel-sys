"use client"

import type { CSSProperties } from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { AnimatedNumber } from "@/components/landing/motion/animated-number"
import { breakdownSamples } from "@/components/landing/landing-data"

const definitions = {
  base: "Cash salary paid through the year, before taxes.",
  stock: "Annualized equity value, not the full multi-year grant.",
  bonus: "Target or observed annual bonus where supplied.",
} as const

export function CompensationBreakdown() {
  const [selectedId, setSelectedId] = useState(breakdownSamples[0].id)
  const [activePart, setActivePart] = useState<keyof typeof definitions | null>(null)
  const selected =
    breakdownSamples.find((sample) => sample.id === selectedId) ??
    breakdownSamples[0]
  const parts = useMemo(
    () => [
      { id: "base" as const, label: "BASE", value: selected.base, tone: "base" },
      { id: "stock" as const, label: "STOCK", value: selected.stock, tone: "stock" },
      { id: "bonus" as const, label: "BONUS", value: selected.bonus, tone: "bonus" },
    ],
    [selected],
  )

  return (
    <div className="breakdown-module">
      <div className="breakdown-tabs" role="tablist" aria-label="Breakdown sample company">
        {breakdownSamples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            role="tab"
            aria-selected={selected.id === sample.id}
            className={selected.id === sample.id ? "is-active" : ""}
            onClick={() => {
              setSelectedId(sample.id)
              setActivePart(null)
            }}
          >
            <span>{sample.company}</span>
            <small>{sample.level}</small>
          </button>
        ))}
      </div>

      <div className="breakdown-total-row">
        <div>
          <p className="dark-label">ILLUSTRATIVE TOTAL COMP</p>
          <AnimatedNumber
            key={selected.id}
            value={selected.total}
            prefix="₹"
            suffix="L"
            className="breakdown-total"
          />
        </div>
        <p className="breakdown-total-note">
          {selected.company} <span>/</span> {selected.level}
        </p>
      </div>

      <div className="breakdown-bar" aria-label={`${selected.company} compensation composition`}>
        {parts.map((part) => (
          <button
            key={`${selected.id}-${part.id}`}
            type="button"
            className={`breakdown-segment breakdown-segment-${part.tone} ${activePart && activePart !== part.id ? "is-dimmed" : ""} ${activePart === part.id ? "is-selected" : ""}`}
            style={{ "--segment-size": `${(part.value / selected.total) * 100}%` } as CSSProperties}
            onMouseEnter={() => setActivePart(part.id)}
            onMouseLeave={() => setActivePart(null)}
            onFocus={() => setActivePart(part.id)}
            onBlur={() => setActivePart(null)}
            onClick={() => setActivePart((current) => (current === part.id ? null : part.id))}
            aria-label={`${part.label}: ₹${part.value}L, ${Math.round((part.value / selected.total) * 100)} percent`}
          >
            <span>{Math.round((part.value / selected.total) * 100)}%</span>
          </button>
        ))}
      </div>

      <div className="breakdown-part-grid">
        {parts.map((part) => (
          <button
            key={part.id}
            type="button"
            className={`breakdown-part ${activePart && activePart !== part.id ? "is-dimmed" : ""}`}
            onMouseEnter={() => setActivePart(part.id)}
            onMouseLeave={() => setActivePart(null)}
            onFocus={() => setActivePart(part.id)}
            onBlur={() => setActivePart(null)}
            onClick={() => setActivePart((current) => (current === part.id ? null : part.id))}
          >
            <span className={`legend-dot legend-${part.tone}`} aria-hidden="true" />
            <span className="breakdown-part-label">{part.label}</span>
            <strong>₹{part.value}L</strong>
            <small>{Math.round((part.value / selected.total) * 100)}%</small>
          </button>
        ))}
      </div>

      <p className="breakdown-definition" aria-live="polite">
        {activePart ? definitions[activePart] : "Hover or focus a segment to see what it contains."}
      </p>
    </div>
  )
}

const storySteps = [
  {
    eyebrow: "01 / LEVEL",
    title: "Compare the right level.",
    body: "Normalize the comparison unit first. The raw company level stays next to its directional shared level.",
  },
  {
    eyebrow: "02 / MIX",
    title: "Compare how you’re paid.",
    body: "A total only becomes useful when its base, annualized equity, and bonus are visible beside it.",
  },
  {
    eyebrow: "03 / MARKET",
    title: "Compare the market.",
    body: "Use the median and percentile band to understand position without mistaking one offer for the whole market.",
  },
]

export function ComparisonStory() {
  const [activeStep, setActiveStep] = useState(0)
  const stepsRef = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = Number((visible.target as HTMLElement).dataset.storyIndex)
        if (!Number.isNaN(index)) setActiveStep(index)
      },
      { threshold: [0.25, 0.6], rootMargin: "-20% 0px -30% 0px" },
    )

    stepsRef.current.forEach((step) => {
      if (step) observer.observe(step)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="story-layout">
      <div className="story-copy">
        {storySteps.map((step, index) => (
          <article
            key={step.eyebrow}
            ref={(element) => {
              stepsRef.current[index] = element
            }}
            data-story-index={index}
            className={`story-step ${activeStep === index ? "is-active" : ""}`}
          >
            <p className="eyebrow eyebrow-dark">{step.eyebrow}</p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
      <div className="story-visual-wrap">
        <div className="story-visual" aria-live="polite">
          {activeStep === 0 ? <LevelStoryVisual /> : null}
          {activeStep === 1 ? <MixStoryVisual /> : null}
          {activeStep === 2 ? <MarketStoryVisual /> : null}
        </div>
      </div>
    </div>
  )
}

function LevelStoryVisual() {
  return (
    <div className="story-level-visual">
      <div className="story-visual-head">
        <span>Raw company levels</span>
        <span>Normalized view</span>
      </div>
      <div className="story-level-list">
        {["Google / L4", "Amazon / L5", "Meta / E4", "Microsoft / 63"].map((item, index) => (
          <div key={item} className="story-level-row" style={{ "--row-delay": `${index * 70}ms` } as CSSProperties}>
            <span>{item}</span>
            <i aria-hidden="true" />
            <strong>MID</strong>
          </div>
        ))}
      </div>
      <p className="story-visual-note">Directional mapping · raw context stays visible</p>
    </div>
  )
}

function MixStoryVisual() {
  const companies = [
    { name: "Google", base: 74, stock: 42, bonus: 18 },
    { name: "Amazon", base: 68, stock: 31, bonus: 15 },
    { name: "Microsoft", base: 63, stock: 24, bonus: 13 },
  ]
  return (
    <div className="story-mix-visual">
      <div className="story-visual-head">
        <span>Compensation composition</span>
        <span>Base / Stock / Bonus</span>
      </div>
      {companies.map((company, index) => (
        <div key={company.name} className="story-mix-row" style={{ "--row-delay": `${index * 80}ms` } as CSSProperties}>
          <div className="story-mix-name">{company.name}</div>
          <div className="story-mix-bars">
            <span className="mix-base" style={{ width: `${company.base}%` }} />
            <span className="mix-stock" style={{ width: `${company.stock}%` }} />
            <span className="mix-bonus" style={{ width: `${company.bonus}%` }} />
          </div>
        </div>
      ))}
      <div className="story-mix-legend"><span><i className="legend-dot legend-base" />Base</span><span><i className="legend-dot legend-stock" />Stock</span><span><i className="legend-dot legend-bonus" />Bonus</span></div>
    </div>
  )
}

function MarketStoryVisual() {
  return (
    <div className="story-market-visual">
      <div className="story-visual-head">
        <span>Market distribution</span>
        <span>Software Engineer · MID</span>
      </div>
      <div className="distribution-track">
        <div className="distribution-range" />
        <div className="distribution-marker marker-p25"><span>P25</span><strong>₹52L</strong></div>
        <div className="distribution-marker marker-p50"><span>P50</span><strong>₹68L</strong></div>
        <div className="distribution-marker marker-p75"><span>P75</span><strong>₹84L</strong></div>
        <div className="distribution-marker marker-p90"><span>P90</span><strong>₹102L</strong></div>
      </div>
      <p className="story-visual-note">Percentiles make the spread legible before the conclusion.</p>
    </div>
  )
}
