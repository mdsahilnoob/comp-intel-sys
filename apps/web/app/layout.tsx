import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import "./landing.css"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
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
    type: "website",
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
      className={cn("antialiased", fontSans.variable, geistMono.variable)}
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
