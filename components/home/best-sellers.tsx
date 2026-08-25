import Link from "next/link";

import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Coverflow3DCarousel } from "@/components/ui/3-d-coverflow-carousel";

/**
 * Section « Nos best-sellers » — intégration du carousel 3D coverflow.
 * Les 5 bowls signature sont fournis par `defaultDishes` dans le composant ;
 * on peut aussi passer une sélection via la prop `dishes`.
 */
export function BestSellers() {
  return (
    <section
      id="best-sellers"
      aria-labelledby="best-sellers-titre"
      className="bg-ink relative scroll-mt-24 overflow-hidden py-24 lg:py-32"
    >
      <div className="bowly-container">
        <SectionHeading
          align="center"
          eyebrow="Nos best-sellers"
          title={
            <span id="best-sellers-titre">
              Les cinq bowls qu&apos;on nous
              <br className="hidden sm:block" /> redemande{" "}
              <span className="text-brand">chaque semaine</span>.
            </span>
          }
          description="Faites défiler, attrapez la carte du milieu, et laissez-vous tenter. Vous pouvez aussi utiliser les flèches du clavier."
        />
      </div>

      <div className="mt-14">
        <Coverflow3DCarousel
          accentColor="#ff5a1f"
          backgroundColor="transparent"
          ariaLabel="Les bowls best-sellers de Bowly's"
        />
      </div>

      <Reveal className="bowly-container flex justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/menu">Découvrir toute la carte</Link>
        </Button>
      </Reveal>
    </section>
  );
}
