import type { Metadata } from "next"

import "./globals.css"
import "./landing.css"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { siteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CompGrid — Compensation Intelligence",
    template: "%s | CompGrid",
  },
  description:
    "Compare compensation across companies, levels, roles, and locations with structured base salary, stock, bonus, and total compensation insights.",
  openGraph: {
    title: "CompGrid — Compensation Intelligence",
    description:
      "Compare compensation across companies, levels, roles, and locations with structured base salary, stock, bonus, and total compensation insights.",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="antialiased"
    >
      <body>
        <ThemeProvider>
          <SiteHeader />
          <main className="min-h-[calc(100svh-8rem)]">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
