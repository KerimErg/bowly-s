import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Train } from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/images";
import { contactInfo, openingHours, TODO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nos restaurants",
  description:
    "Adresse, horaires et accès du restaurant Bowly's. Informations en cours de confirmation avant l'ouverture.",
};

export default function RestaurantsPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos restaurants"
        title={
          <>
            Bientôt <span className="text-brand">près de chez vous</span>.
          </>
        }
        description="Le premier comptoir arrive bientôt."
        photo={photos.restaurant}
      />

      <section aria-labelledby="acces-titre" className="bowly-container py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* ------------------------------------------------------------------
              EMPLACEMENT CARTE
              TODO(intégration) : insérer ici l'iframe Google Maps (ou une carte
              MapLibre / Mapbox) une fois l'adresse confirmée. Exemple :
              <iframe
                title="Carte du restaurant Bowly's"
                src="https://www.google.com/maps/embed?pb=..."
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
              Pensez au consentement cookies avant de charger un service tiers.
          ------------------------------------------------------------------ */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="acces-titre" className="sr-only">
              Emplacement et accès
            </h2>
            <div
              role="img"
              aria-label="Emplacement réservé pour la carte Google Maps, non connectée"
              className="border-line bg-sand relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-3xl border lg:min-h-[520px]"
            >
              {/* Fond « plan » stylisé, purement décoratif. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.16]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(26,16,14,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(26,16,14,0.3) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <div
                aria-hidden="true"
                className="bg-brand/25 absolute top-1/2 left-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              />

              <div className="relative flex flex-col items-center gap-4 px-8 text-center">
                <span className="bg-brand text-ink flex size-14 items-center justify-center rounded-full shadow-[0_18px_50px_-12px_rgba(240,69,42,0.9)]">
                  <MapPin size={26} aria-hidden="true" />
                </span>
                <p className="font-display text-ink text-lg font-extrabold tracking-tight">
                  Zone d&apos;intégration Google&nbsp;Maps
                </p>
                <p className="text-ink-soft max-w-sm text-sm leading-relaxed">
                  La carte interactive sera branchée ici dès que l&apos;adresse du
                  restaurant sera confirmée. Voir le commentaire{" "}
                  <code className="text-brand-ink">TODO(intégration)</code> dans{" "}
                  <code>app/restaurants/page.tsx</code>.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Fiche pratique */}
          <Reveal from="right" className="flex flex-col gap-6">
            <div className="border-line rounded-3xl border bg-white p-8">
              <h2 className="font-display text-ink text-2xl font-extrabold tracking-tight">
                Bowly&apos;s — restaurant n°1
              </h2>

              <dl className="mt-7 flex flex-col gap-5 text-sm">
                <div className="flex items-start gap-3">
                  <dt className="sr-only">Adresse</dt>
                  <MapPin size={17} className="text-brand-ink mt-0.5 shrink-0" aria-hidden="true" />
                  <dd className="text-ink">
                    {contactInfo.address}
                    <br />
                    {contactInfo.postalCode} {contactInfo.city}
                  </dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="sr-only">Téléphone</dt>
                  <Phone size={17} className="text-brand-ink mt-0.5 shrink-0" aria-hidden="true" />
                  <dd className="text-ink">{contactInfo.phone}</dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="sr-only">E-mail</dt>
                  <Mail size={17} className="text-brand-ink mt-0.5 shrink-0" aria-hidden="true" />
                  <dd className="text-ink">{contactInfo.email}</dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="sr-only">Accès en transports</dt>
                  <Train size={17} className="text-brand-ink mt-0.5 shrink-0" aria-hidden="true" />
                  <dd className="text-ink">Accès en transports {TODO}</dd>
                </div>
              </dl>
            </div>

            <div className="border-line rounded-3xl border bg-white p-8">
              <h2 className="font-display text-ink flex items-center gap-2 text-lg font-extrabold tracking-tight">
                <Clock size={18} className="text-brand-ink" aria-hidden="true" />
                Horaires d&apos;ouverture
              </h2>

              <table className="mt-6 w-full text-sm">
                <caption className="sr-only">
                  Horaires d&apos;ouverture du restaurant Bowly&apos;s, en attente de
                  confirmation
                </caption>
                <tbody>
                  {openingHours.map((slot) => (
                    <tr key={slot.day} className="border-line border-b last:border-0">
                      <th scope="row" className="text-ink py-3 text-left font-medium">
                        {slot.day}
                      </th>
                      <td className="text-ink-soft py-3 text-right">
                        {slot.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-brand bg-brand-wash rounded-3xl border-2 p-8">
              <h2 className="font-display text-ink text-lg font-extrabold tracking-tight">
                Vous cherchez à ouvrir un Bowly&apos;s ?
              </h2>
              <p className="text-ink-soft mt-3 text-sm leading-relaxed">
                Le programme de franchise n&apos;est pas encore ouvert. Contact
                dédié : {contactInfo.franchiseEmail}.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
