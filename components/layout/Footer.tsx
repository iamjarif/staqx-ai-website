import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { footerContent } from "@/lib/homepage-data";

export function Footer() {
  return (
    <footer className="w-full" data-testid="site-footer">
      <Container className="flex flex-col gap-6 pb-6">
        <div className="border-border-default flex flex-col gap-6 border-b py-8">
          <Link href="/" aria-label={siteConfig.name} className="text-text-primary w-fit">
            <Logo accent />
          </Link>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <p className="text-label-large text-text-tertiary max-w-prose">
              {footerContent.tagline}
            </p>
            <nav
              className="flex flex-wrap items-center gap-2 sm:gap-2"
              aria-label="Footer navigation"
            >
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={
                    item.href.startsWith("#") ? `/${item.href}` : item.href
                  }
                  className="text-button-medium text-text-tertiary inline-flex min-h-11 items-center rounded-lg px-3 py-2 transition-colors hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-label-small text-text-disabled min-w-0">
            {footerContent.copyright}
          </p>
        </div>
      </Container>
    </footer>
  );
}
