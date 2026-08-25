"use client";

import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";

type ClipInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type FixedSectionBackgroundProps = {
  children: React.ReactNode;
  background: React.ReactNode;
  className?: string;
};

function getClipInsets(rect: DOMRect): ClipInsets {
  const visibleTop = Math.max(0, rect.top);
  const visibleLeft = Math.max(0, rect.left);
  const visibleBottom = Math.min(window.innerHeight, rect.bottom);
  const visibleRight = Math.min(window.innerWidth, rect.right);

  return {
    top: visibleTop,
    right: Math.max(0, window.innerWidth - visibleRight),
    bottom: Math.max(0, window.innerHeight - visibleBottom),
    left: visibleLeft,
  };
}

export function FixedSectionBackground({
  children,
  background,
  className,
}: FixedSectionBackgroundProps) {
  const isDesktop = useIsDesktop();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [clipPath, setClipPath] = useState("inset(100% 100% 100% 100%)");
  const [sectionTop, setSectionTop] = useState(0);

  const updateClip = useCallback(() => {
    if (!isDesktop) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const intersects = rect.bottom > 0 && rect.top < window.innerHeight;

    setIsActive(intersects);
    setSectionTop(rect.top);

    if (!intersects) {
      setClipPath("inset(100% 100% 100% 100%)");
      return;
    }

    const { top, right, bottom, left } = getClipInsets(rect);
    setClipPath(`inset(${top}px ${right}px ${bottom}px ${left}px)`);
  }, [isDesktop]);

  useLenis(updateClip);

  useEffect(() => {
    if (!isDesktop) return;

    updateClip();
    window.addEventListener("resize", updateClip);
    return () => window.removeEventListener("resize", updateClip);
  }, [isDesktop, updateClip]);

  return (
    <div ref={wrapperRef} className={cn("relative overflow-x-clip", className)}>
      {isDesktop ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none fixed inset-0 z-0 overflow-hidden",
            !isActive && "invisible"
          )}
          style={{ clipPath }}
        >
          <div
            className="absolute inset-x-0 top-0"
            style={{ transform: `translateY(${sectionTop}px)` }}
          >
            {background}
          </div>
        </div>
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
