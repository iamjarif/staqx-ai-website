"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  SectionReveal,
  SectionRevealItem,
} from "@/components/ui/section-reveal";
import { heroContent } from "@/lib/homepage-data";

export function HeroCopy() {
  return (
    <SectionReveal
      hero
      animateOnMount
      className="relative mt-auto w-full"
    >
      <Container
        data-testid="hero-content"
        className="flex w-full min-w-0 flex-col items-start justify-end gap-6 pb-12 pt-24 sm:gap-8 sm:pb-12 sm:pt-32 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:pb-[50px]"
      >
        <h1 className="text-text-primary min-w-0 max-w-full">
          {heroContent.headline.map((line) => (
            <SectionRevealItem
              key={line}
              as="span"
              className="text-display-l block lg:whitespace-nowrap"
            >
              {line}
            </SectionRevealItem>
          ))}
        </h1>

        <SectionRevealItem className="flex w-full max-w-[450px] min-w-0 flex-col gap-4 sm:gap-6 lg:pb-5">
          <p className="text-body-medium lg:text-heading-h5 text-text-secondary lg:leading-[28px]">
            {heroContent.subtext}
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button variant="primary" href="#contact" className="w-full sm:w-auto">
              {heroContent.primaryCta}
            </Button>
            <Button
              variant="secondary"
              showArrow
              href="#services"
              className="w-full sm:w-auto"
            >
              {heroContent.secondaryCta}
            </Button>
          </div>
        </SectionRevealItem>
      </Container>
    </SectionReveal>
  );
}
