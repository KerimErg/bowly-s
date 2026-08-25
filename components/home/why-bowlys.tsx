import Link from "next/link";
import { Flame, Hand, Snowflake, Timer } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { TiltCard } from "@/components/shared/tilt-card";
import { Button } from "@/components/ui/button";

/**
 * Les 4 raisons de venir.
 *
 * Ton street-food : une phrase, cinq mots maximum, aucune explication.
 * Pas de paragraphe sous les titres — l'argument se suffit à lui-même.
 * Textes à valider avec la marque.
 */
const pillars = [
  { icon: Snowflake, title: "Frais, jamais congelé." },
  { icon: Hand, title: "100 % composé par toi." },
  { icon: Timer, title: "Prêt en moins de 5 minutes." },
  { icon: Flame, title: "Aussi bon que ça en a l'air." },
];

export function WhyBowlys() {
  return (
    <section
      id="pourquoi"
      aria-labelledby="pourquoi-titre"
      className="bowly-container stage-3d scroll-mt-24 py-24 lg:py-32"
    >
      <Reveal className="max-w-2xl">
        <p className="eyebrow mb-4">Pourquoi Bowly&apos;s</p>
        <h2 id="pourquoi-titre" className="text-display text-ink text-5xl sm:text-6xl lg:text-7xl">
          Prêt à <span className="text-brand-ink">craquer</span> ?
        </h2>
      </Reveal>

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, index) => (
          <Reveal as="li" key={pillar.title} delay={index * 0.08}>
            <TiltCard
              maxTilt={8}
              lift={12}
              className="border-line h-full rounded-3xl border bg-white p-8 shadow-[var(--shadow-float-sm)] transition-shadow duration-500 hover:shadow-[var(--shadow-float-lg)]"
            >
              <span className="bg-brand text-ink mb-6 flex size-12 items-center justify-center rounded-2xl shadow-[var(--shadow-float-sm)]">
                <pillar.icon size={22} aria-hidden="true" />
              </span>
              <h3 className="font-display text-ink text-2xl font-extrabold tracking-tight">
                {pillar.title}
              </h3>
            </TiltCard>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.15} className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-display text-ink text-3xl sm:text-4xl">
          Un bowl, mille combos.{" "}
          <span className="text-brand-ink">Trouve le tien.</span>
        </p>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/menu">Voir le menu</Link>
        </Button>
      </Reveal>
    </section>
  );
}
