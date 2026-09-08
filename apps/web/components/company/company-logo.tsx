"use client";

import Image from "next/image";
import { useState } from "react";

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
  logoUrl,
  className,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showLogo = Boolean(logoUrl) && !imageFailed;

  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-secondary font-heading text-sm font-bold tracking-tight text-foreground",
        className,
      )}
      aria-hidden="true"
    >
      {showLogo ? (
        <Image
          src={logoUrl!}
          alt=""
          width={48}
          height={48}
          className="size-full object-contain p-2"
          onError={() => setImageFailed(true)}
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
