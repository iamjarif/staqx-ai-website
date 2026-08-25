"use client";

import type { LenisRef } from "lenis/react";
import { ReactLenis } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import { useEffect, useRef, useState } from "react";

const SECTION_SCROLL_OFFSET = -96;

type LenisProviderProps = {
  children: React.ReactNode;
};

function clearHashFromUrl() {
  if (!window.location.hash) return;

  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);
}

function scrollToSection(
  id: string,
  lenis: { scrollTo: (target: HTMLElement, options?: object) => void } | null | undefined
) {
  const element = document.getElementById(id);
  if (!element) return false;

  if (lenis) {
    lenis.scrollTo(element, { offset: SECTION_SCROLL_OFFSET });
  } else {
    const top =
      element.getBoundingClientRect().top +
      window.scrollY +
      SECTION_SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return true;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<LenisRef>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const update = () =>
      setEnabled(desktopQuery.matches && !motionQuery.matches);

    update();
    motionQuery.addEventListener("change", update);
    desktopQuery.addEventListener("change", update);
    return () => {
      motionQuery.removeEventListener("change", update);
      desktopQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);
    return () => cancelFrame(update);
  }, [enabled]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = (event.target as HTMLElement | null)?.closest(
        "a[href^='#']"
      );
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href === "#") return;

      const id = decodeURIComponent(href.slice(1));
      if (!scrollToSection(id, lenisRef.current?.lenis)) return;

      event.preventDefault();
      clearHashFromUrl();
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    clearHashFromUrl();
    requestAnimationFrame(() => {
      scrollToSection(id, lenisRef.current?.lenis);
    });
  }, [enabled]);

  if (!enabled) {
    return children;
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
