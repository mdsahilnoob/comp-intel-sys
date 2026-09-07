"use client";

import { useState } from "react";

import { GooeyInput } from "@/components/ui/gooey-input";
import type { AiCompanyQuery } from "@/server/ai-companies";

export function CompanyDirectorySearch({
  query,
}: {
  query: AiCompanyQuery;
}) {
  const [search, setSearch] = useState(query.search ?? "");

  return (
    <form
      action="/companies"
      method="get"
      aria-label="Company search"
      className="flex flex-wrap items-center gap-3"
    >
      <GooeyInput
        placeholder="Search companies..."
        value={search}
        onValueChange={setSearch}
        collapsedWidth={190}
        expandedWidth={280}
        className="justify-start"
        classNames={{
          filterWrap: "justify-start",
          buttonRow: "justify-start",
        }}
      />
      {search ? <input type="hidden" name="search" value={search} /> : null}
      {query.category ? (
        <input type="hidden" name="category" value={query.category} />
      ) : null}
      {query.country ? (
        <input type="hidden" name="country" value={query.country} />
      ) : null}
      <button
        type="submit"
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
      >
        Search
      </button>
    </form>
  );
}
