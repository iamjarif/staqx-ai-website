import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  as?: "h1" | "h2";
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  split?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  descriptionRef?: React.Ref<HTMLParagraphElement>;
};

export function SectionHeader({
  as: TitleTag = "h2",
  eyebrow,
  title,
  description,
  align = "left",
  split = false,
  className,
  titleClassName,
  descriptionClassName,
  descriptionRef,
}: SectionHeaderProps) {
  const heading = (
    <div
      className={cn(
        "flex flex-col gap-3 lg:gap-4",
        align === "center" && "items-center text-center",
        (split || !description) && className
      )}
    >
      <p className="text-code text-text-secondary">{eyebrow}</p>
      <TitleTag
        className={cn(
          "text-display-m text-text-tertiary [&_span]:text-text-primary",
          titleClassName
        )}
      >
        {title}
      </TitleTag>
    </div>
  );

  if (!description) {
    return heading;
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 lg:gap-4",
        split && "lg:flex-row lg:items-end lg:justify-between lg:gap-8",
        align === "center" && "items-center text-center",
        !split && className
      )}
    >
      {heading}
      <p
        ref={descriptionRef}
        className={cn(
          "max-w-[420px] text-body-medium text-text-tertiary",
          align === "center" && "text-center",
          descriptionClassName
        )}
      >
        {description}
      </p>
    </div>
  );
}
