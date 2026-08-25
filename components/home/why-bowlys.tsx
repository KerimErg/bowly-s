import { Flame, Leaf, SlidersHorizontal, Timer } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";

/**
 * Les 4 raisons de venir.
 *
 * Ton volontairement street-food : tutoiement, phrases courtes, envie plutôt
 * qu'argumentaire. Pas de « nous nous engageons à » — on dit ce que ça fait
 * dans la bouche. Textes à valider avec la marque.
 */
const pillars = [
  {
    icon: Flame,
    title: "Ça croustille.",
    text: "Panure maison, cuisson minute. Ça croque jusqu'à la dernière bouchée.",
  },
  {
    icon: SlidersHorizontal,
    title: "Tu composes.",
    text: "Base, protéine, sauce, topping. C'est toi qui décides. Ligne par ligne.",
  },
  {
    icon: Timer,
    title: "Ça va vite.",
    text: "Commandé, assemblé, servi. Le temps d'une vraie pause, pas d'une queue.",
  },
  {
    icon: Leaf,
    title: "C'est frais.",
    text: "Coupé le matin, cuisiné sur place. Rien ne traîne, rien ne réchauffe.",
  },
];

export function WhyBowlys() {
  return (
    <section
      id="pourquoi"
      aria-labelledby="pourquoi-titre"
      className="bowly-container scroll-mt-24 py-24 lg:py-32"
    >
      <Reveal className="max-w-2xl">
        <p className="eyebrow mb-4">Pourquoi Bowly&apos;s</p>
        <h2 id="pourquoi-titre" className="text-display text-ink text-5xl sm:text-6xl lg:text-7xl">
          Prêt à <span className="text-brand-ink">craquer</span> ?
        </h2>
        <p className="text-ink-soft mt-5 text-lg">
          Quatre bonnes raisons. Pas une de plus.
        </p>
      </Reveal>

      <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, index) => (
          <Reveal
            as="li"
            key={pillar.title}
            delay={index * 0.08}
            className="group border-line hover:border-brand relative flex flex-col gap-4 overflow-hidden rounded-3xl border bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(28,19,16,0.45)]"
          >
            <span className="bg-brand-wash text-brand-ink group-hover:bg-brand group-hover:text-ink flex size-12 items-center justify-center rounded-2xl transition-colors duration-500">
              <pillar.icon size={22} aria-hidden="true" />
            </span>
            <h3 className="font-display text-ink text-2xl font-extrabold tracking-tight">
              {pillar.title}
            </h3>
            <p className="text-ink-soft text-sm leading-relaxed">{pillar.text}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
