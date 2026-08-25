import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section">;

export function Section({ className, ...props }: SectionProps) {
  return <section className={cn("w-full", className)} {...props} />;
}
