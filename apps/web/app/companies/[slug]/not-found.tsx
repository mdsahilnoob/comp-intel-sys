import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <PageContainer className="py-16">
      <EmptyState
        title="Company not found"
        description="That company is not in the current AI Companies catalog."
        clearHref="/companies"
        actionLabel="Browse all companies"
      />
    </PageContainer>
  );
}
