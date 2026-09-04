import type { Metadata } from "next"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeading } from "@/components/layout/section-heading"
import { SubmissionForm } from "@/components/submit/submission-form"
import { getCatalogOptionsFromRepository } from "@/server/repositories/catalog-repository"

export const metadata: Metadata = { title: "Add compensation data" }

export default async function SubmitPage() { const catalog = await getCatalogOptionsFromRepository(); return <PageContainer className="max-w-4xl pb-16 pt-10 sm:pt-14"><SectionHeading eyebrow="Contribute" title="Make the market more legible" description="Share one annual INR package. We normalize the components, map the company level, and keep the record anonymous." /><div className="mt-8"><SubmissionForm catalog={catalog} /></div></PageContainer> }
