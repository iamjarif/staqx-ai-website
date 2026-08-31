"use client";

import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { FingerprintSimple } from "@phosphor-icons/react/dist/ssr/FingerprintSimple";
import { FolderSimpleLock } from "@phosphor-icons/react/dist/ssr/FolderSimpleLock";
import { Lock } from "@phosphor-icons/react/dist/ssr/Lock";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { securityCards, type SecurityCard, type SecurityCardIcon } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";

const securityIcons = {
  "shield-check": ShieldCheck,
  "fingerprint-simple": FingerprintSimple,
  "folder-simple-lock": FolderSimpleLock,
  lock: Lock,
};

const easeOut = [0.22, 1, 0.36, 1] as const;

function SecurityCardIcon({ icon }: { icon: SecurityCardIcon }) {
  const IconComponent = securityIcons[icon];

  return (
    <IconComponent
      size={24}
      weight="duotone"
      color="var(--color-primary-500)"
      aria-hidden
    />
  );
}

function SecurityCardPanel({
  card,
  isExpanded,
  onActivate,
}: {
  card: SecurityCard;
  isExpanded: boolean;
  onActivate: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <article
      className={cn(
        "border-primary-500 flex min-h-11 flex-col rounded-r-lg border-l-[3px] pl-4 transition-colors duration-500 sm:pl-8",
        isExpanded ? "bg-surface-card gap-3 py-8" : "bg-transparent py-4"
      )}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
    >
      <div className="flex items-center gap-3">
        <div className="bg-border-subtle flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <SecurityCardIcon icon={card.icon} />
        </div>
        <h3 className="text-heading-h4 text-text-primary min-w-0 text-pretty">
          {card.title}
        </h3>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.ul
            key={card.id}
            className="flex w-full flex-col overflow-hidden"
            initial={
              shouldReduceMotion
                ? false
                : { height: 0, opacity: 0, filter: "blur(10px)" }
            }
            animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
            exit={
              shouldReduceMotion
                ? undefined
                : { height: 0, opacity: 0, filter: "blur(10px)" }
            }
            transition={{
              height: { duration: 0.55, ease: easeOut },
              opacity: { duration: 0.45, ease: easeOut },
              filter: { duration: 0.5, ease: easeOut },
            }}
          >
            {card.items.map((item) => (
              <li
                key={item}
                className="text-body-small text-text-tertiary flex items-center gap-3 py-1"
              >
                <CheckCircle
                  size={16}
                  weight="duotone"
                  color="var(--color-text-tertiary)"
                  className="shrink-0"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </article>
  );
}

export function SecurityAccordion() {
  const [activeId, setActiveId] = useState(securityCards[0].id);

  return (
    <div className="flex w-full flex-col gap-4">
      {securityCards.map((card) => (
        <SecurityCardPanel
          key={card.id}
          card={card}
          isExpanded={card.id === activeId}
          onActivate={() => setActiveId(card.id)}
        />
      ))}
    </div>
  );
}
