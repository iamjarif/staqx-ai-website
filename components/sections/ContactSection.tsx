import Image from "next/image";

import { Footer } from "@/components/layout/Footer";
import { ContactForm, ContactInfo } from "@/components/sections/ContactForm";
import { Container } from "@/components/ui/container";
import {
  SectionReveal,
  SectionRevealItem,
} from "@/components/ui/section-reveal";

export function ContactSection() {
  return (
    <SectionReveal
      id="contact"
      className="flex flex-col items-center gap-8 py-12 sm:gap-16 lg:gap-20 lg:pt-[120px] lg:pb-20"
    >
      <Container>
        <div className="bg-surface-card relative overflow-hidden rounded-lg p-6 sm:p-8 md:p-12 lg:p-[100px]">
          <Image
            src="/icons/homepage/contact-ellipse.svg"
            alt=""
            width={1336}
            height={1336}
            className="pointer-events-none absolute top-[200px] left-[-704px] hidden size-[1336px] max-w-none lg:block"
            aria-hidden
            unoptimized
          />
          <Image
            src="/icons/homepage/contact-decor.svg"
            alt=""
            width={453}
            height={457}
            className="pointer-events-none absolute top-[-301px] left-[867px] hidden h-[457px] w-[453px] max-w-none lg:block"
            aria-hidden
            unoptimized
          />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
            <SectionRevealItem className="lg:w-[351px] lg:shrink-0">
              <ContactInfo />
            </SectionRevealItem>
            <SectionRevealItem className="w-full lg:w-[500px] lg:shrink-0">
              <ContactForm />
            </SectionRevealItem>
          </div>
        </div>
      </Container>
      <SectionRevealItem className="w-full">
        <Footer />
      </SectionRevealItem>
    </SectionReveal>
  );
}
