import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Bouton de base (convention shadcn/ui).
 *
 * CE QUI A CHANGÉ, ET POURQUOI
 * Avant : pilule entièrement arrondie, ombre floue colorée, léger soulèvement
 * au survol. C'est le bouton par défaut de toutes les interfaces produites
 * depuis cinq ans — et une bonne part du « ça fait trop IA » venait de là.
 *
 * Maintenant : un bloc à peine arrondi, avec une ombre PORTÉE DURE et décalée.
 * Au survol, le bouton s'enfonce dans son ombre au lieu de léviter — un geste
 * physique, comme une touche qu'on presse. C'est le vocabulaire de la
 * signalétique imprimée, pas celui du rendu 3D.
 *
 * ⚠️ TEXTE SUR APLAT CHAUD
 * `--creme` sur `--rouge` ne fait que 3,98:1, sous le seuil AA. Toutes les
 * variantes à aplat chaud portent donc `text-encre` (4,93:1 sur rouge,
 * 11,42:1 sur jaune). Ce n'est pas récupérable esthétiquement.
 */
const buttonVariants = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-2 rounded-[var(--radius)]",
    "font-extrabold whitespace-nowrap",
    "transition-[transform,box-shadow,background-color,color] duration-150 ease-[var(--ease-snap)]",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /**
         * L'appel à l'action principal. Un seul par écran.
         * L'ombre est un aplat d'encre décalé ; au survol le bouton se déplace
         * de la même distance et vient « toucher » son ombre.
         */
        default:
          "bg-rouge text-encre shadow-[4px_4px_0_var(--encre)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--encre)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        /** Le second choix, à côté du principal, sur fond clair. */
        outline:
          "border-encre text-encre border-2 bg-transparent shadow-[4px_4px_0_var(--encre)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--encre)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        /** Le second choix sur fond sombre. */
        "outline-clair":
          "border-creme text-creme border-2 bg-transparent shadow-[4px_4px_0_var(--rouge)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--rouge)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        /** Doré — pour se détacher sur une photo ou un fond sombre. */
        jaune:
          "bg-jaune text-encre shadow-[4px_4px_0_var(--encre)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--encre)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        /** Discret : navigation secondaire, filtres non actifs. */
        ghost: "text-encre-douce hover:bg-carton hover:text-encre",
        link: "text-rouge-fonce rounded-none underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 text-sm",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
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
