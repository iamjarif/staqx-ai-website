import type { Metadata } from "next";

import { BlogCard } from "@/components/blog/BlogCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getAllBlogPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/metadata";
import { blogIndexSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 60;

export const metadata: Metadata = createMetadata({
  title: "IC Engineering Insights",
  description:
    "Articles and updates from StaqX.ai on semiconductor design, VLSI, and IC engineering from architecture through silicon.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "IC Engineering Insights | StaqX.ai",
    url: "/blogs",
  },
});

export default async function BlogsPage() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" },
          ]),
          blogIndexSchema(posts),
        ]}
      />
      <Header />
      <main className="bg-surface-page pb-24 lg:pb-40">
        <div className="bg-surface-section pt-24 pb-12 lg:pt-32 lg:pb-16">
          <Container>
            <SectionHeader
              as="h1"
              eyebrow="Blogs"
              title={<span>All insights.</span>}
            />
          </Container>
        </div>

        <Container className="pt-12 lg:pt-16">
          {posts.length === 0 ? (
            <p className="text-body-medium text-text-tertiary">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div
              data-testid="blog-grid"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {posts.map((post) => (
                <BlogCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  category={post.category}
                  publishedAt={post.publishedAt}
                  imageSrc={post.coverImage?.url}
                  imageAlt={post.coverImage?.alt}
                />
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
