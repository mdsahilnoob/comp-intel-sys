"use client";

import { useEffect } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { ErrorPanel } from "@/components/shared/error-panel";

export default function CompaniesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer className="py-16">
      <ErrorPanel
        title="We couldn’t load companies"
        description="The company directory did not respond. Try again, or return to the default listing."
        onRetry={reset}
      />
    </PageContainer>
  );
}
