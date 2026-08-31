import Image from "next/image";

import { SecurityAccordion } from "@/components/sections/SecurityAccordion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import {
  SectionReveal,
  SectionRevealItem,
} from "@/components/ui/section-reveal";

export function SecuritySection() {
  return (
    <SectionReveal className="relative overflow-x-clip py-12 lg:py-40">
      <Container className="relative flex flex-col gap-8 md:gap-16">
        <SectionRevealItem>
          <SectionHeader
            split
            className="max-w-none lg:max-w-[300px]"
            eyebrow="IP SECURITY"
            title={
              <>
                Your IP never{" "}
                <br className="hidden lg:block" />
                leaves the <span className="text-text-primary">ODC.</span>
              </>
            }
            titleClassName="lg:whitespace-nowrap"
            description="Enterprise-grade protection at our Bangladesh offshore development center."
          />
        </SectionRevealItem>

        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-20">
          <SectionRevealItem className="w-full min-w-0 lg:w-[588px] lg:shrink-0">
            <SecurityAccordion />
          </SectionRevealItem>

          <SectionRevealItem className="relative h-[220px] w-full overflow-hidden rounded-lg sm:h-[280px] lg:h-[496px] lg:w-[532px] lg:shrink-0">
            <Image
              src="/images/homepage/odc-server-room.jpg"
              alt="StaqX.ai offshore development center server room"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 532px"
              quality={75}
            />
          </SectionRevealItem>
        </div>
      </Container>
    </SectionReveal>
  );
}
