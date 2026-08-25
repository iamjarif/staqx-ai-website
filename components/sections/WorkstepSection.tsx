import { WorkstepCarousel } from "@/components/sections/WorkstepCarousel";
import { SectionReveal } from "@/components/ui/section-reveal";

export function WorkstepSection() {
  return (
    <SectionReveal className="relative max-lg:py-12">
      <WorkstepCarousel />
    </SectionReveal>
  );
}
