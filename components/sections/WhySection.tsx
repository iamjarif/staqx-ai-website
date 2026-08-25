import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import {
  SectionReveal,
  SectionRevealItem,
} from "@/components/ui/section-reveal";
import { whyCards } from "@/lib/homepage-data";

export function WhySection() {
  return (
    <SectionReveal className="py-12 lg:py-40">
      <Container className="flex flex-col gap-8 md:gap-16">
        <SectionRevealItem>
          <SectionHeader
            eyebrow="WHY BOSTON SEMICONDUCTOR"
            title={
              <>
                <span className="text-text-primary">Built for chip teams</span>{" "}
                that can&apos;t afford a leak.
              </>
            }
            className="lg:mx-auto lg:items-center lg:text-center"
          />
        </SectionRevealItem>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyCards.map((card) => (
            <SectionRevealItem
              key={card.eyebrow}
              as="article"
              className="bg-surface-card flex flex-col gap-4 rounded-lg p-6 sm:p-8 lg:p-[42px]"
            >
              <p className="text-code text-primary-500">{card.eyebrow}</p>
              <h3 className="text-heading-h4 text-text-primary">{card.title}</h3>
              <p className="text-body-small text-text-tertiary leading-[1.45]">
                {card.description}
              </p>
            </SectionRevealItem>
          ))}
        </div>
      </Container>
    </SectionReveal>
  );
}
