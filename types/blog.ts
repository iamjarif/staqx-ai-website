import type { PortableTextBlock } from "@portabletext/types";

export type BlogImage = {
  url: string;
  alt: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: BlogImage;
  body: PortableTextBlock[];
  readingTimeMinutes?: number;
};

export type BlogListResult = {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
};
