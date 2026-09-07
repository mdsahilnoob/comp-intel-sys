import { ArrowUpRight, Box } from "lucide-react";

import type { AiProductDefinition } from "@/server/ai-companies";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductCard({ product }: { product: AiProductDefinition }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
            <Box className="size-4" aria-hidden="true" />
          </span>
          <Badge variant="outline">{product.category}</Badge>
        </div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 pt-0">
        <p className="text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>
        {product.url ? (
          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Open product
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}
