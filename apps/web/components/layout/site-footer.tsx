import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const productLinks = [
  ["Explore compensation", "/explore"],
  ["Companies", "/companies"],
  ["Compare", "/compare"],
  ["Submit data", "/submit"],
] as const

const learningLinks = [
  ["Methodology", "/methodology"],
  ["Research", "/research"],
] as const

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-border/80 bg-card/45">
      <div className="site-footer-inner mx-auto w-full max-w-7xl px-4 py-12 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <div className="site-footer-grid">
          <div className="footer-brand-block">
            <Link className="footer-brand-link" href="/" aria-label="CompGrid home">
              <span className="footer-logo-mark" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
              <span>CompGrid</span>
            </Link>
            <p className="footer-tagline">Compensation intelligence for clearer career decisions.</p>
            <p className="footer-description">Compare company levels, package composition, and market position in one structured view.</p>
            <span className="footer-data-badge"><i aria-hidden="true" /> Synthetic demo data</span>
          </div>

          <nav className="footer-column" aria-label="Footer product navigation">
            <p className="footer-column-label">Product</p>
            {productLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>

          <nav className="footer-column" aria-label="Footer learning navigation">
            <p className="footer-column-label">Learn</p>
            {learningLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>

          <div className="footer-scope-card">
            <p className="footer-column-label">Data scope</p>
            <p className="footer-scope-title">India <span>/</span> INR <span>/</span> Levels first</p>
            <p className="footer-scope-copy">Every figure is illustrative, synthetic, and included to show how the product works.</p>
            <Link className="footer-scope-link" href="/methodology">Read the methodology <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>CompGrid — Compensation Intelligence</p>
          <p>Illustrative records · level-first comparison · annual INR values</p>
          <p>Synthetic demo dataset for engineering evaluation.</p>
        </div>
      </div>
    </footer>
  )
}
