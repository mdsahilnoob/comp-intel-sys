import type { Metadata } from "next"

import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: { absolute: "CompGrid — Compensation Intelligence" },
  description:
    "Compare compensation across companies, levels, roles, and locations with structured base salary, stock, bonus, and total compensation insights.",
  openGraph: {
    title: "CompGrid — Compensation Intelligence",
    description:
      "Compare compensation across companies, levels, roles, and locations with structured base salary, stock, bonus, and total compensation insights.",
    type: "website",
  },
}

export default function Page() {
  return <LandingPage />
}
