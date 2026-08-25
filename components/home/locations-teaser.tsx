import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/images";
import { contactInfo, TODO } from "@/lib/site";

/** Teaser localisation — la carte complète vit sur /restaurants. */
export function LocationsTeaser() {
  return (
    <section
      aria-labelledby="localisation-titre"
      className="bg-sand py-24 lg:py-32"
    >
      <div className="bowly-container"><div className="border-line grid overflow-hidden rounded-3xl border bg-white lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <p className="eyebrow mb-4">Nous trouver</p>
          <h2 id="localisation-titre" className="text-display text-ink text-4xl sm:text-5xl">
            Trouve ton <span className="text-brand-ink">Bowly&apos;s</span>.
          </h2>
          <p className="text-ink-soft mt-5 leading-relaxed">
            Le premier comptoir arrive bientôt.
          </p>

          <dl className="mt-9 flex flex-col gap-5 text-sm">
            <div className="flex items-start gap-3">
              <dt className="sr-only">Adresse</dt>
              <MapPin size={17} className="text-brand-ink mt-0.5 shrink-0" aria-hidden="true" />
              <dd className="text-ink">
                {contactInfo.address}, {contactInfo.postalCode} {contactInfo.city}
              </dd>
            </div>
            <div className="flex items-start gap-3">
              <dt className="sr-only">Horaires</dt>
              <Clock size={17} className="text-brand-ink mt-0.5 shrink-0" aria-hidden="true" />
              <dd className="text-ink">Horaires d&apos;ouverture {TODO}</dd>
            </div>
            <div className="flex items-start gap-3">
              <dt className="sr-only">Téléphone</dt>
              <Phone size={17} className="text-brand-ink mt-0.5 shrink-0" aria-hidden="true" />
              <dd className="text-ink">{contactInfo.phone}</dd>
            </div>
          </dl>

          <Button asChild variant="outline" className="mt-10 w-fit">
            <Link href="/restaurants">
              Voir nos restaurants
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>

        <Reveal from="right" className="relative min-h-[320px] lg:min-h-full">
          <SmartImage
            photo={photos.restaurant}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-transparent lg:block" />
        </Reveal>
      </div></div>
    </section>
  );
}
