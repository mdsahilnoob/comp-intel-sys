import { cn } from "@/lib/utils";

function getInitials(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function CompanyLogo({
  name,
  className,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-secondary font-heading text-sm font-bold tracking-tight text-foreground",
        className,
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
