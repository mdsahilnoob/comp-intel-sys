# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are engineers and candidates evaluating compensation across Indian technology companies, especially when comparing an offer or planning a career move. This audience inference comes from the landing brief and existing explorer flows.

## Product Purpose

CompGrid helps people compare compensation across companies, company-specific levels, roles, locations, and compensation components. Success means a visitor can understand a package in context and reach the explorer or comparison flow quickly.

## Positioning

CompGrid is level-first compensation intelligence: it keeps raw company levels visible while mapping them directionally to a shared career ladder, then compares base salary, annualized stock, bonus, total compensation, and percentiles together.

## Operating Context

The product is public and read-heavy. Visitors explore filtered compensation records, inspect company pages, compare up to three company levels, read methodology and research notes, or submit an anonymous INR package. The landing page is the public entry point; `/explore` is the working product surface.

## Capabilities and Constraints

- Existing Next.js App Router application with PostgreSQL/Prisma services and a deterministic demo repository when no database is configured.
- Money is integer INR; total compensation is derived from base + annualized stock + annual bonus.
- Missing stock and bonus default to zero on the server.
- Canonical level mappings are simplified directional demo mappings, not authoritative equivalencies.
- No authentication, job listings, social features, chat, or payment flows.
- All landing-page figures must be labeled synthetic or illustrative demo data.

## Brand Commitments

The product name is CompGrid. The core message is “Know what you’re really worth.” The landing brief requires a premium technology/data-product direction: very dark hero, warm off-white content surfaces, restrained blue/cyan accent, technical grids, thin borders, strong typography, structured compensation visuals, purposeful performant motion, and no generic AI or crypto aesthetics.

## Evidence on Hand

The repository contains deterministic synthetic compensation data, existing explorer/company/comparison/submission/methodology/research routes, and working API/service tests. There are no verified live salary records, customer logos, adoption metrics, testimonials, or real-world compensation claims to use.

## Product Principles

1. Levels before titles.
2. Composition before a single salary number.
3. Preserve raw context while normalizing comparisons.
4. Show uncertainty and methodology beside the metric.
5. Keep the product data-first, fast, and inspectable.

## Accessibility & Inclusion

The web experience must work at mobile and desktop widths, maintain keyboard-visible focus states and readable contrast, provide semantic alternatives for data visualizations, and respect `prefers-reduced-motion`.
