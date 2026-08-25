"use client";

import {
  CheckFat,
  Cpu,
  Cube,
  CubeTransparent,
  Network,
  Stack,
  WaveSine,
  type Icon,
} from "@phosphor-icons/react";
import { useLenis } from "lenis/react";
import {
  cubicBezier,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionRevealItem } from "@/components/ui/section-reveal";
import { services } from "@/lib/homepage-data";
import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";

const serviceIcons: Record<string, Icon> = {
  "3d-ic": Stack,
  photonics: WaveSine,
  "rf-analog": Network,
  tcad: CubeTransparent,
  quantum: Cpu,
  "physical-design": Cube,
  ams: CheckFat,
};

const trackPaddingClass =
  "pl-[max(1rem,calc((100vw-1264px)/2+1rem))] pr-4 sm:pl-[max(1.5rem,calc((100vw-1264px)/2+1.5rem))] sm:pr-6 lg:pl-[max(2rem,calc((100vw-1264px)/2+2rem))] lg:pr-8";

const carouselEase = cubicBezier(0.76, 0, 0.24, 1);
const CAROUSEL_SCROLL_VH = 250;

function ServiceIcon({ id }: { id: string }) {
  const IconComponent = serviceIcons[id];

  if (!IconComponent) return null;

  return (
    <IconComponent
      weight="duotone"
      className="size-7 lg:size-11"
      color="var(--color-primary-500)"
      aria-hidden
    />
  );
}

function ServiceCard({
  id,
  title,
  description,
  className,
}: {
  id: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex max-w-full snap-start flex-col gap-6 overflow-hidden rounded-lg bg-surface-card p-6 sm:gap-8 sm:p-8 lg:w-[min(470px,calc(100vw-2rem))] lg:shrink-0 lg:p-[42px]",
        className
      )}
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-border-subtle p-3 sm:size-16 sm:p-4 lg:size-[86px] lg:p-[21px]">
        <ServiceIcon id={id} />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-heading-h4 text-text-primary">
          {title}
        </h3>
        <p className="text-body-small text-text-tertiary leading-[1.45]">
          {description}
        </p>
      </div>
    </article>
  );
}

function ExpertiseHeader({
  subtitleRef,
}: {
  subtitleRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <SectionRevealItem>
      <SectionHeader
        split
        eyebrow="CORE SERVICES"
        title={
          <>
            Our <span>Expertise.</span>
          </>
        }
        titleClassName="lg:whitespace-nowrap"
        description="Full-stack semiconductor design capability, mapped the way our engineers actually think about a chip."
        descriptionRef={subtitleRef}
      />
    </SectionRevealItem>
  );
}

function ExpertiseCarouselScrollFallback() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    const container = scrollRef.current;
    if (!container) return;

    dragState.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
    };
    setIsDragging(true);
    container.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const container = scrollRef.current;
    if (!container || !dragState.current.isDragging) return;

    const deltaX = event.clientX - dragState.current.startX;
    container.scrollLeft = dragState.current.scrollLeft - deltaX;
  }, []);

  const endDrag = useCallback((event: React.PointerEvent) => {
    const container = scrollRef.current;
    if (!container || !dragState.current.isDragging) return;

    dragState.current.isDragging = false;
    setIsDragging(false);
    container.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <div className="py-16 lg:py-24">
      <Container className="flex flex-col gap-10 lg:gap-16">
        <ExpertiseHeader />
        <SectionRevealItem className="w-full">
          <div
            ref={scrollRef}
            className={cn(
              "-mx-4 overflow-x-auto overscroll-x-contain scroll-smooth sm:-mx-6 lg:-mx-8",
              "snap-x snap-mandatory",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div className={cn("flex w-max gap-6", trackPaddingClass)}>
              {services.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </SectionRevealItem>
      </Container>
    </div>
  );
}

function ExpertiseScrollCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const scrollProgress = useMotionValue(0);

  const x = useTransform(
    scrollProgress,
    [0, 1],
    [0, -scrollDistance],
    { ease: carouselEase }
  );

  const updateProgress = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const top = container.getBoundingClientRect().top;
    const pinDistance = container.offsetHeight - window.innerHeight;

    if (pinDistance <= 0) {
      scrollProgress.set(top <= 0 ? 1 : 0);
      return;
    }

    scrollProgress.set(Math.min(1, Math.max(0, -top / pinDistance)));
  }, [scrollProgress]);

  useLenis(updateProgress);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const subtitle = subtitleRef.current;
      if (!track || !subtitle) return;

      const lastCard = track.lastElementChild as HTMLElement | null;
      if (!lastCard) return;

      const subtitleRight = subtitle.getBoundingClientRect().right;
      const currentTranslate = x.get();
      const lastCardRightAtStart =
        lastCard.getBoundingClientRect().right - currentTranslate;

      setScrollDistance(Math.max(0, lastCardRightAtStart - subtitleRight));
    };

    measure();
    updateProgress();
    window.addEventListener("resize", measure);
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress, x]);

  useEffect(() => {
    updateProgress();
  }, [scrollDistance, updateProgress]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative"
      style={{ height: `calc(100vh + ${CAROUSEL_SCROLL_VH}vh)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="flex w-full flex-col gap-10 lg:gap-16">
          <Container className="shrink-0">
            <ExpertiseHeader subtitleRef={subtitleRef} />
          </Container>

          <SectionRevealItem className="w-full overflow-hidden">
            <motion.div
              ref={trackRef}
              className={cn(
                "flex w-max gap-6 will-change-transform",
                trackPaddingClass
              )}
              style={{ x }}
            >
              {services.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </motion.div>
          </SectionRevealItem>
        </div>
      </div>
    </div>
  );
}

function ExpertiseStacked() {
  return (
    <div>
      <Container className="flex flex-col gap-8">
        <ExpertiseHeader />
        <div className="flex flex-col gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
              className="w-full min-w-0 shrink"
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export function ExpertiseCarousel() {
  const isDesktop = useIsDesktop();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (!isDesktop) {
    return <ExpertiseStacked />;
  }

  if (prefersReducedMotion) {
    return <ExpertiseCarouselScrollFallback />;
  }

  return <ExpertiseScrollCarousel />;
}
