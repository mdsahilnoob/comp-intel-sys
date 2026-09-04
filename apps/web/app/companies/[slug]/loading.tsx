import { PageContainer } from "@/components/layout/page-container"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() { return <PageContainer className="space-y-5 py-12"><Skeleton className="h-8 w-36" /><Skeleton className="h-28 w-2/3" /><Skeleton className="h-16 w-full" /><Skeleton className="h-80 w-full" /></PageContainer> }
