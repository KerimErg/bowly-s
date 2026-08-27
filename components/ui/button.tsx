import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Bouton de base (convention shadcn/ui).
 *
 * ⚠️ TEXTE SUR APLAT CHAUD
 * `--bone` sur `--brand` ne fait que 3,29:1 — sous le seuil AA. Toutes les
 * variantes à aplat chaud portent donc du `text-ink` (5,16:1 sur brand,
 * 12,04:1 sur crisp). Ce n'est pas un choix esthétique récupérable : changer
 * ces couleurs de texte casse l'accessibilité.
 *
 * Les ombres ne sont pas des ombres mais des halos : sur fond noir, une ombre
 * noire est invisible, seule la lumière projetée crée le relief.
 */
const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-bold whitespace-nowrap transition-all duration-300 ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** L'appel à l'action principal. Un seul par écran. */
        default:
          "bg-brand text-ink shadow-[var(--shadow-glow-brand)] hover:bg-brand-hot hover:-translate-y-0.5 active:translate-y-0",
        /** Le second choix, à côté du principal. */
        outline:
          "border-line-strong text-bone hover:border-crisp hover:text-crisp border bg-transparent hover:-translate-y-0.5 active:translate-y-0",
        /** Sur une surface déjà claire ou une photo. */
        crisp:
          "bg-crisp text-ink shadow-[var(--shadow-glow-crisp)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
        /** Discret : navigation secondaire, filtres non actifs. */
        ghost: "text-bone-dim hover:bg-void-3 hover:text-bone",
        /** Surface légèrement relevée, pour les cartes. */
        surface: "surface text-bone hover:border-line-strong hover:text-crisp",
        link: "text-crisp rounded-none underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-7 text-sm",
        sm: "h-10 px-5 text-xs",
        lg: "h-14 px-9 text-base",
        xl: "h-16 px-11 text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
