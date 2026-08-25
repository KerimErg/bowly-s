import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Bouton de base (convention shadcn/ui).
 * Les variantes reprennent la DA Bowly's : orange plein pour l'action
 * principale, contour crème pour l'action secondaire sur photo.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-bold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-ink shadow-[0_12px_40px_-12px_rgba(255,90,31,0.7)] hover:bg-brand-600 hover:shadow-[0_18px_50px_-12px_rgba(255,90,31,0.85)] hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-cream/30 bg-cream/5 text-cream backdrop-blur-sm hover:border-brand hover:bg-brand hover:text-ink hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-cream text-ink hover:bg-sand hover:-translate-y-0.5 active:translate-y-0",
        ghost: "text-cream hover:bg-cream/10",
        link: "text-brand underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-12 px-7 text-sm",
        sm: "h-10 px-5 text-xs",
        lg: "h-14 px-9 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
