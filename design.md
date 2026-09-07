# AI Orbit-Inspired Color Palette

## Core Backgrounds

- Page Background: `#000000`
- Primary Surface: `#0A0A0C`
- Secondary Surface: `#0D0D10`
- Elevated Surface: `#111113`
- Hover Surface: `#131316`
- Interactive Surface: `#18181C`

## Borders

- Default Border: `#232326`
- Strong Border: `#3A3A3E`
- Subtle Border: `rgba(35, 35, 38, 0.6)`

## Text

- Primary Text: `#FFFFFF`
- Secondary Text: `#D4D4D8`
- Muted Text: `#A1A1AA`
- Subtle Text: `#71717A`

## Primary Accent

- Purple: `#6E56CF`

## Secondary Accents

- Orange: `#FF6B4A`
- Yellow: `#FFC53D`
- Violet: `#A78BFA`
- Green: `#34D399`
- Sky Blue: `#38BDF8`
- Purple: `#A855F7`
- Teal: `#2DD4BF`
- Pink: `#F472B6`
- Cyan: `#22D3EE`
- Indigo: `#818CF8`
- Amber: `#FBBF24`
- Fuchsia: `#E879F9`

## Recommended Usage

- Main background → `#000000`
- Cards / panels → `#0A0A0C` or `#111113`
- Inputs → `#111113`
- Hover states → `#131316`
- Borders → `#232326`
- Main text → `#FFFFFF`
- Secondary text → `#A1A1AA`
- Muted metadata → `#71717A`
- Main CTA / active state → `#6E56CF`

## CSS Variables

```css
:root {
  --background: #000000;

  --surface-1: #0A0A0C;
  --surface-2: #0D0D10;
  --surface-3: #111113;
  --surface-hover: #131316;
  --surface-interactive: #18181C;

  --border: #232326;
  --border-strong: #3A3A3E;

  --text-primary: #FFFFFF;
  --text-secondary: #D4D4D8;
  --text-muted: #A1A1AA;
  --text-subtle: #71717A;

  --accent: #6E56CF;

  --orange: #FF6B4A;
  --yellow: #FFC53D;
  --violet: #A78BFA;
  --green: #34D399;
  --sky: #38BDF8;
  --purple: #A855F7;
  --teal: #2DD4BF;
  --pink: #F472B6;
  --cyan: #22D3EE;
  --indigo: #818CF8;
  --amber: #FBBF24;
  --fuchsia: #E879F9;
}