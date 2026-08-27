import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * LES ÉLÉMENTS « FAITS MAIN ».
 * ---------------------------------------------------------------------------
 * POURQUOI CE FICHIER EXISTE
 * Retour client : « ça fait trop IA, les rectangles ». C'était juste. Un
 * assemblage de cartes à coins arrondis, alignées au pixel, séparées par des
 * traits parfaitement horizontaux et éclairées par des halos flous, c'est la
 * signature d'une interface produite par une machine.
 *
 * Ce que fait un atelier à la place : il découpe, il colle de travers, il
 * tamponne, il imprime en trame, il souligne au feutre. Chaque élément
 * ci-dessous est une de ces gestuelles, disponible partout dans le site.
 *
 * RÈGLE D'USAGE : jamais deux fois la même rotation à la suite. Les variantes
 * `colle-1/2/3` existent pour ça — si deux étiquettes voisines penchent
 * pareil, l'effet « posé à la main » s'effondre et on retombe dans la grille.
 */

/* ========================================================================== */
/*  TAMPON                                                                     */
/* ========================================================================== */

/**
 * Le cachet à l'encre, posé de travers.
 *
 * Remplace la « pastille » arrondie générique. Le contour est épais, la
 * rotation est franche, et rien n'est centré.
 */
export function Tampon({
  children,
  className,
  ton = "rouge",
}: {
  children: React.ReactNode;
  className?: string;
  ton?: "rouge" | "encre" | "creme" | "jaune";
}) {
  const tons = {
    rouge: "text-rouge-fonce",
    encre: "text-encre",
    creme: "text-creme",
    jaune: "text-jaune",
  } as const;

  return (
    <span className={cn("tampon text-xs", tons[ton], className)}>{children}</span>
  );
}

/* ========================================================================== */
/*  ÉTIQUETTE COLLÉE                                                           */
/* ========================================================================== */

/**
 * L'étiquette autocollante. Coins nets, ombre portée dure, légèrement tournée.
 *
 * `inclinaison` prend 1, 2 ou 3 — trois angles différents, à alterner.
 */
export function Etiquette({
  children,
  className,
  inclinaison = 1,
  ton = "jaune",
}: {
  children: React.ReactNode;
  className?: string;
  inclinaison?: 1 | 2 | 3;
  ton?: "jaune" | "rouge" | "vert" | "creme";
}) {
  const tons = {
    jaune: "bg-jaune text-encre",
    rouge: "bg-rouge text-encre",
    vert: "bg-vert text-encre",
    creme: "bg-creme text-encre",
  } as const;

  return (
    <span
      className={cn(
        "inline-block px-3 py-1.5 text-[0.7rem] font-extrabold tracking-wide uppercase",
        "shadow-[3px_3px_0_rgb(23_16_13_/_0.85)]",
        tons[ton],
        `colle-${inclinaison}`,
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ========================================================================== */
/*  TRAIT TRACÉ À LA MAIN                                                      */
/* ========================================================================== */

/**
 * Séparateur au feutre.
 *
 * Un `<hr>` est une ligne parfaite : c'est exactement ce qu'on veut éviter.
 * Ce tracé a une épaisseur qui varie et ne finit pas droit.
 */
export function TraitMain({
  className,
  ton = "encre",
}: {
  className?: string;
  ton?: "encre" | "creme" | "rouge";
}) {
  const couleurs = {
    encre: "var(--encre)",
    creme: "var(--creme)",
    rouge: "var(--rouge)",
  } as const;

  return (
    <svg
      viewBox="0 0 600 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-3 w-full", className)}
    >
      <path
        d="M2,7 Q60,3.5 118,5.6 Q176,7.7 236,4.9 Q296,2.1 354,6.4 Q412,10.7 470,5.8 Q528,0.9 598,6.2"
        fill="none"
        stroke={couleurs[ton]}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

/* ========================================================================== */
/*  CADRE PHOTO                                                                */
/* ========================================================================== */

/**
 * Le tirage papier, punaisé.
 *
 * Bordure épaisse, ombre portée DURE et décalée (pas un flou), rotation
 * légère. C'est ce qui remplace la carte à coins arrondis et ombre diffuse.
 *
 * L'ombre dure a une raison technique en plus d'être un parti pris : une ombre
 * floue sur fond clair devient une bouillie grise, alors qu'un aplat décalé
 * reste net à toutes les tailles et ne coûte rien à composer.
 */
export function CadrePhoto({
  children,
  className,
  inclinaison = 1,
  ton = "encre",
}: {
  children: React.ReactNode;
  className?: string;
  inclinaison?: 1 | 2 | 3 | 0;
  ton?: "encre" | "rouge";
}) {
  return (
    <div
      className={cn(
        "bg-creme border-encre relative border-4",
        ton === "rouge" ? "cadre-decale-rouge" : "cadre-decale",
        inclinaison > 0 && `colle-${inclinaison}`,
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ========================================================================== */
/*  NUMÉRO D'ORDRE                                                             */
/* ========================================================================== */

/**
 * Le grand chiffre de section.
 *
 * Détouré et non plein : il structure sans peser, et évite le bloc de couleur
 * massif qui alourdit une mise en page claire.
 */
export function Numero({
  children,
  className,
  ton = "encre",
}: {
  children: React.ReactNode;
  className?: string;
  ton?: "encre" | "creme" | "rouge";
}) {
  const traits = {
    encre: "var(--encre)",
    creme: "var(--creme)",
    rouge: "var(--rouge)",
  } as const;

  return (
    <span
      aria-hidden="true"
      className={cn("font-poster leading-none", className)}
      style={{
        WebkitTextStroke: `2px ${traits[ton]}`,
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}

/* ========================================================================== */
/*  ENTOURAGE AU FEUTRE                                                        */
/* ========================================================================== */

/**
 * Le cercle tracé autour d'un mot, comme sur une carte annotée.
 *
 * Deux passes légèrement décalées : un cercle unique et parfait aurait
 * exactement le défaut qu'on cherche à corriger.
 */
export function Entoure({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block px-3 py-1", className)}>
      <svg
        viewBox="0 0 200 70"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <g fill="none" stroke="var(--rouge)" strokeWidth="3" strokeLinecap="round">
          <path d="M18,12 C60,4 150,5 184,16 C196,26 194,50 178,58 C140,68 52,67 20,58 C6,50 6,22 18,12" />
          <path
            opacity="0.5"
            d="M22,16 C64,9 148,10 180,20 C190,29 188,47 174,54 C138,63 56,62 24,54 C12,46 12,25 22,16"
          />
        </g>
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
