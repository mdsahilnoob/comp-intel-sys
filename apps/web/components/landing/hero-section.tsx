import Link from "next/link"

import { HeroCompensationVisual } from "@/components/landing/hero-compensation-visual"
import { Reveal } from "@/components/landing/motion/reveal"
import { ArrowRightIcon } from "@/components/ui/arrow-right"
import { ArrowUpRightIcon } from "@/components/ui/arrow-up-right"

export function HeroSection() {
  return (
    <section className="landing-hero" id="top">
      <div className="landing-grid landing-grid-hero" aria-hidden="true" />
      <div className="landing-hero-glow landing-hero-glow-left" aria-hidden="true" />
      <div className="landing-hero-glow landing-hero-glow-right" aria-hidden="true" />
      <div className="landing-container landing-hero-inner">
        <div className="hero-copy">
          <Reveal className="hero-copy-reveal" delay={40}>
            <p className="eyebrow eyebrow-light">
              <span className="eyebrow-signal" aria-hidden="true" />
              COMPENSATION INTELLIGENCE
            </p>
          </Reveal>
          <Reveal className="hero-heading-reveal" delay={100}>
            <h1>Know what you’re really worth.</h1>
          </Reveal>
          <Reveal className="hero-description-reveal" delay={180}>
            <p className="hero-description">
              Compare base salary, annualized stock, bonus, and total compensation
              across companies, roles, levels, and locations.
            </p>
          </Reveal>
          <Reveal className="hero-actions-reveal" delay={260}>
            <div className="hero-actions">
              <Link className="button button-primary" href="/explore">
                Explore compensation
                <ArrowRightIcon size={16} aria-hidden="true" />
              </Link>
              <Link className="button button-ghost" href="/compare">
                Compare companies
              </Link>
            </div>
          </Reveal>
          <Reveal className="hero-note-reveal" delay={330}>
            <p className="hero-note">
              <span aria-hidden="true">↳</span>
              Structured around company levels, roles, locations, and compensation
              components.
            </p>
          </Reveal>
        </div>
        <Reveal className="hero-visual-reveal" delay={340}>
          <HeroCompensationVisual />
        </Reveal>
      </div>
      <Link href="#product" className="hero-scroll-cue">
        <span>Scroll to inspect the grid</span>
        <ArrowUpRightIcon size={16} aria-hidden="true" />
      </Link>
      <div className="hero-footnote" aria-hidden="true">
        <span>CG / 001</span>
        <span>INDIA · INR · 2026</span>
      </div>
    </section>
  )
}
