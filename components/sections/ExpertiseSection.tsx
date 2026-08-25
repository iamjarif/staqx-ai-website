import { ExpertiseCarousel } from "@/components/sections/ExpertiseCarousel";
import { SectionReveal } from "@/components/ui/section-reveal";

export function ExpertiseSection() {
  return (
    <SectionReveal id="services" className="relative max-lg:py-12">
      <ExpertiseCarousel />
    </SectionReveal>
  );
}
