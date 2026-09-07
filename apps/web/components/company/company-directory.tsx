import type { AiCompanyDirectoryEntry } from "@/server/ai-companies";
import { CompanyCard } from "@/components/company/company-card";

export function CompanyDirectory({
  companies,
}: {
  companies: AiCompanyDirectoryEntry[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
