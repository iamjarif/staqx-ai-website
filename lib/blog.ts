import type { PortableTextBlock } from "@portabletext/types";
import { cache } from "react";

import { estimateReadingTime } from "@/lib/blog-utils";
import { getSanityClient, isSanityConfigured } from "@/lib/sanity/client";
import {
  allPostsQuery,
  postBySlugQuery,
  postsCountQuery,
  postsQuery,
  recentPostsExcludingQuery,
} from "@/lib/sanity/queries";
import type { BlogListResult, BlogPost } from "@/types/blog";

const SANITY_REVALIDATE_SECONDS = 60;

type SanityPostRaw = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: {
    asset?: { url: string };
    alt?: string;
  };
  body?: PortableTextBlock[];
};

function fetchOptions() {
  return {
    next: { revalidate: SANITY_REVALIDATE_SECONDS },
  } as const;
}

function normalizePost(raw: SanityPostRaw): BlogPost {
  const body = raw.body ?? [];

  return {
    slug: raw.slug,
    title: raw.title,
    category: raw.category,
    excerpt: raw.excerpt,
    publishedAt: raw.publishedAt,
    body,
    readingTimeMinutes: body.length > 0 ? estimateReadingTime(body) : undefined,
    coverImage: raw.coverImage?.asset?.url
      ? {
          url: raw.coverImage.asset.url,
          alt: raw.coverImage.alt ?? raw.title,
        }
      : undefined,
  };
}

export const getBlogPosts = cache(async function getBlogPosts(
  page = 1,
  pageSize = 10
): Promise<BlogListResult> {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  if (!isSanityConfigured()) {
    return { posts: [], total: 0, page: safePage, pageSize };
  }

  const client = getSanityClient();
  if (!client) {
    return { posts: [], total: 0, page: safePage, pageSize };
  }

  const [rawPosts, total] = await Promise.all([
    client.fetch<SanityPostRaw[]>(postsQuery, { start, end }, fetchOptions()),
    client.fetch<number>(postsCountQuery, {}, fetchOptions()),
  ]);

  return {
    posts: rawPosts.map(normalizePost),
    total,
    page: safePage,
    pageSize,
  };
});

export const getAllBlogPosts = cache(async function getAllBlogPosts(): Promise<
  BlogPost[]
> {
  if (!isSanityConfigured()) return [];

  const client = getSanityClient();
  if (!client) return [];

  const raw = await client.fetch<SanityPostRaw[]>(
    allPostsQuery,
    {},
    fetchOptions()
  );

  return raw.map(normalizePost);
});

export const getBlogPost = cache(async function getBlogPost(
  slug: string
): Promise<BlogPost | null> {
  if (!isSanityConfigured()) return null;

  const client = getSanityClient();
  if (!client) return null;

  const raw = await client.fetch<SanityPostRaw | null>(
    postBySlugQuery,
    { slug },
    fetchOptions()
  );

  if (!raw) return null;
  return normalizePost(raw);
});

export const getRelatedPosts = cache(async function getRelatedPosts(
  slug: string,
  limit = 3
): Promise<BlogPost[]> {
  if (!isSanityConfigured()) return [];

  const client = getSanityClient();
  if (!client) return [];

  const raw = await client.fetch<SanityPostRaw[]>(
    recentPostsExcludingQuery,
    { slug, limit },
    fetchOptions()
  );

  return raw.map(normalizePost);
});
