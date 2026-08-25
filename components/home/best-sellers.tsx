import Link from "next/link";

import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Coverflow3DCarousel } from "@/components/ui/3-d-coverflow-carousel";

/**
 * Section « Nos best-sellers » — intégration du carousel 3D coverflow.
 *
 * La section est claire ; seules les cartes du carousel restent sombres,
 * parce qu'elles portent du texte en réserve sur une photo.
 */
export function BestSellers() {
  return (
    <section
      id="best-sellers"
      aria-labelledby="best-sellers-titre"
      className="bg-sand relative scroll-mt-24 overflow-hidden py-24 lg:py-32"
    >
      <div className="bowly-container">
        <SectionHeading
          align="center"
          eyebrow="Nos best-sellers"
          title={
            <span id="best-sellers-titre">
              Les cinq qu&apos;on nous
              <br className="hidden sm:block" /> redemande{" "}
              <span className="text-brand-ink">chaque semaine</span>.
            </span>
          }
          description="Fais défiler, attrape celui du milieu. Les flèches du clavier marchent aussi."
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
          <Link href="/menu">Voir toute la carte</Link>
        </Button>
      </Reveal>
    </section>
  );
}
