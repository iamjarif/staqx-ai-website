import { siteConfig } from "@/config/site";
import { contactContent, services } from "@/lib/homepage-data";
import type { BlogPost } from "@/types/blog";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: `${siteConfig.url}/icon.svg`,
    email: contactContent.email,
    ...(siteConfig.socialLinks.length > 0
      ? { sameAs: siteConfig.socialLinks.map((link) => link.href) }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function blogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${siteConfig.url}/blogs/${post.slug}`,
    image: post.coverImage?.url,
    articleSection: post.category,
    mainEntityOfPage: `${siteConfig.url}/blogs/${post.slug}`,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.svg`,
      },
    },
  };
}

export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: contactContent.email,
    image: `${siteConfig.url}/images/homepage/hero.jpg`,
    areaServed: ["United States", "Bangladesh"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "IC engineering services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    },
  };
}

export function blogIndexSchema(posts: Pick<BlogPost, "title" | "slug">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "IC Engineering Insights",
    url: `${siteConfig.url}/blogs`,
    description:
      "Articles and updates from StaqX.ai on semiconductor design, VLSI, and IC engineering.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/blogs/${post.slug}`,
        name: post.title,
      })),
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
