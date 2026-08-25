import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import {
  SectionReveal,
  SectionRevealItem,
} from "@/components/ui/section-reveal";
import { getBlogPosts } from "@/lib/blog";

const HOMEPAGE_POST_COUNT = 3;

export async function BlogSection() {
  const { posts } = await getBlogPosts(1, HOMEPAGE_POST_COUNT);

  if (posts.length === 0) {
    return null;
  }

  return (
    <SectionReveal id="blogs" className="py-12 lg:py-40">
      <Container className="flex flex-col gap-8 md:gap-16">
        <SectionRevealItem className="flex items-end justify-between gap-8">
          <SectionHeader
            eyebrow="Blogs"
            title={<span className="text-text-primary">Latest Insights.</span>}
          />
          <Button
            variant="ghost"
            showArrow
            href="/blogs"
            className="hidden min-h-11 lg:inline-flex"
          >
            Find More
          </Button>
        </SectionRevealItem>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <SectionRevealItem key={post.slug}>
              <BlogCard
                slug={post.slug}
                title={post.title}
                category={post.category}
                publishedAt={post.publishedAt}
                imageSrc={post.coverImage?.url}
                imageAlt={post.coverImage?.alt}
              />
            </SectionRevealItem>
          ))}
        </div>

        <SectionRevealItem className="lg:hidden">
          <Button
            variant="ghost"
            showArrow
            href="/blogs"
            className="min-h-11 w-full sm:w-auto"
          >
            Find More
          </Button>
        </SectionRevealItem>
      </Container>
    </SectionReveal>
  );
}
