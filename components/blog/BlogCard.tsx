import Image from "next/image";
import Link from "next/link";

import { formatBlogDate } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE = "/images/homepage/blog-placeholder.png";

type BlogCardProps = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  sizes?: string;
};

export function BlogCard({
  slug,
  title,
  category,
  publishedAt,
  imageSrc,
  imageAlt,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
}: BlogCardProps) {
  const dateLabel = formatBlogDate(publishedAt);

  return (
    <article
      className={cn(
        "group relative flex h-[240px] flex-col justify-end overflow-hidden rounded-lg p-4 sm:h-[280px] lg:h-[300px]",
        className
      )}
    >
      <Image
        src={imageSrc ?? PLACEHOLDER_IMAGE}
        alt={imageAlt ?? title}
        fill
        className="object-cover transition-transform duration-500 ease-out pointer-fine:group-hover:scale-105"
        sizes={sizes}
        quality={75}
      />
      <div className="relative w-full overflow-hidden rounded-lg">
        <div
          className="bg-surface-overlay pointer-events-none absolute inset-0 backdrop-blur-[25px]"
          aria-hidden
        />
        <div className="relative flex w-full flex-col gap-3 px-4 py-4 lg:gap-[13px] lg:px-[19px] lg:py-[15px]">
          <div className="text-label-medium text-text-tertiary flex items-center gap-1.5">
            <span>{category}</span>
            <span aria-hidden>·</span>
            <time dateTime={publishedAt}>{dateLabel}</time>
          </div>
          <h3 className="text-heading-h6 text-text-primary line-clamp-2 overflow-hidden tracking-[-0.4px] transition-colors duration-300 pointer-fine:group-hover:text-primary-500">
            {title}
          </h3>
        </div>
      </div>
      <Link
        href={`/blogs/${slug}`}
        className="absolute inset-0"
        aria-label={title}
      />
    </article>
  );
}
