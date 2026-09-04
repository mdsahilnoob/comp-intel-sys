"use client"

import { useEffect } from "react"

import { PageContainer } from "@/components/layout/page-container"
import { ErrorPanel } from "@/components/shared/error-panel"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return <PageContainer className="py-16"><ErrorPanel title="The explorer needs another try" description="The data request did not complete. Try again, or return to the default market view." onRetry={reset} /></PageContainer>
}
