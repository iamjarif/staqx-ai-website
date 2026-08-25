"use client";

import {
  motion,
  stagger,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";

import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

const revealTransition = {
  y: {
    type: "spring" as const,
    stiffness: 70,
    damping: 22,
    mass: 1.05,
  },
  opacity: { duration: 0.85, ease: easeOut },
  filter: { duration: 0.95, ease: easeOut },
};

export const sectionRevealVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.14, { startDelay: 0.12 }),
    },
  },
};

export const sectionItemVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: revealTransition,
  },
};

const compactSectionRevealVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.06, { startDelay: 0.02 }),
    },
  },
};

const compactItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export const heroRevealVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.16, { startDelay: 0.2 }),
    },
  },
};

const compactHeroRevealVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.08, { startDelay: 0.06 }),
    },
  },
};

const reducedMotionVariants: Variants = {
  hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

type SectionRevealProps = HTMLMotionProps<"section"> & {
  animateOnMount?: boolean;
  hero?: boolean;
  once?: boolean;
  amount?: number;
};

export function SectionReveal({
  className,
  children,
  animateOnMount = false,
  hero = false,
  once = true,
  amount,
  ...props
}: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const compact = !isDesktop;

  const resolvedAmount = amount ?? (compact ? 0.04 : 0.18);

  return (
    <motion.section
      className={cn(className)}
      initial="hidden"
      animate={animateOnMount && !shouldReduceMotion ? "visible" : undefined}
      whileInView={
        animateOnMount || shouldReduceMotion ? undefined : "visible"
      }
      viewport={{
        once,
        amount: resolvedAmount,
        margin: compact ? "0px 0px 0px 0px" : "0px 0px -8% 0px",
      }}
      variants={
        shouldReduceMotion
          ? reducedMotionVariants
          : compact
            ? hero
              ? compactHeroRevealVariants
              : compactSectionRevealVariants
            : hero
              ? heroRevealVariants
              : sectionRevealVariants
      }
      {...props}
    >
      {children}
    </motion.section>
  );
}

type SectionRevealItemProps = Omit<HTMLMotionProps<"div">, "variants"> & {
  as?: "div" | "article" | "span";
};

export function SectionRevealItem({
  as = "div",
  className,
  children,
  ...props
}: SectionRevealItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const compact = !isDesktop;

  const variants = shouldReduceMotion
    ? reducedMotionVariants
    : compact
      ? compactItemVariants
      : sectionItemVariants;

  const motionStyle = {
    willChange: shouldReduceMotion || compact ? undefined : "filter, opacity, transform",
  };

  if (as === "article") {
    return (
      <motion.article
        className={className}
        style={motionStyle}
        variants={variants}
        {...props}
      >
        {children}
      </motion.article>
    );
  }

  if (as === "span") {
    return (
      <motion.span
        className={className}
        style={motionStyle}
        variants={variants}
        {...props}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.div
      className={className}
      style={motionStyle}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
