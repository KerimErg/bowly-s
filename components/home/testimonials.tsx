import { Star } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * ⚠️ AVIS D'EXEMPLE — AUCUNE PERSONNE RÉELLE
 * Ces témoignages servent uniquement à valider la mise en page. Les prénoms
 * sont fictifs et génériques. À remplacer par de vrais avis (avec accord
 * explicite des clients) ou par un widget d'avis vérifiés avant mise en ligne.
 */
const sampleReviews = [
  {
    quote:
      "Exemple d'avis : le bowl arrive vite, il est encore chaud, et le croustillant tient jusqu'à la dernière bouchée.",
    author: "Camille",
    context: "Avis d'exemple",
    rating: 5,
  },
  {
    quote:
      "Exemple d'avis : enfin une adresse où je peux composer exactement ce que je veux sans y passer un quart d'heure.",
    author: "Yanis",
    context: "Avis d'exemple",
    rating: 5,
  },
  {
    quote:
      "Exemple d'avis : la version végé est aussi généreuse que les autres, ce qui est rare. Les sauces font vraiment la différence.",
    author: "Léa",
    context: "Avis d'exemple",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section
      aria-labelledby="avis-titre"
      className="bowly-container py-24 lg:py-32"
    >
      <div>
        <SectionHeading
          align="center"
          eyebrow="Ils en parlent"
          title={<span id="avis-titre">Ce qu&apos;on aimerait lire sur nos murs.</span>}
          description="Bowly's n'a pas encore ouvert. Ces avis sont des exemples, avec des prénoms fictifs."
        />

        <ul className="mt-16 grid gap-6 lg:grid-cols-3">
          {sampleReviews.map((review, index) => (
            <Reveal
              as="li"
              key={review.author}
              delay={index * 0.1}
              className="border-line hover:border-brand flex flex-col gap-5 rounded-3xl border bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(28,19,16,0.4)]"
            >
              <div
                className="flex gap-1"
                role="img"
                aria-label={`Note d'exemple : ${review.rating} sur 5`}
              >
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={16}
                    aria-hidden="true"
                    className={
                      starIndex < review.rating
                        ? "fill-brand text-brand"
                        : "text-line"
                    }
                  />
                ))}
              </div>

              <blockquote className="text-ink leading-relaxed">
                « {review.quote} »
              </blockquote>

              <footer className="mt-auto flex items-center gap-3">
                <span className="bg-brand-wash text-brand-ink font-display flex size-10 items-center justify-center rounded-full text-sm font-bold">
                  {review.author.charAt(0)}
                </span>
                <span>
                  <span className="font-display text-ink block text-sm font-bold">
                    {review.author}
                  </span>
                  <span className="text-ink-soft text-xs">
                    {review.context}
                  </span>
                </span>
              </footer>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
