import type { NavItem, SocialLink } from "@/types";

export const siteConfig = {
  name: "StaqX.ai",
  description:
    "End-to-end IC engineering services from architecture to silicon. Built for innovation. Optimized for performance. Delivered with precision.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://staqx.ai",
  navigation: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "#contact" },
  ] as NavItem[],
  socialLinks: [
    {
      platform: "LinkedIn",
      href: "https://www.linkedin.com/company/boston-semiconductor",
    },
  ] as SocialLink[],
} as const;

export type SiteConfig = typeof siteConfig;
