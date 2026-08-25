import type { PortableTextBlock } from "@portabletext/types";

const WORDS_PER_MINUTE = 200;

export function formatBlogDate(
  dateString: string,
  month: "short" | "long" = "short"
): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
  });
}

export type BlogHeading = {
  id: string;
  text: string;
};

function slugifyHeading(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return slug.slice(0, 80) || "section";
}

export function getPortableTextHeadings(
  body: PortableTextBlock[]
): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const used = new Set<string>();

  for (const block of body) {
    if (block._type !== "block" || block.style !== "h2") continue;

    const text = extractTextFromBlock(block).trim();
    if (!text) continue;

    const base = slugifyHeading(text);
    let id = base;
    let n = 2;

    while (used.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }

    used.add(id);
    headings.push({ id, text });
  }

  return headings;
}

function extractTextFromBlock(block: PortableTextBlock): string {
  if (block._type !== "block" || !Array.isArray(block.children)) {
    return "";
  }

  return block.children
    .map((child) =>
      "text" in child && typeof child.text === "string" ? child.text : ""
    )
    .join(" ");
}

export function estimateReadingTime(body: PortableTextBlock[]): number {
  const text = body.map(extractTextFromBlock).join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
