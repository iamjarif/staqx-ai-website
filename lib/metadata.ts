import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const defaultOgImage = {
  url: "/images/homepage/hero.jpg",
  width: 1920,
  height: 1280,
  alt: "StaqX.ai semiconductor engineering",
};

const defaultTitle =
  "StaqX.ai | IC Engineering from Architecture to Silicon";

export function createMetadata(overrides: Metadata = {}): Metadata {
  const {
    openGraph: openGraphOverrides,
    twitter: twitterOverrides,
    robots: robotsOverrides,
    ...rest
  } = overrides;

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: defaultTitle,
      description: siteConfig.description,
      images: [defaultOgImage],
      ...openGraphOverrides,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: siteConfig.description,
      images: [defaultOgImage.url],
      ...twitterOverrides,
    },
    robots:
      typeof robotsOverrides === "object"
        ? { index: true, follow: true, ...robotsOverrides }
        : robotsOverrides ?? { index: true, follow: true },
    ...rest,
  };
}
