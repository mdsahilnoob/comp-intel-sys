import { PageContainer } from "@/components/layout/page-container"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() { return <PageContainer className="space-y-6 pb-16 pt-12"><Skeleton className="h-28 w-full max-w-2xl" /><Skeleton className="h-36 w-full" /><div className="grid gap-3 sm:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28" />)}</div><Skeleton className="h-[28rem] w-full" /></PageContainer> }
