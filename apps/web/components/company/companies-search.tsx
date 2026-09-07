"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Command,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { isCompanySearchShortcut } from "@/lib/company-search";
import type {
  AiCompanyCategory,
  AiCompanyCountryCode,
  AiCompanyQuery,
  AiCompanyStatus,
} from "@/server/ai-companies";

type SearchDraft = Pick<
  AiCompanyQuery,
  "search" | "category" | "country" | "status" | "sort"
>;

const sortOptions = [
  { value: "popular" as const, label: "Popular" },
  { value: "newest" as const, label: "Newest" },
  { value: "name" as const, label: "Name A–Z" },
  { value: "products" as const, label: "Most products" },
];

function getDraft(query: AiCompanyQuery): SearchDraft {
  return {
    search: query.search ?? "",
    category: query.category,
    country: query.country,
    status: query.status,
    sort: query.sort,
  };
}

type CountryOption = {
  code: AiCompanyCountryCode;
  label: string;
};

type StatusOption = {
  value: AiCompanyStatus;
  label: string;
};

function FilterChoice({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
    >
      {active ? <Check aria-hidden="true" className="size-3.5" /> : null}
      {children}
    </button>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export function CompaniesSearch({
  query,
  categories,
  countryOptions,
  statusOptions,
}: {
  query: AiCompanyQuery;
  categories: AiCompanyCategory[];
  countryOptions: ReadonlyArray<CountryOption>;
  statusOptions: ReadonlyArray<StatusOption>;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SearchDraft>(() => getDraft(query));

  const openSearch = useCallback(() => {
    setDraft(getDraft(query));
    setOpen(true);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isCompanySearchShortcut(event)) {
        event.preventDefault();
        openSearch();
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  const hasActiveFilters = Boolean(
    draft.search || draft.category || draft.country || draft.status,
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open company search"
        onClick={openSearch}
        className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-border bg-card px-3 text-left text-xs font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">Search companies and filters</span>
        <kbd className="hidden shrink-0 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          Ctrl K
        </kbd>
      </button>

      {hasActiveFilters ? (
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Active company filters">
          {draft.search ? (
            <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground">
              “{draft.search}”
            </span>
          ) : null}
          {draft.category ? (
            <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground">
              {categories.find((item) => item.slug === draft.category)?.name ??
                draft.category}
            </span>
          ) : null}
          {draft.country ? (
            <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground">
              {countryOptions.find((item) => item.code === draft.country)?.label ??
                draft.country}
            </span>
          ) : null}
          {draft.status ? (
            <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground">
              {statusOptions.find((item) => item.value === draft.status)?.label ??
                draft.status}
            </span>
          ) : null}
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 pt-[12vh] backdrop-blur-sm sm:p-6 sm:pt-[16vh]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-search-title"
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Command aria-hidden="true" className="size-4 text-primary" />
              <div className="min-w-0 flex-1">
                <p id="company-search-title" className="text-sm font-semibold">
                  Search companies and filters
                </p>
                <p className="text-xs text-muted-foreground">
                  Search by company, product, capability, or location.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close company search"
                onClick={() => setOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <form action="/companies" method="get" className="grid gap-5 p-4 sm:p-5">
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  autoFocus
                  name="search"
                  value={draft.search}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      search: event.target.value,
                    }))
                  }
                  placeholder="Try OpenAI, robotics, video, or API…"
                  aria-label="Search companies and filters"
                  className="h-12 pl-10 pr-4"
                />
              </div>

              <div className="grid gap-4">
                <FilterGroup label="Category">
                  <FilterChoice
                    active={!draft.category}
                    onClick={() =>
                      setDraft((current) => ({ ...current, category: undefined }))
                    }
                  >
                    All categories
                  </FilterChoice>
                  {categories.map((category) => (
                    <FilterChoice
                      key={category.slug}
                      active={draft.category === category.slug}
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          category: category.slug,
                        }))
                      }
                    >
                      {category.name}
                      <span className="text-[10px] opacity-70">{category.count}</span>
                    </FilterChoice>
                  ))}
                </FilterGroup>

                <FilterGroup label="Country">
                  <FilterChoice
                    active={!draft.country}
                    onClick={() =>
                      setDraft((current) => ({ ...current, country: undefined }))
                    }
                  >
                    All countries
                  </FilterChoice>
                  {countryOptions.map((country) => (
                    <FilterChoice
                      key={country.code}
                      active={draft.country === country.code}
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          country: country.code,
                        }))
                      }
                    >
                      {country.label}
                    </FilterChoice>
                  ))}
                </FilterGroup>

                <FilterGroup label="Status">
                  <FilterChoice
                    active={!draft.status}
                    onClick={() =>
                      setDraft((current) => ({ ...current, status: undefined }))
                    }
                  >
                    All statuses
                  </FilterChoice>
                  {statusOptions.map((status) => (
                    <FilterChoice
                      key={status.value}
                      active={draft.status === status.value}
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          status: status.value,
                        }))
                      }
                    >
                      {status.label}
                    </FilterChoice>
                  ))}
                </FilterGroup>

                <FilterGroup label="Sort">
                  {sortOptions.map((option) => (
                    <FilterChoice
                      key={option.value}
                      active={draft.sort === option.value}
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          sort: option.value,
                        }))
                      }
                    >
                      {option.label}
                    </FilterChoice>
                  ))}
                </FilterGroup>
              </div>

              {draft.category ? (
                <input type="hidden" name="category" value={draft.category} />
              ) : null}
              {draft.country ? (
                <input type="hidden" name="country" value={draft.country} />
              ) : null}
              {draft.status ? (
                <input type="hidden" name="status" value={draft.status} />
              ) : null}
              {draft.sort !== "popular" ? (
                <input type="hidden" name="sort" value={draft.sort} />
              ) : null}

              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/companies"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                >
                  Clear all
                </Link>
                <button
                  type="submit"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                >
                  <SlidersHorizontal aria-hidden="true" className="size-4" />
                  Search directory
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
