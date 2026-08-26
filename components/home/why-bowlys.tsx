import { Reveal } from "@/components/shared/reveal";

/**
 * L'accroche : quatre arguments d'une phrase, sur une seule bande.
 *
 * C'étaient quatre grandes cartes avec icônes ; elles occupaient un écran
 * entier de texte entre le hero et les bowls. Réduites à une ligne, elles
 * laissent la place aux photos.
 */
const arguments_ = [
  "Frais, jamais congelé.",
  "100 % composé par toi.",
  "Prêt en moins de 5 minutes.",
  "Aussi bon que ça en a l'air.",
];

export function WhyBowlys() {
  return (
    <section aria-labelledby="accroche-titre" className="border-line border-y bg-sand">
      <h2 id="accroche-titre" className="sr-only">
        Pourquoi Bowly&apos;s
      </h2>
      <Reveal className="bowly-container grid gap-x-8 gap-y-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-12">
        {arguments_.map((argument) => (
          <p
            key={argument}
            className="font-display text-ink flex items-baseline gap-3 text-lg font-extrabold tracking-tight"
          >
            <span aria-hidden="true" className="text-brand-ink">
              —
            </span>
            {argument}
          </p>
        ))}
      </Reveal>
    </section>
  );
}
