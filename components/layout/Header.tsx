"use client";

import { List, X } from "@phosphor-icons/react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";

const HEADER_INSET = 88;
const SCROLL_SECTIONS = ["about", "services", "blogs", "contact"] as const;

function navHref(href: string, pathname: string) {
  if (href.startsWith("#") && pathname !== "/") {
    return `/${href}`;
  }

  return href;
}

function sectionToHref(sectionId: string) {
  if (sectionId === "blogs") return "/blogs";
  return `#${sectionId}`;
}

function getScrollSection() {
  let current: string | null = null;

  for (const id of SCROLL_SECTIONS) {
    const element = document.getElementById(id);
    if (!element) continue;

    if (element.getBoundingClientRect().top <= HEADER_INSET + 24) {
      current = id;
    }
  }

  return current;
}

function isNavActive(
  href: string,
  pathname: string,
  activeHref: string | null
) {
  if (href === "/blogs") {
    return pathname.startsWith("/blogs") || activeHref === "/blogs";
  }

  if (pathname.startsWith("/blogs")) return false;

  return href === activeHref;
}

export function Header() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overHero, setOverHero] = useState(pathname === "/");
  const [activeHref, setActiveHref] = useState<string | null>(
    pathname.startsWith("/blogs") ? "/blogs" : null
  );

  useEffect(() => {
    if (pathname.startsWith("/blogs")) {
      setActiveHref("/blogs");
      return;
    }

    if (pathname !== "/") {
      setActiveHref(null);
      return;
    }

    const sync = () => {
      const section = getScrollSection();
      const next = section ? sectionToHref(section) : null;
      setActiveHref((current) => (current === next ? current : next));
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [pathname]);

  useLenis(() => {
    if (pathname !== "/") return;
    const section = getScrollSection();
    const next = section ? sectionToHref(section) : null;
    setActiveHref((current) => (current === next ? current : next));
  });

  useEffect(() => {
    const hero = document.getElementById("hero");

    if (!hero) {
      setOverHero(false);
      return;
    }

    const sync = () => {
      setOverHero(hero.getBoundingClientRect().bottom > HEADER_INSET);
    };

    sync();

    const observer = new IntersectionObserver(sync, {
      rootMargin: `-${HEADER_INSET}px 0px 0px 0px`,
      threshold: 0,
    });

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const headerTransition = {
    duration: 0.85,
    delay: 0,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const isDesktop = useIsDesktop();
  const skipEntry = Boolean(shouldReduceMotion) || !isDesktop;
  const drawerEase = [0.22, 1, 0.36, 1] as const;
  const drawerDuration = shouldReduceMotion ? 0.15 : 0.38;

  return (
    <motion.header
      data-testid="site-header"
      className="fixed right-0 left-0 z-50"
      initial={skipEntry ? false : { top: -40 }}
      animate={{ top: 16 }}
      transition={headerTransition}
    >
      <AnimatePresence>
        {mobileOpen ? (
          <motion.button
            key="mobile-nav-backdrop"
            type="button"
            data-testid="mobile-nav-backdrop"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: drawerDuration, ease: drawerEase }}
            onClick={() => setMobileOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <Container className="relative z-50 flex items-center justify-between">
        <motion.div
          initial={skipEntry ? false : { filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ ...headerTransition, delay: 0.04 }}
        >
          <Link
            href={pathname === "/" ? "#hero" : "/#hero"}
            aria-label={`${siteConfig.name} home`}
            className="text-text-primary"
            onClick={() => setMobileOpen(false)}
          >
            <Logo accent={!overHero} />
          </Link>
        </motion.div>

        <nav
          className="relative hidden items-center lg:flex"
          aria-label="Main navigation"
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-xl bg-black/10 backdrop-blur-[10px]"
            aria-hidden
          />
          <motion.div
            className="relative flex items-center gap-6 py-3 pr-3 pl-8"
            initial={skipEntry ? false : { filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ ...headerTransition, delay: 0.08 }}
          >
            <div className="flex items-center gap-3">
              {siteConfig.navigation.map((item) => {
                const active = isNavActive(item.href, pathname, activeHref);

                return (
                  <Link
                    key={item.href}
                    href={navHref(item.href, pathname)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-lg px-4 py-3 text-[16px] font-medium leading-[20px] tracking-[-0.6px] transition-colors",
                      active
                        ? "text-primary-500"
                        : "text-text-primary hover:text-text-secondary"
                    )}
                  >
                    {item.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="bg-primary-500 absolute inset-x-4 bottom-1.5 h-0.5 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    ) : null}
                  </Link>
                );
              })}
            </div>
            <Button
              variant="inverse"
              size="sm"
              showArrow
              href={navHref("#contact", pathname)}
            >
              Request Quote
            </Button>
          </motion.div>
        </nav>

        <motion.button
          type="button"
          data-testid="mobile-menu-toggle"
          className="text-text-primary flex size-11 items-center justify-center rounded-lg lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          initial={skipEntry ? false : { filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ ...headerTransition, delay: 0.04 }}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "close" : "open"}
              className="flex"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: -90, scale: 0.8 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, rotate: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: 90, scale: 0.8 }
              }
              transition={{ duration: 0.2, ease: drawerEase }}
            >
              {mobileOpen ? (
                <X size={20} weight="duotone" aria-hidden />
              ) : (
                <List size={20} weight="duotone" aria-hidden />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </Container>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            data-testid="mobile-nav"
            className="border-border-default bg-surface-page/95 absolute inset-x-4 top-full z-50 mt-2 max-h-[min(28rem,calc(100dvh-5.5rem))] origin-top overflow-y-auto rounded-xl border backdrop-blur-md lg:hidden"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12, scale: 0.96 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.98 }
            }
            transition={{ duration: drawerDuration, ease: drawerEase }}
          >
            <Container className="flex flex-col gap-2 py-3">
              {siteConfig.navigation.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 8 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.12 : 0.32,
                    delay: shouldReduceMotion ? 0 : 0.06 + index * 0.05,
                    ease: drawerEase,
                  }}
                >
                  <Link
                    href={navHref(item.href, pathname)}
                    aria-current={
                      isNavActive(item.href, pathname, activeHref)
                        ? "page"
                        : undefined
                    }
                    className={cn(
                      "text-button-large relative flex min-h-11 items-center rounded-lg px-4 py-3 transition-colors",
                      isNavActive(item.href, pathname, activeHref)
                        ? "bg-surface-elevated text-primary-500"
                        : "text-text-primary"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {isNavActive(item.href, pathname, activeHref) ? (
                      <span
                        className="bg-primary-500 absolute top-2 bottom-2 left-0 w-0.5 rounded-full"
                        aria-hidden
                      />
                    ) : null}
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.12 : 0.32,
                  delay: shouldReduceMotion
                    ? 0
                    : 0.06 + siteConfig.navigation.length * 0.05,
                  ease: drawerEase,
                }}
              >
                <Button
                  variant="inverse"
                  size="sm"
                  showArrow
                  href={navHref("#contact", pathname)}
                  className="mt-2 min-h-11 w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Request Quote
                </Button>
              </motion.div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
