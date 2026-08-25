"use client";

import { CaretDown, CheckCircle } from "@phosphor-icons/react";
import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionRevealItem } from "@/components/ui/section-reveal";
import { workstepSlides, type WorkstepSlide } from "@/lib/homepage-data";
import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";

const WORKSTEP_STEP_VH = 80;
const WORKSTEP_SCROLL_VH = WORKSTEP_STEP_VH * workstepSlides.length;

const WORKSTEP_BACKGROUNDS = [
  "/images/homepage/workstep-bg-01.jpg",
  "/images/homepage/workstep-bg-02.jpg",
  "/images/homepage/workstep-bg-03.jpg",
] as const;

function getStepFromProgress(progress: number) {
  return Math.min(
    workstepSlides.length - 1,
    Math.floor(progress * workstepSlides.length)
  );
}

function getBackgroundOpacity(slideProgress: number, index: number) {
  const maxIndex = workstepSlides.length - 1;
  const clamped = Math.min(Math.max(slideProgress, 0), maxIndex);
  const currentIndex = Math.floor(clamped);
  const fraction = clamped - currentIndex;

  if (index === currentIndex) return 1 - fraction;
  if (index === currentIndex + 1) return fraction;
  return 0;
}

function CheckItem({ text, stacked = false }: { text: string; stacked?: boolean }) {
  return (
    <div
      className={cn(
        "border-border-default flex items-start gap-3 border-t first:border-t-0 first:pt-0",
        stacked ? "py-3 first:mt-1" : "items-center py-3"
      )}
    >
      <CheckCircle
        size={16}
        weight="duotone"
        color="var(--color-primary-500)"
        className="mt-0.5 shrink-0"
        aria-hidden
      />
      <span
        className={cn(
          "text-text-tertiary",
          stacked
            ? "text-body-medium leading-[1.5]"
            : "text-body-small"
        )}
      >
        {text}
      </span>
    </div>
  );
}

function WorkstepNumber({
  number,
  compact = false,
}: {
  number: string;
  compact?: boolean;
}) {
  return (
    <p
      className={
        compact
          ? "text-heading-h2 text-primary-500"
          : "text-display-m text-primary-500"
      }
    >
      {number}
    </p>
  );
}

function WorkstepStackedCard({ slide }: { slide: WorkstepSlide }) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const panelId = `workstep-panel-${slide.number}`;

  return (
    <article className="bg-surface-card rounded-lg p-6">
      <button
        type="button"
        className="flex min-h-11 w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <div className="flex min-w-0 flex-col gap-3">
          <WorkstepNumber number={slide.number} compact />
          <h3 className="text-heading-h4 text-text-primary">{slide.title}</h3>
        </div>
        <CaretDown
          size={20}
          weight="bold"
          className={cn(
            "text-text-tertiary mt-1 shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            className="overflow-hidden"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { height: "auto", opacity: 1 }
            }
            exit={
              shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-4 pt-4">
              <p className="text-body-medium text-text-secondary leading-[1.55]">
                {slide.description}
              </p>
              <div className="flex flex-col pt-1">
                {slide.items.map((item) => (
                  <CheckItem key={item} text={item} stacked />
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function WorkstepCard({
  slide,
  isActive,
}: {
  slide: WorkstepSlide;
  isActive: boolean;
}) {
  return (
    <article
      className={cn(
        "bg-surface-overlay flex h-[380px] w-full shrink-0 flex-col rounded-lg p-5 backdrop-blur-[25px] sm:h-[440px] sm:p-8 lg:h-[528px] lg:p-[38px]",
        !isActive && "pointer-events-none"
      )}
    >
      <div className="flex flex-col gap-5 sm:gap-8">
        <WorkstepNumber number={slide.number} />
        <div className="flex flex-col gap-5 sm:gap-7">
          <h3 className="text-heading-h4 text-text-primary">{slide.title}</h3>
          <p className="text-body-small text-text-secondary leading-[1.45]">
            {slide.description}
          </p>
          <div className="flex flex-col">
            {slide.items.map((item) => (
              <CheckItem key={item} text={item} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function WorkstepBackgroundLayer({
  src,
  index,
  slideProgress,
}: {
  src: string;
  index: number;
  slideProgress: MotionValue<number>;
}) {
  const opacity = useTransform(slideProgress, (progress) =>
    getBackgroundOpacity(progress, index)
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ opacity }}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 1264px) 100vw, 1264px"
        quality={70}
      />
    </motion.div>
  );
}

function WorkstepBackgroundStatic({ slideProgress }: { slideProgress: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {WORKSTEP_BACKGROUNDS.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: getBackgroundOpacity(slideProgress, index) }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1264px) 100vw, 1264px"
            quality={70}
          />
        </div>
      ))}
    </div>
  );
}

function WorkstepPanel({
  children,
  slideProgress,
}: {
  children: React.ReactNode;
  slideProgress: MotionValue<number> | number;
}) {
  return (
    <div className="relative flex w-full min-w-0 flex-col items-start justify-between gap-8 overflow-hidden rounded-lg p-5 sm:gap-12 sm:p-8 lg:flex-row lg:items-center lg:p-16">
      {typeof slideProgress === "number" ? (
        <WorkstepBackgroundStatic slideProgress={slideProgress} />
      ) : (
        WORKSTEP_BACKGROUNDS.map((src, index) => (
          <WorkstepBackgroundLayer
            key={src}
            src={src}
            index={index}
            slideProgress={slideProgress}
          />
        ))
      )}

      <SectionRevealItem className="relative z-10 max-w-[420px]">
        <SectionHeader
          eyebrow="UNDER THE FLOORPLAN"
          title={
            <>
              How Each Block
              <br />
              Actually <span>Gets Built.</span>
            </>
          }
          description="The toolchains, nodes, and signoff criteria behind each service area."
        />
      </SectionRevealItem>

      <SectionRevealItem className="relative z-10 w-full lg:w-[587px]">
        {children}
      </SectionRevealItem>
    </div>
  );
}

function WorkstepCarouselScrollFallback() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardHeight = container.clientHeight;
    container.scrollTo({
      top: index * cardHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardHeight = container.clientHeight;
      if (!cardHeight) return;

      const progress = container.scrollTop / cardHeight;
      const maxProgress = workstepSlides.length - 1;
      setSlideProgress(Math.min(maxProgress, Math.max(0, progress)));
      setActiveIndex(
        Math.min(workstepSlides.length - 1, Math.round(progress))
      );
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % workstepSlides.length;
        scrollToIndex(next);
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isVisible, scrollToIndex]);

  return (
    <div className="py-16 lg:py-24">
      <Container ref={rootRef}>
        <WorkstepPanel slideProgress={slideProgress}>
          <div className="h-[380px] overflow-hidden sm:h-[440px] lg:h-[528px]">
            <div
              ref={scrollRef}
              className="flex h-full snap-y snap-mandatory flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {workstepSlides.map((slide, index) => (
                <WorkstepCard
                  key={slide.number}
                  slide={slide}
                  isActive={index === activeIndex}
                />
              ))}
            </div>
          </div>
        </WorkstepPanel>
      </Container>
    </div>
  );
}

function WorkstepScrollCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideHeightRef = useRef(528);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollProgress = useMotionValue(0);
  const slideHeight = useMotionValue(528);
  const targetY = useMotionValue(0);
  const y = useSpring(targetY, { stiffness: 280, damping: 34, mass: 0.85 });
  const backgroundSlideProgress = useTransform([y, slideHeight], (values) => {
    const [yValue, height] = values as [number, number];
    if (!height) return 0;

    return Math.min(
      workstepSlides.length - 1,
      Math.max(0, -yValue / height)
    );
  });

  const updateProgress = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const top = container.getBoundingClientRect().top;
    const pinDistance = container.offsetHeight - window.innerHeight;
    const slideHeight = slideHeightRef.current;

    if (pinDistance <= 0) {
      const progress = top <= 0 ? 1 : 0;
      scrollProgress.set(progress);
      const step = getStepFromProgress(progress);
      targetY.set(-step * slideHeight);
      setActiveIndex(step);
      return;
    }

    const progress = Math.min(1, Math.max(0, -top / pinDistance));
    scrollProgress.set(progress);
    const step = getStepFromProgress(progress);
    targetY.set(-step * slideHeight);
    setActiveIndex(step);
  }, [scrollProgress, targetY]);

  useLenis(updateProgress);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;

      const firstSlide = track.firstElementChild as HTMLElement | null;
      if (!firstSlide) return;

      slideHeightRef.current = firstSlide.offsetHeight;
      slideHeight.set(firstSlide.offsetHeight);
    };

    measure();
    updateProgress();
    window.addEventListener("resize", measure);
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("resize", updateProgress);
    };
  }, [slideHeight, updateProgress]);

  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative"
      style={{ height: `calc(100vh + ${WORKSTEP_SCROLL_VH}vh)` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Container className="w-full">
          <WorkstepPanel slideProgress={backgroundSlideProgress}>
            <div className="h-[380px] overflow-hidden sm:h-[440px] lg:h-[528px]">
              <motion.div
                ref={trackRef}
                className="flex flex-col will-change-transform"
                style={{ y }}
              >
                {workstepSlides.map((slide, index) => (
                  <WorkstepCard
                    key={slide.number}
                    slide={slide}
                    isActive={index === activeIndex}
                  />
                ))}
              </motion.div>
            </div>
          </WorkstepPanel>
        </Container>
      </div>
    </div>
  );
}

function WorkstepStacked() {
  return (
    <div>
      <Container className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="UNDER THE FLOORPLAN"
          title={
            <>
              How Each Block Actually{" "}
              <span>Gets Built.</span>
            </>
          }
          description="The toolchains, nodes, and signoff criteria behind each service area."
        />
        <div className="flex flex-col gap-6 sm:gap-8">
          {workstepSlides.map((slide) => (
            <WorkstepStackedCard key={slide.number} slide={slide} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export function WorkstepCarousel() {
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
    return <WorkstepStacked />;
  }

  if (prefersReducedMotion) {
    return <WorkstepCarouselScrollFallback />;
  }

  return <WorkstepScrollCarousel />;
}
