import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Bouton de base (convention shadcn/ui).
 *
 * `default` : aplat orange vif + texte encre. Le texte blanc sur #f0452a ne
 * ferait que 3,76:1 ; l'encre atteint 4,97:1 — et le rendu est plus « street
 * food » qu'un orange délavé.
 * `invert` : version pour les zones sombres (voile photo du hero).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-bold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-3",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-ink shadow-[0_10px_28px_-12px_rgba(240,69,42,0.75)] hover:bg-brand-600 hover:text-cream hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-brand-ink",
        outline:
          "border-2 border-ink/15 bg-transparent text-ink hover:border-brand hover:bg-brand hover:text-ink hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-brand-ink",
        invert:
          "border-2 border-cream/40 bg-cream/10 text-cream backdrop-blur-sm hover:border-cream hover:bg-cream hover:text-ink hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-cream",
        secondary:
          "bg-ink text-cream hover:bg-night-700 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-brand-ink",
        ghost: "text-ink hover:bg-sand focus-visible:outline-brand-ink",
        link: "text-brand-ink underline-offset-4 hover:underline rounded-none focus-visible:outline-brand-ink",
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
