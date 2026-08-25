import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog/BlogCard";
import { BlogPostArticle } from "@/components/blog/BlogPostArticle";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getAllBlogPosts, getBlogPost, getRelatedPosts } from "@/lib/blog";
import { createMetadata, defaultOgImage } from "@/lib/metadata";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 60;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return createMetadata({
      title: "Post Not Found",
      robots: { index: false, follow: false },
    });
  }

  const description =
    post.excerpt?.slice(0, 160) ||
    `${post.title} — IC engineering insight from StaqX.ai.`;
  const path = `/blogs/${post.slug}`;
  const ogImage = post.coverImage
    ? { url: post.coverImage.url, alt: post.coverImage.alt }
    : defaultOgImage;

  return createMetadata({
    title: post.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: path,
      publishedTime: post.publishedAt,
      images: [ogImage],
    },
    twitter: {
      title: post.title,
      description,
      images: [ogImage.url],
    },
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, 3);

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" },
            { name: post.title, path: `/blogs/${post.slug}` },
          ]),
        ]}
      />
      <Header />
      <main className="bg-surface-page pb-24 lg:pb-40">
        <BlogPostArticle post={post} />

        {relatedPosts.length > 0 ? (
          <Container className="border-border-subtle mt-12 flex flex-col gap-8 border-t pt-12 lg:mt-24 lg:gap-16 lg:pt-20">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end lg:gap-8">
              <SectionHeader
                eyebrow="Blogs"
                title={<span className="text-text-primary">More insights.</span>}
              />
              <Button variant="ghost" showArrow href="/blogs" className="min-h-11">
                Find More
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <BlogCard
                  key={related.slug}
                  slug={related.slug}
                  title={related.title}
                  category={related.category}
                  publishedAt={related.publishedAt}
                  imageSrc={related.coverImage?.url}
                  imageAlt={related.coverImage?.alt}
                />
              ))}
            </div>
          </Container>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
