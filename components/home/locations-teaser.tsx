import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/images";

/**
 * Teaser localisation : une photo pleine largeur, un titre, un bouton.
 * Les coordonnées détaillées vivent sur /restaurants — les répéter ici
 * n'ajoutait que du texte.
 */
export function LocationsTeaser() {
  return (
    <section aria-labelledby="localisation-titre" className="bowly-container py-20 lg:py-24">
      <Reveal className="relative overflow-hidden rounded-[2.5rem]">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          <SmartImage
            photo={photos.restaurant}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            cdnWidth={1600}
            fallbackTone="dark"
            className="object-cover"
          />
          <div aria-hidden="true" className="photo-scrim absolute inset-0" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
          <h2 id="localisation-titre" className="text-display text-4xl text-white sm:text-5xl">
            Trouve ton <span className="text-brand">Bowly&apos;s</span>.
          </h2>
          <Button asChild variant="invert" className="mt-6">
            <Link href="/restaurants">
              Nos restaurants
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
