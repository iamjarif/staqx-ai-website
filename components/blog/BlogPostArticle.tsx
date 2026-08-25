import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import Image from "next/image";
import Link from "next/link";

import { BlogPortableText } from "@/components/blog/BlogPortableText";
import { BlogSectionIndex } from "@/components/blog/BlogSectionIndex";
import { Container } from "@/components/ui/container";
import { formatBlogDate, getPortableTextHeadings } from "@/lib/blog-utils";
import type { BlogPost } from "@/types/blog";

const PLACEHOLDER_IMAGE = "/images/homepage/blog-placeholder.png";

type BlogPostArticleProps = {
  post: BlogPost;
};

function SpecCell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-code text-text-tertiary">{label}</dt>
      <dd
        className={
          accent
            ? "text-label-large text-primary-500 mt-2 truncate"
            : "text-label-large text-text-primary mt-2 truncate"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export function BlogPostArticle({ post }: BlogPostArticleProps) {
  const coverSrc = post.coverImage?.url ?? PLACEHOLDER_IMAGE;
  const coverAlt = post.coverImage?.alt ?? post.title;
  const headings = getPortableTextHeadings(post.body);
  const hasIndex = headings.length >= 2;
  const published = formatBlogDate(post.publishedAt);
  const readingTime = post.readingTimeMinutes
    ? `${post.readingTimeMinutes} min`
    : "—";

  return (
    <article>
      <div className="bg-surface-section relative overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-16">
        <Container>
          <Link
            href="/blogs"
            className="text-label-medium text-text-tertiary hover:text-text-primary inline-flex min-h-11 items-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} weight="duotone" aria-hidden />
            All insights
          </Link>

          <div className="mt-6 grid items-start gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col gap-3 lg:col-span-8 lg:gap-4">
              <h1 className="text-heading-h1 text-text-primary text-pretty">
                {post.title}
              </h1>
              {post.excerpt ? (
                <p className="text-body-medium text-text-tertiary max-w-[520px] leading-[1.7]">
                  {post.excerpt}
                </p>
              ) : null}
            </div>

            <figure className="relative h-[168px] w-full overflow-hidden rounded-lg lg:col-span-4 lg:aspect-[4/3] lg:h-auto lg:max-w-[360px] lg:justify-self-end">
              <Image
                src={coverSrc}
                alt={coverAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
              />
            </figure>
          </div>

          <dl className="border-border-default mt-6 grid grid-cols-3 gap-3 border-t pt-6 sm:gap-4 lg:mt-12 lg:gap-8">
            <SpecCell label="Field" value={post.category} accent />
            <SpecCell label="Published" value={published} />
            <SpecCell label="Read" value={readingTime} />
          </dl>
        </Container>
      </div>

      <Container className="mt-8 lg:mt-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          {hasIndex ? (
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-28">
                <BlogSectionIndex headings={headings} />
              </div>
            </aside>
          ) : null}

          <div
            className={
              hasIndex
                ? "w-full min-w-0 max-w-[640px] lg:col-span-6 lg:col-start-5"
                : "mx-auto w-full min-w-0 max-w-[640px] lg:col-span-8 lg:col-start-3"
            }
          >
            <BlogPortableText value={post.body} headings={headings} />
          </div>
        </div>
      </Container>
    </article>
  );
}
