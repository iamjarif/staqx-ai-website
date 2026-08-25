import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** Custom type tokens — must stay separate from `text-*` color utilities in twMerge. */
const typographySizes = [
  "display-xl",
  "display-l",
  "display-m",
  "heading-h1",
  "heading-h2",
  "heading-h3",
  "heading-h4",
  "heading-h5",
  "heading-h6",
  "body-large",
  "body-medium",
  "body-small",
  "button-large",
  "button-medium",
  "button-small",
  "label-large",
  "label-medium",
  "label-small",
  "overline",
  "code",
  "eyebrow",
  "caption",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...typographySizes] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
