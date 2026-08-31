import { ExpertiseCarousel } from "@/components/sections/ExpertiseCarousel";
import { SectionReveal } from "@/components/ui/section-reveal";

export function ExpertiseSection() {
  return (
    <SectionReveal
      id="services"
      data-bg-anchor=""
      className="relative py-12 lg:py-40"
    >
      <ExpertiseCarousel />
    </SectionReveal>
  );
}
