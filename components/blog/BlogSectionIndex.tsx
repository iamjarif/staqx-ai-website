"use client";

import { useEffect, useState } from "react";

import type { BlogHeading } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";

type BlogSectionIndexProps = {
  headings: BlogHeading[];
};

export function BlogSectionIndex({ headings }: BlogSectionIndexProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="In this article">
      <p className="text-code text-text-tertiary mb-4">Index</p>
      <ol className="border-border-subtle flex flex-col border-l">
        {headings.map((heading, index) => {
          const isActive = heading.id === activeId;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "-ml-px flex gap-3 border-l py-2.5 pl-4 text-label-medium leading-snug transition-colors",
                  isActive
                    ? "border-primary-500 text-text-primary"
                    : "border-transparent text-text-tertiary hover:text-text-secondary"
                )}
              >
                <span
                  className={cn(
                    "text-caption w-5 shrink-0",
                    isActive ? "text-primary-500" : "text-text-disabled"
                  )}
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="line-clamp-2 text-pretty">{heading.text}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
