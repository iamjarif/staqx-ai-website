"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Fragment, useRef } from "react";

import { Container } from "@/components/ui/container";
import { missionContent } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";

const START_OPACITY = 0.15;
const SPREAD = 0.8;
const WORD_DURATION = 0.2;

type WordProgressRange = {
  start: number;
  end: number;
};

function getWordProgressRange(index: number, count: number): WordProgressRange {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD;

  return {
    start,
    end: Math.min(1, start + WORD_DURATION),
  };
}

function getWordOpacity(
  progress: number,
  { start, end }: WordProgressRange,
  startOpacity = START_OPACITY
): number {
  if (progress <= start) return startOpacity;
  if (progress >= end) return 1;

  const wordProgress = (progress - start) / (end - start);
  return startOpacity + (1 - startOpacity) * wordProgress;
}

function Word({
  children,
  progress,
  index,
  count,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  reducedMotion: boolean;
}) {
  const range = getWordProgressRange(index, count);
  const opacity = useTransform(progress, (latest) =>
    getWordOpacity(latest, range)
  );

  return (
    <motion.span
      aria-hidden="true"
      style={reducedMotion ? undefined : { opacity }}
    >
      {children}
    </motion.span>
  );
}

export function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const disableScrollEffect = Boolean(reducedMotion);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const words = missionContent.text.split(" ");

  return (
    <section
      ref={sectionRef}
      id="about"
      className={cn(
        "relative max-lg:py-12",
        disableScrollEffect ? "min-h-0" : "min-h-[220vh]"
      )}
      aria-labelledby="mission-statement"
    >
      <div
        className={cn(
          "flex min-h-[90svh] items-center justify-center overflow-hidden",
          !disableScrollEffect && "sticky top-0 h-[90svh]"
        )}
      >
        <Container className="flex items-center justify-center">
          <p
            id="mission-statement"
            className="text-display-m text-center text-text-primary text-pretty"
            aria-label={missionContent.text}
          >
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <Word
                  progress={scrollYProgress}
                  index={index}
                  count={words.length}
                  reducedMotion={disableScrollEffect}
                >
                  {word}
                </Word>
                {index < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>
        </Container>
      </div>
    </section>
  );
}
