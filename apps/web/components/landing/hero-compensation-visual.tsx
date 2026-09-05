"use client"

import type { CSSProperties } from "react"
import { useEffect, useMemo, useState } from "react"

import { AnimatedNumber } from "@/components/landing/motion/animated-number"
import { DrawLine } from "@/components/landing/motion/draw-line"
import { heroSamples } from "@/components/landing/landing-data"

function trendPath(values: number[]) {
  const min = Math.min(...values) - 4
  const max = Math.max(...values) + 4
  return values
    .map((value, index) => {
      const x = 10 + (index / (values.length - 1)) * 180
      const y = 68 - ((value - min) / (max - min)) * 54
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
}

export function HeroCompensationVisual() {
  const [selectedId, setSelectedId] = useState(heroSamples[0].id)
  const selected =
    heroSamples.find((sample) => sample.id === selectedId) ?? heroSamples[0]

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      heroSamples.length < 2
    ) {
      return
    }

    const interval = window.setInterval(() => {
      setSelectedId((current) => {
        const index = heroSamples.findIndex((sample) => sample.id === current)
        return heroSamples[(index + 1) % heroSamples.length].id
      })
    }, 5200)

    return () => window.clearInterval(interval)
  }, [])

  const breakdown = useMemo(
    () => [
      { label: "Base", value: selected.base, tone: "base" },
      { label: "Stock", value: selected.stock, tone: "stock" },
      { label: "Bonus", value: selected.bonus, tone: "bonus" },
    ],
    [selected],
  )

  return (
    <div className="hero-visual-wrap">
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
      <article className="hero-comp-card">
        <div className="hero-card-topline">
          <span className="hero-card-kicker">COMPGRID / SAMPLE 0142</span>
          <span className="hero-card-status">
            <span className="status-dot" aria-hidden="true" />
            Illustrative
          </span>
        </div>

        <div className="hero-card-identity">
          <div className="company-mark" aria-hidden="true">
            {selected.mark}
          </div>
          <div>
            <p className="hero-card-company">{selected.company}</p>
            <p className="hero-card-role">
              Software Engineer <span>/</span> {selected.level}
            </p>
          </div>
          <span className="hero-location">{selected.location}</span>
        </div>

        <div className="hero-card-total">
          <div>
            <p className="metric-label">TOTAL COMPENSATION</p>
            <AnimatedNumber
              key={selected.id}
              value={selected.total}
              prefix="₹"
              suffix="L"
              className="hero-total-value"
            />
          </div>
          <div className="hero-card-context">
            <span>Market median</span>
            <strong>₹68L</strong>
            <span>Approx. percentile</span>
            <strong className="percentile-value">P{selected.percentile}</strong>
          </div>
        </div>

        <div className="hero-bar-group">
          <div className="hero-bar-label-row">
            <span>Annual package mix</span>
            <span>₹{selected.total}L total</span>
          </div>
          <div
            className="hero-comp-bar"
            role="img"
            aria-label={`${selected.company} ${selected.level} compensation composition: base ₹${selected.base}L, stock ₹${selected.stock}L, bonus ₹${selected.bonus}L`}
          >
            {breakdown.map((item) => (
              <span
                key={`${selected.id}-${item.label}`}
                className={`hero-bar-segment hero-bar-${item.tone}`}
                style={
                  {
                    "--bar-size": `${(item.value / selected.total) * 100}%`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className="hero-breakdown-list">
            {breakdown.map((item) => (
              <div key={item.label} className="hero-breakdown-item">
                <span className={`legend-dot legend-${item.tone}`} aria-hidden="true" />
                <span>{item.label}</span>
                <strong>₹{item.value}L</strong>
                <small>{Math.round((item.value / selected.total) * 100)}%</small>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-chart-row">
          <div>
            <p className="metric-label">LEVEL CONTEXT</p>
            <p className="hero-level-value">
              {selected.level} <span>→</span> {selected.canonicalLevel}
            </p>
          </div>
          <svg
            className="hero-sparkline"
            viewBox="0 0 200 80"
            role="img"
            aria-label={`${selected.company} illustrative compensation trend`}
          >
            <path d="M10 68H190" className="sparkline-grid" />
            <DrawLine d={trendPath(selected.trend)} />
            {selected.trend.map((value, index) => {
              const min = Math.min(...selected.trend) - 4
              const max = Math.max(...selected.trend) + 4
              const x = 10 + (index / (selected.trend.length - 1)) * 180
              const y = 68 - ((value - min) / (max - min)) * 54
              return <circle key={`${selected.id}-${index}`} cx={x} cy={y} r="2.4" className="sparkline-point" />
            })}
          </svg>
        </div>

        <div className="hero-card-tabs" role="tablist" aria-label="Sample company selection">
          {heroSamples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              role="tab"
              aria-selected={selected.id === sample.id}
              className={selected.id === sample.id ? "is-active" : ""}
              onClick={() => setSelectedId(sample.id)}
            >
              {sample.company} <span>{sample.level}</span>
            </button>
          ))}
        </div>
      </article>
    </div>
  )
}
