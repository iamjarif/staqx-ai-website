import { ArrowCircleRight } from "@phosphor-icons/react/dist/ssr/ArrowCircleRight";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
    "disabled:pointer-events-none disabled:opacity-50"
  ),
  {
    variants: {
      variant: {
        primary:
          "rounded-lg bg-primary-500 text-text-primary hover:bg-brand-hover",
        secondary:
          "rounded-lg bg-surface-elevated text-text-primary hover:bg-surface-hover",
        ghost: "rounded-lg text-text-primary hover:text-text-secondary",
        inverse:
          "rounded-lg bg-text-primary text-text-inverse hover:bg-gray-200",
      },
      size: {
        default:
          "gap-1.5 text-[16px] font-medium leading-[20px] tracking-[-0.6px]",
        sm: "gap-1 text-[14px] font-medium leading-[18px] tracking-[-0.6px]",
      },
    },
    compoundVariants: [
      {
        variant: ["primary", "secondary"],
        size: "default",
        class: "h-[52px] px-6 py-4",
      },
      {
        variant: "ghost",
        size: "default",
        class: "h-11 px-4 py-3",
      },
      {
        variant: "inverse",
        size: "default",
        class: "h-11 py-3 pr-3 pl-4",
      },
      {
        variant: "inverse",
        size: "sm",
        class: "h-9 py-2 pr-2 pl-3",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
type ButtonSize = "default" | "sm";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    showArrow?: boolean;
    href?: string;
  };

function ButtonArrow({
  variant,
  size = "default",
}: {
  variant: ButtonVariant;
  size?: ButtonSize;
}) {
  const iconSize =
    variant === "secondary" ? 20 : size === "sm" ? 16 : 18;

  return (
    <ArrowCircleRight
      weight="duotone"
      size={iconSize}
      className="shrink-0"
      aria-hidden
    />
  );
}

function ButtonContent({
  showArrow,
  variant = "primary",
  size = "default",
  children,
}: {
  showArrow?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {showArrow && <ButtonArrow variant={variant} size={size} />}
    </>
  );
}

export function Button({
  className,
  variant = "primary",
  size = "default",
  type = "button",
  showArrow = false,
  href,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const resolvedVariant = (variant ?? "primary") as ButtonVariant;
  const resolvedSize = (size ?? "default") as ButtonSize;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        <ButtonContent
          showArrow={showArrow}
          variant={resolvedVariant}
          size={resolvedSize}
        >
          {children}
        </ButtonContent>
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      <ButtonContent
        showArrow={showArrow}
        variant={resolvedVariant}
        size={resolvedSize}
      >
        {children}
      </ButtonContent>
    </button>
  );
}

export { buttonVariants };
