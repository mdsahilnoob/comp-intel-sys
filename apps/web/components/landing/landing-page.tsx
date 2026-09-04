import { CareerProgressionSection, CompanyComparisonSection, CompensationTicker, CompositionSection, DataIntelligenceSection, DatasetStatsSection, FinalCTA, LevelMappingSection, MethodologySection, NormalizationPipelineSection, ProductPreviewSection, StorySection } from "@/components/landing/landing-sections"
import { HeroSection } from "@/components/landing/hero-section"

export function LandingPage() {
  return (
    <div className="landing-page">
      <HeroSection />
      <CompensationTicker />
      <LevelMappingSection />
      <CompositionSection />
      <ProductPreviewSection />
      <StorySection />
      <CompanyComparisonSection />
      <CareerProgressionSection />
      <DataIntelligenceSection />
      <NormalizationPipelineSection />
      <DatasetStatsSection />
      <MethodologySection />
      <FinalCTA />
    </div>
  )
}
