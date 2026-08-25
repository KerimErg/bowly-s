import { Leaf, SlidersHorizontal, Sparkles, Timer } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

/** Les 4 promesses de la marque. Textes marketing, à valider avec la marque. */
const pillars = [
  {
    icon: Leaf,
    title: "Fraîcheur",
    text: "Légumes coupés le matin même, protéines marinées maison, aucune friteuse qui tourne depuis la veille.",
  },
  {
    icon: SlidersHorizontal,
    title: "Personnalisation",
    text: "Base, protéine, légumes, sauce, topping : chaque bowl se compose sous vos yeux, ligne après ligne.",
  },
  {
    icon: Timer,
    title: "Rapidité",
    text: "Une file qui avance, un bowl assemblé en quelques minutes. Pensé pour une vraie pause déjeuner.",
  },
  {
    icon: Sparkles,
    title: "Qualité",
    text: "Filières sélectionnées, recettes signées en cuisine, sauces sans arôme artificiel. Le croustillant en plus.",
  },
];

export function WhyBowlys() {
  return (
    <section
      id="pourquoi"
      aria-labelledby="pourquoi-titre"
      className="bowly-container scroll-mt-24 py-24 lg:py-32"
    >
      <SectionHeading
        eyebrow="Pourquoi Bowly's"
        title={
          <span id="pourquoi-titre">
            Le fast-food qui ne
            <br className="hidden sm:block" /> vous demande{" "}
            <span className="text-brand">aucun compromis</span>.
          </span>
        }
        description="Manger vite ne devrait pas vouloir dire manger mal — ni manger triste. Bowly's tient les deux bouts."
      />

      <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, index) => (
          <Reveal
            as="li"
            key={pillar.title}
            delay={index * 0.08}
            className="group bg-ink-800 hover:bg-ink-700 relative flex flex-col gap-4 p-8 transition-colors duration-500 lg:p-10"
          >
            <span className="bg-brand/12 text-brand ring-brand/25 group-hover:bg-brand flex size-12 items-center justify-center rounded-2xl ring-1 transition-all duration-500 group-hover:text-ink">
              <pillar.icon size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-cream text-xl font-extrabold tracking-tight">
              {pillar.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {pillar.text}
            </p>
            {/* Filet orange qui se déploie au survol. */}
            <span
              aria-hidden="true"
              className="bg-brand absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
