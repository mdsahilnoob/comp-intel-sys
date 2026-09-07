import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"

import {
  careerProgression,
  comparisonCompanies,
  dashboardRows,
  featureModules,
  levelMappings,
  pipelineStages,
  tickerItems,
} from "@/components/landing/landing-data"
import { CompensationBreakdown, ComparisonStory } from "@/components/landing/landing-interactions"
import { AnimatedNumber } from "@/components/landing/motion/animated-number"
import { DrawLine } from "@/components/landing/motion/draw-line"
import { Reveal } from "@/components/landing/motion/reveal"
import { ArrowRightIcon } from "@/components/ui/arrow-right"
import { ArrowUpRightIcon } from "@/components/ui/arrow-up-right"
import { CheckIcon } from "@/components/ui/check"
import { ChevronRightIcon } from "@/components/ui/chevron-right"

function SectionIntro({
  eyebrow,
  title,
  body,
  tone = "light",
}: {
  eyebrow: string
  title: ReactNode
  body: string
  tone?: "light" | "dark"
}) {
  return (
    <div className={`section-intro section-intro-${tone}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-intro-body">{body}</p>
    </div>
  )
}

export function CompensationTicker() {
  const items = [...tickerItems, ...tickerItems]
  return (
    <section className="ticker-section" aria-label="Illustrative compensation ticker">
      <div className="ticker-label">DEMO RECORDS / MOVING SAMPLE</div>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {items.map((item, index) => (
            <span className="ticker-item" key={`${item}-${index}`}>
              <i aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LevelMappingSection() {
  return (
    <section className="landing-section thesis-section" id="product">
      <div className="landing-container">
        <Reveal>
          <SectionIntro
            eyebrow="THE COMPARISON UNIT"
            title={<>Job titles are noisy.<br /><em>Levels are comparable.</em></>}
            body="Companies describe similar scopes of work differently. CompGrid keeps the raw company level in view, then maps it into a clearer comparison framework."
          />
        </Reveal>
        <Reveal className="level-map-wrap" delay={100}>
          <div className="level-map-meta">
            <span>RAW COMPANY LEVEL</span>
            <span>SHARED CAREER LEVEL</span>
          </div>
          <div className="level-map" role="img" aria-label="Google L4, Amazon L5, Meta E4, and Microsoft 63 map directionally to MID">
            <div className="level-map-source-list">
              {levelMappings.map(([company, level], index) => (
                  <div className="level-map-source" key={company} style={{ "--map-delay": `${index * 90}ms` } as CSSProperties}>
                  <span className="map-company-mark" aria-hidden="true">{company.slice(0, 1)}</span>
                  <span>{company}</span>
                  <strong>{level}</strong>
                </div>
              ))}
            </div>
            <svg className="level-map-lines" viewBox="0 0 420 250" aria-hidden="true" preserveAspectRatio="none">
              <path d="M8 35 C130 35 160 125 300 125" />
              <path d="M8 95 C130 95 160 125 300 125" />
              <path d="M8 155 C130 155 160 125 300 125" />
              <path d="M8 215 C130 215 160 125 300 125" />
              <path d="M300 125H414" className="level-map-end-line" />
            </svg>
            <div className="level-map-node">
              <span>CANONICAL</span>
              <strong>MID</strong>
              <small>directional map</small>
            </div>
          </div>
          <p className="level-map-caption">Google L4 · Amazon L5 · Meta E4 · Microsoft 63 <span>→</span> MID</p>
        </Reveal>
      </div>
    </section>
  )
}

export function CompositionSection() {
  return (
    <section className="landing-section composition-section" id="composition">
      <div className="landing-container">
        <div className="composition-layout">
          <Reveal>
            <SectionIntro
              eyebrow="THE PACKAGE"
              title={<>Salary is only<br /><em>one part.</em></>}
              body="Understand base salary, annualized equity, and bonus separately before looking at total compensation."
            />
            <p className="section-aside-note"><span aria-hidden="true">/</span> Hover a segment to inspect the definition.</p>
          </Reveal>
          <Reveal className="composition-card-wrap" delay={140}>
            <CompensationBreakdown />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function ProductPreviewSection() {
  const filters = ["Software Engineer", "Bengaluru", "All companies", "MID"]
  return (
    <section className="landing-section preview-section" id="preview">
      <div className="landing-container">
        <Reveal>
          <SectionIntro
            eyebrow="THE PRODUCT"
            title={<>A market view with<br /><em>the context intact.</em></>}
            body="Filter by role, location, company, and level. Then inspect the distribution, package mix, and records behind the headline."
          />
        </Reveal>
        <Reveal className="dashboard-frame-wrap" delay={130}>
          <div className="dashboard-frame">
            <div className="dashboard-topbar">
              <div className="dashboard-brand"><span className="dashboard-brand-mark">CG</span><span>CompGrid / Explorer</span></div>
              <div className="dashboard-topbar-meta"><span>DEMO MODE</span><span>INR</span><span className="dashboard-live-dot" /></div>
            </div>
            <div className="dashboard-content">
              <div className="dashboard-heading-row">
                <div><p className="dashboard-kicker">MARKET VIEW / 04 FILTERS</p><h3>Software Engineer compensation</h3></div>
                <span className="dashboard-updated">Illustrative slice · Bengaluru</span>
              </div>
              <div className="dashboard-filters" role="group" aria-label="Example explorer filters">
                {filters.map((filter, index) => <div className="dashboard-filter" key={filter}><span>{["Role", "Location", "Company", "Level"][index]}</span><strong>{filter}</strong><ChevronRightIcon size={16} aria-hidden="true" /></div>)}
              </div>
              <div className="dashboard-metrics">
                <div className="dashboard-metric dashboard-metric-primary"><span>Median TC</span><AnimatedNumber value={68} prefix="₹" suffix="L" /><small>50th percentile</small></div>
                <div className="dashboard-metric"><span>P25</span><AnimatedNumber value={52} prefix="₹" suffix="L" /><small>lower quartile</small></div>
                <div className="dashboard-metric"><span>P75</span><AnimatedNumber value={84} prefix="₹" suffix="L" /><small>upper quartile</small></div>
                <div className="dashboard-metric"><span>P90</span><AnimatedNumber value={102} prefix="₹" suffix="L" /><small>high percentile</small></div>
              </div>
              <div className="dashboard-body-grid">
                <div className="dashboard-chart-card">
                  <div className="dashboard-card-heading"><span>Distribution by total compensation</span><span>₹L</span></div>
                  <div className="dashboard-chart" role="img" aria-label="Illustrative compensation distribution from P25 to P90">
                    <div className="chart-y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
                    <div className="chart-plot"><div className="chart-grid-lines" aria-hidden="true" /><svg viewBox="0 0 600 190" preserveAspectRatio="none" aria-hidden="true"><path className="chart-area" d="M0 167 C70 156 100 143 145 147 S220 119 264 127 S328 101 365 103 S430 77 465 91 S525 45 600 32 L600 190 L0 190Z" /><DrawLine d="M0 167 C70 156 100 143 145 147 S220 119 264 127 S328 101 365 103 S430 77 465 91 S525 45 600 32" /></svg><div className="chart-x-axis"><span>P25 · ₹52L</span><span>P50 · ₹68L</span><span>P75 · ₹84L</span><span>P90 · ₹102L</span></div></div>
                  </div>
                </div>
                <div className="dashboard-table-card">
                  <div className="dashboard-card-heading"><span>Matching records</span><span>TC / MIX</span></div>
                  <div className="dashboard-rows">
                    {dashboardRows.map((row, index) => <div className="dashboard-row" key={row.company} style={{ "--row-delay": `${index * 50}ms` } as CSSProperties}><div className="dashboard-row-company"><span>{row.company.slice(0, 1)}</span><div><strong>{row.company}</strong><small>{row.level} · {row.canonical}</small></div></div><strong className="dashboard-row-value">₹{row.total}L</strong><small className="dashboard-row-mix">{row.mix}</small></div>)}
                  </div>
                </div>
              </div>
              <p className="dashboard-disclaimer">Synthetic demo dataset for engineering evaluation · values are illustrative, not a compensation guarantee.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function StorySection() {
  return (
    <section className="landing-section story-section" id="story">
      <div className="landing-container">
        <Reveal>
          <SectionIntro
            tone="dark"
            eyebrow="READING THE GRID"
            title={<>Three questions.<br /><em>One clearer view.</em></>}
            body="A compensation decision gets better when the comparison unit, package mix, and market position are all visible together."
          />
        </Reveal>
        <Reveal className="story-module-wrap" delay={120}>
          <ComparisonStory />
        </Reveal>
      </div>
    </section>
  )
}

export function CompanyComparisonSection() {
  const rows = [
    { label: "Median TC", key: "total", suffix: "L" },
    { label: "Base", key: "base", suffix: "L" },
    { label: "Stock", key: "stock", suffix: "L" },
    { label: "Bonus", key: "bonus", suffix: "L" },
    { label: "P75", key: "p75", suffix: "L" },
    { label: "Experience", key: "experience", suffix: "" },
  ] as const
  return (
    <section className="landing-section company-comparison-section" id="compare">
      <div className="landing-container">
        <Reveal>
          <SectionIntro
            eyebrow="DIRECT COMPARISON"
            title={<>Three companies.<br /><em>One comparable view.</em></>}
            body="Keep the raw company level visible while comparing packages on a shared MID frame. Highest values are marked with a quiet accent, not a scoreboard."
          />
        </Reveal>
        <Reveal className="comparison-table-wrap" delay={110}>
          <div className="comparison-table-scroll">
            <table className="comparison-table">
              <caption className="sr-only">Illustrative compensation comparison for Google L4, Amazon L5, and Microsoft 63</caption>
              <thead><tr><th scope="col">Metric</th>{comparisonCompanies.map((company) => <th scope="col" key={company.company}><span>{company.company}</span><strong>{company.level}</strong><small>MID · Bengaluru</small></th>)}</tr></thead>
              <tbody>{rows.map((row, rowIndex) => <tr key={row.label}><th scope="row">{row.label}</th>{comparisonCompanies.map((company) => { const value = company[row.key]; const display = typeof value === "number" ? `₹${value}${row.suffix}` : value; const isHighest = rowIndex < 5 && typeof value === "number" && value === Math.max(...comparisonCompanies.map((item) => Number(item[row.key]))) ; return <td key={company.company} className={isHighest ? "is-highest" : ""}><strong>{display}</strong>{typeof value === "number" && rowIndex !== 5 ? <span className="table-bar" style={{ "--bar-width": `${Math.min((value / 105) * 100, 100)}%` } as React.CSSProperties} /> : null}</td>})}</tr>)}</tbody>
            </table>
          </div>
          <p className="table-note"><span aria-hidden="true">◎</span> Illustrative values · normalized levels are directional · stock is annualized</p>
        </Reveal>
      </div>
    </section>
  )
}

export function CareerProgressionSection() {
  return (
    <section className="landing-section progression-section">
      <div className="landing-grid landing-grid-dark" aria-hidden="true" />
      <div className="landing-container">
        <Reveal>
          <SectionIntro
            tone="dark"
            eyebrow="CAREER PROGRESSION"
            title={<>See how compensation<br /><em>changes as scope grows.</em></>}
            body="Career progression is not a title list. It is a sequence of changing scope, represented here as illustrative demo data."
          />
        </Reveal>
        <Reveal className="progression-visual-wrap" delay={120}>
          <div className="progression-visual">
            <div className="progression-axis-labels"><span>₹180L</span><span>₹90L</span><span>₹0</span></div>
            <svg className="progression-chart" viewBox="0 0 1000 380" role="img" aria-label="Illustrative total compensation climbs from Entry at 35 lakh to Principal at 180 lakh">
              <defs><linearGradient id="progression-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--landing-accent)" stopOpacity=".28" /><stop offset="1" stopColor="var(--landing-accent)" stopOpacity="0" /></linearGradient></defs>
              <path className="progression-grid-line" d="M0 30H1000M0 190H1000M0 350H1000" />
              <path className="progression-area" d="M40 288 L270 225 L500 160 L730 92 L960 30 L960 350 L40 350Z" />
              <DrawLine className="progression-line" d="M40 288 L270 225 L500 160 L730 92 L960 30" />
              {careerProgression.map((item, index) => <circle key={item.level} className="progression-point" cx={40 + index * 230} cy={[288, 225, 160, 92, 30][index]} r="7" style={{ "--point-delay": `${400 + index * 110}ms` } as CSSProperties} />)}
            </svg>
            <div className="progression-labels">{careerProgression.map((item, index) => <div key={item.level} className="progression-label" style={{ "--point-delay": `${450 + index * 110}ms` } as CSSProperties}><span>{item.level}</span><strong>₹{item.value}L</strong><small>{item.scope}</small></div>)}</div>
          </div>
          <p className="progression-disclaimer">Illustrative demo data · not a market benchmark</p>
        </Reveal>
      </div>
    </section>
  )
}

function FeatureVisual({ type }: { type: (typeof featureModules)[number]["type"] }) {
  if (type === "levels") return <div className="feature-visual feature-levels"><div><span>Google</span><strong>L4</strong></div><div><span>Amazon</span><strong>L5</strong></div><div><span>Meta</span><strong>E4</strong></div><b>→</b><em>MID</em></div>
  if (type === "composition") return <div className="feature-visual feature-composition"><div><span>₹46L</span><small>BASE</small></div><b>+</b><div><span>₹20L</span><small>STOCK</small></div><b>+</b><div><span>₹7L</span><small>BONUS</small></div><strong>= ₹73L</strong></div>
  if (type === "distribution") return <div className="feature-visual feature-distribution"><div className="feature-distribution-line" /><span className="feature-p25">P25</span><span className="feature-p50">P50</span><span className="feature-p75">P75</span><span className="feature-p90">P90</span></div>
  return <div className="feature-visual feature-normalization"><div><span>Google India Pvt Ltd.</span><span>SWE II</span><span>Bangalore</span></div><b>→</b><div><strong>Google</strong><strong>Software Engineer</strong><strong>Bengaluru</strong></div></div>
}

export function DataIntelligenceSection() {
  return (
    <section className="landing-section intelligence-section">
      <div className="landing-container">
        <Reveal>
          <SectionIntro
            eyebrow="PRODUCT / ENGINEERING"
            title={<>The work behind<br /><em>the clean comparison.</em></>}
            body="The interface stays calm because the product does the hard normalization work underneath."
          />
        </Reveal>
        <div className="feature-module-grid">
          {featureModules.map((feature, index) => <Reveal as="article" className="feature-module" delay={index * 70} key={feature.eyebrow}><p className="feature-eyebrow">{feature.eyebrow}</p><FeatureVisual type={feature.type} /><h3>{feature.title}</h3><p>{feature.body}</p><span className="feature-index">0{index + 1}</span></Reveal>)}
        </div>
      </div>
    </section>
  )
}

export function NormalizationPipelineSection() {
  return (
    <section className="landing-section pipeline-section">
      <div className="landing-grid landing-grid-dark" aria-hidden="true" />
      <div className="landing-container">
        <Reveal>
          <SectionIntro
            tone="dark"
            eyebrow="NORMALIZATION PIPELINE"
            title={<>Messy inputs.<br /><em>Comparable outputs.</em></>}
            body="A compensation record only earns a place in the grid after its company, role, level, location, and components have been resolved."
          />
        </Reveal>
        <Reveal className="pipeline-board-wrap" delay={120}>
          <div className="pipeline-board">
            <div className="pipeline-input"><span className="pipeline-label">RAW SUBMISSION</span><strong>Google India Pvt. Ltd.</strong><strong>SWE II</strong><strong>L4</strong><strong>Bangalore</strong><div className="pipeline-money"><span>₹46L base</span><span>₹20L RSU annual</span><span>₹7L bonus</span></div></div>
            <div className="pipeline-stages" role="list" aria-label="Normalization stages">{pipelineStages.map((stage, index) => <div key={stage} className="pipeline-stage" role="listitem" style={{ "--stage-delay": `${index * 100}ms` } as CSSProperties}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage}</strong><i aria-hidden="true" /></div>)}</div>
            <div className="pipeline-output"><span className="pipeline-label">GRID-READY RECORD</span><strong>Google</strong><strong>Software Engineer</strong><strong>L4 <i>→ MID</i></strong><strong>Bengaluru</strong><div className="pipeline-total"><span>₹73L</span><small>TOTAL COMP</small></div></div>
          </div>
          <p className="pipeline-note"><CheckIcon size={16} aria-hidden="true" /> Every step is deterministic, inspectable, and testable.</p>
        </Reveal>
      </div>
    </section>
  )
}

export function DatasetStatsSection() {
  return (
    <section className="landing-section stats-section">
      <div className="landing-container">
        <Reveal>
          <p className="eyebrow">THE DEMO DATASET</p>
          <div className="stats-heading-row"><h2>Enough structure<br /><em>to see the pattern.</em></h2><p>Synthetic demo dataset for engineering evaluation. These numbers describe the product surface, not live platform adoption.</p></div>
        </Reveal>
        <div className="stats-grid">
          <Reveal as="article" className="stat-block"><AnimatedNumber value={20} suffix="+" className="stat-value" /><span>COMPANIES</span><small>company-specific levels</small></Reveal>
          <Reveal as="article" className="stat-block" delay={70}><AnimatedNumber value={6} className="stat-value" /><span>CITIES</span><small>Indian technology hubs</small></Reveal>
          <Reveal as="article" className="stat-block" delay={140}><AnimatedNumber value={5000} suffix="+" className="stat-value" /><span>DEMO RECORDS</span><small>deterministic synthetic rows</small></Reveal>
          <Reveal as="article" className="stat-block" delay={210}><AnimatedNumber value={4} className="stat-value" /><span>CORE ROLES</span><small>shared product vocabulary</small></Reveal>
        </div>
      </div>
    </section>
  )
}

export function MethodologySection() {
  const principles = [
    ["TOTAL COMP", "Base + Annualized Stock + Bonus"],
    ["MEDIAN", "Primary market reference"],
    ["MISSING VALUES", "Stock / Bonus → 0"],
  ]
  return (
    <section className="landing-section methodology-section" id="methodology-preview">
      <div className="landing-container">
        <Reveal>
          <SectionIntro
            eyebrow="METHODOLOGY"
            title={<>Transparent<br /><em>by design.</em></>}
            body="CompGrid documents how compensation is calculated, how levels are mapped, and how demo data is generated."
          />
        </Reveal>
        <div className="methodology-grid">
          {principles.map(([label, value], index) => <Reveal as="article" className="methodology-principle" delay={index * 70} key={label}><span>0{index + 1}</span><p>{label}</p><strong>{value}</strong></Reveal>)}
        </div>
        <Reveal className="methodology-link-wrap" delay={240}><Link className="text-link" href="/methodology">Read methodology <ArrowUpRightIcon size={16} aria-hidden="true" /></Link></Reveal>
      </div>
    </section>
  )
}

export function FinalCTA() {
  return (
    <section className="final-cta-section">
      <div className="landing-grid landing-grid-dark" aria-hidden="true" />
      <div className="final-cta-glow" aria-hidden="true" />
      <div className="landing-container final-cta-inner">
        <Reveal>
          <p className="eyebrow eyebrow-light"><span className="eyebrow-signal" aria-hidden="true" />COMPGRID / NEXT VIEW</p>
          <h2>Compare compensation<br /><em>with context.</em></h2>
          <p className="final-cta-body">See how companies, levels, and compensation structure actually compare.</p>
          <div className="final-cta-actions"><Link className="button button-primary" href="/explore">Explore compensation <ArrowRightIcon size={16} aria-hidden="true" />
          </Link><Link className="button button-ghost" href="/compare">Compare companies</Link></div>
        </Reveal>
      </div>
    </section>
  )
}
