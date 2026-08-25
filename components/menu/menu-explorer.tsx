"use client";

import * as React from "react";
import { Filter } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import { TiltCard } from "@/components/shared/tilt-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  menuCategories,
  type MenuCategory,
  type MenuItem,
} from "@/lib/menu-data";

type Filtre = MenuCategory | "tout";

/**
 * Explorateur de carte : filtres de catégorie 100 % côté client.
 * Les données arrivent en props depuis un composant serveur, pour pouvoir
 * brancher plus tard un vrai CMS sans toucher à cette UI.
 */
export function MenuExplorer({ items }: { items: MenuItem[] }) {
  const [filtre, setFiltre] = React.useState<Filtre>("tout");

  const filtered = React.useMemo(
    () => (filtre === "tout" ? items : items.filter((item) => item.category === filtre)),
    [filtre, items],
  );

  const currentBlurb =
    filtre === "tout"
      ? "Toute la carte, du plus croustillant au plus vert."
      : menuCategories.find((category) => category.id === filtre)?.blurb;

  return (
    <div>
      {/* Barre de filtres */}
      <div className="border-line bg-cream/92 sticky top-20 z-30 -mx-5 border-b px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
        <div
          role="group"
          aria-label="Filtrer la carte par catégorie"
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          <span className="text-ink-soft mr-1 hidden shrink-0 items-center gap-2 text-xs font-semibold tracking-widest uppercase sm:flex">
            <Filter size={14} aria-hidden="true" />
            Filtrer
          </span>

          <FiltreButton
            active={filtre === "tout"}
            onClick={() => setFiltre("tout")}
            count={items.length}
          >
            Tout
          </FiltreButton>

          {menuCategories.map((category) => (
            <FiltreButton
              key={category.id}
              active={filtre === category.id}
              onClick={() => setFiltre(category.id)}
              count={items.filter((item) => item.category === category.id).length}
            >
              {category.label}
            </FiltreButton>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="text-ink-soft mt-8 text-sm">
        {currentBlurb} — {filtered.length}{" "}
        {filtered.length > 1 ? "recettes affichées" : "recette affichée"}.
      </p>

      <ul className="stage-3d mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => (
          <Reveal as="li" key={item.id} delay={Math.min(index, 5) * 0.06}>
            <TiltCard
              maxTilt={6}
              lift={10}
              className="group border-line hover:border-brand flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-[var(--shadow-float-sm)] transition-[box-shadow,border-color] duration-500 hover:shadow-[var(--shadow-float-lg)]"
            >
            <div className="relative aspect-[4/3] overflow-hidden">
              <SmartImage
                photo={item.photo}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                cdnWidth={800}
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"
              />
              {item.featured ? (
                <Badge className="absolute top-4 left-4">Signature</Badge>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-ink text-xl font-extrabold tracking-tight">
                  {item.name}
                </h3>
                {/* Prix placeholder : voir `lib/menu-data.ts`. */}
                <span className="text-brand-ink font-display shrink-0 text-lg font-extrabold">
                  {item.price}
                </span>
              </div>

              <p className="text-ink-soft text-sm leading-relaxed">
                {item.description}
              </p>

              <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="muted">{tag}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            </TiltCard>
          </Reveal>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-ink-soft py-16 text-center">
          Aucune recette dans cette catégorie pour le moment.
        </p>
      ) : null}
    </div>
  );
}

function FiltreButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "font-display shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        active
          ? "border-brand bg-brand text-ink"
          : "border-ink/15 text-ink/75 hover:border-ink/40 hover:text-ink",
      )}
    >
      {children}
      <span className={cn("ml-2 text-xs", active ? "text-ink" : "text-ink-soft")}>
        {count}
      </span>
    </button>
  );
}
