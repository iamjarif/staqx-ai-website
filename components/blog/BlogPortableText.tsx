import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";

import type { BlogHeading } from "@/lib/blog-utils";

function createPortableTextComponents(
  headings: BlogHeading[]
): PortableTextComponents {
  let headingIndex = 0;

  return {
    types: {
      image: ({ value }) => {
        const url = typeof value?.url === "string" ? value.url : null;
        const alt =
          typeof value?.alt === "string" && value.alt.trim()
            ? value.alt
            : "Illustration from the article";

        if (!url) return null;

        return (
          <figure className="my-8 overflow-hidden rounded-lg last:mb-0 lg:my-10">
            <Image
              src={url}
              alt={alt}
              width={1280}
              height={720}
              className="h-auto w-full"
              sizes="(max-width: 640px) 100vw, 640px"
            />
          </figure>
        );
      },
    },
    block: {
      h2: ({ children }) => {
        const heading = headings[headingIndex];
        headingIndex += 1;

        return (
          <h2
            id={heading?.id}
            className="text-heading-h4 text-text-primary mt-8 mb-3 scroll-mt-28 first:mt-0 lg:mt-12 lg:mb-4"
          >
            {children}
          </h2>
        );
      },
      h3: ({ children }) => (
        <h3 className="text-heading-h5 text-text-primary mt-8 mb-3 first:mt-0 lg:mt-10">
          {children}
        </h3>
      ),
      normal: ({ children }) => (
        <p className="text-body-medium text-text-secondary mb-6 leading-[1.8] last:mb-0">
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-border-default text-heading-h5 text-text-primary my-8 border-y py-6 leading-[1.45] lg:my-10 lg:py-7 [&_p]:mb-0">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="text-body-medium text-text-secondary mb-6 list-disc space-y-2 pl-6 leading-[1.8]">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="text-body-medium text-text-secondary mb-6 list-decimal space-y-2 pl-6 leading-[1.8]">
          {children}
        </ol>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="text-text-primary font-semibold">{children}</strong>
      ),
      em: ({ children }) => <em>{children}</em>,
      code: ({ children }) => (
        <code className="bg-surface-card text-text-primary rounded-md px-1.5 py-0.5 text-[0.9em]">
          {children}
        </code>
      ),
      link: ({ children, value }) => {
        const href = typeof value?.href === "string" ? value.href : "#";

        return (
          <a
            href={href}
            className="text-text-link underline-offset-4 hover:text-text-link-hover hover:underline"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      },
    },
  };
}

type BlogPortableTextProps = {
  value: PortableTextBlock[];
  headings?: BlogHeading[];
};

export function BlogPortableText({
  value,
  headings = [],
}: BlogPortableTextProps) {
  return (
    <PortableText
      value={value}
      components={createPortableTextComponents(headings)}
    />
  );
}
