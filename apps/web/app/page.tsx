import type { Metadata } from "next"

import { LandingPage } from "@/components/landing/landing-page"
import { siteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: { absolute: "CompGrid — Compensation Intelligence" },
  description:
    "Compare compensation across companies, levels, roles, and locations with structured base salary, stock, bonus, and total compensation insights.",
  openGraph: {
    title: "CompGrid — Compensation Intelligence",
    description:
      "Compare compensation across companies, levels, roles, and locations with structured base salary, stock, bonus, and total compensation insights.",
    url: siteUrl,
    siteName: "CompGrid",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CompGrid compensation intelligence overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CompGrid — Compensation Intelligence",
    description:
      "Compare compensation across companies, levels, roles, and locations with structured base salary, stock, bonus, and total compensation insights.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
}

export default function Page() {
  return <LandingPage />
}
