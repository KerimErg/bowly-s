import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { TODO, contactInfo, openingHours } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nos restaurants",
  description:
    "Aucun restaurant Bowly's n'est encore ouvert. Cinq emplacements sont à l'étude.",
};

/**
 * NOS RESTAURANTS.
 *
 * ⚠️ Aucune adresse n'est inventée. Zéro restaurant ouvert, donc zéro fiche
 * établissement : afficher une carte avec des punaises fictives serait une
 * information fausse sur un sujet où les gens se déplacent réellement.
 *
 * La page livre le GABARIT d'une fiche restaurant, entièrement en
 * `[À COMPLÉTER]`. Le jour où un bail est signé, on remplit `contactInfo` et
 * `openingHours` dans `lib/site.ts` et la fiche s'affiche telle quelle.
 */
export default function RestaurantsPage() {
  return (
    <>
      <PageHero
        kicker="Nos restaurants"
        lignes={[
          <span key="1">Zéro ouvert.</span>,
          <span key="2" className="text-rouge-fonce">
            Cinq à l&apos;étude.
          </span>,
        ]}
        chapo="Aucun emplacement n'est arrêté. Nous ne publierons une adresse que le jour où elle sera signée."
        enfants={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" data-curseur="Proposer">
              <Link href="/contact">Propose ta ville</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/menu">Voir la carte</Link>
            </Button>
          </div>
        }
      />

      {/* --- La fiche type -------------------------------------------------- */}
      <section aria-labelledby="fiche-titre" className="bowly-wide py-16 md:py-24">
        <Reveal>
          <p className="kicker text-vert-fonce">Gabarit</p>
          <h2 id="fiche-titre" className="poster-section text-encre mt-4">
            À quoi ressemblera une fiche.
          </h2>
          <p className="text-encre-douce mt-4 max-w-xl text-sm leading-relaxed">
            Voici la fiche telle qu&apos;elle s&apos;affichera pour chaque
            restaurant. Toutes les valeurs sont des placeholders — aucune
            n&apos;a été inventée pour meubler.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <article className="bg-creme border-2 border-encre mt-10 overflow-hidden rounded-[var(--radius)]">
            <div className="border-trait flex flex-wrap items-center justify-between gap-4 border-b px-7 py-6">
              <div>
                <h3 className="poster-section text-encre">Bowly&apos;s {TODO}</h3>
                <p className="text-encre-faible mt-1.5 text-xs">
                  Établissement n° 01 — non ouvert
                </p>
              </div>
              <span className="border-trait text-encre-faible rounded-full border px-4 py-2 text-xs font-semibold">
                Ouverture {TODO}
              </span>
            </div>

            <div className="grid gap-px md:grid-cols-3">
              <div className="p-7">
                <span className="text-rouge-fonce flex items-center gap-2">
                  <MapPin size={15} aria-hidden="true" />
                  <span className="kicker">Adresse</span>
                </span>
                <p className="text-encre-douce mt-4 text-sm leading-relaxed">
                  {contactInfo.address}
                  <br />
                  {contactInfo.postalCode} {contactInfo.city}
                </p>
              </div>

              <div className="border-trait p-7 md:border-x">
                <span className="text-rouge-fonce flex items-center gap-2">
                  <Phone size={15} aria-hidden="true" />
                  <span className="kicker">Téléphone</span>
                </span>
                <p className="text-encre-douce mt-4 text-sm">{contactInfo.phone}</p>
                <p className="text-encre-faible mt-6 text-xs">Accès</p>
                <p className="text-encre-douce mt-1 text-sm">{TODO}</p>
              </div>

              <div className="p-7">
                <span className="text-rouge-fonce flex items-center gap-2">
                  <Clock size={15} aria-hidden="true" />
                  <span className="kicker">Horaires</span>
                </span>
                <dl className="mt-4 flex flex-col gap-1.5">
                  {openingHours.map((jour) => (
                    <div key={jour.day} className="flex justify-between gap-4 text-sm">
                      <dt className="text-encre-douce">{jour.day}</dt>
                      <dd className="text-encre-faible">{jour.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      {/* --- Les cinq emplacements ------------------------------------------ */}
      <section
        aria-labelledby="etude-titre"
        className="border-trait bg-beurre/60 border-y py-16 md:py-24"
      >
        <div className="bowly-wide">
          <Reveal>
            <h2 id="etude-titre" className="poster-section text-encre">
              Cinq emplacements à l&apos;étude.
            </h2>
            <p className="text-encre-douce mt-4 max-w-xl text-sm leading-relaxed">
              Aucune ville n&apos;est arrêtée. Les cinq lignes ci-dessous
              existent pour que vous voyiez l&apos;état d&apos;avancement, pas
              pour laisser deviner un lieu.
            </p>
          </Reveal>

          <ul className="mt-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <Reveal as="li" key={i} delay={i * 0.05}>
                <div className="border-trait flex flex-wrap items-center justify-between gap-4 border-t py-6">
                  <div className="flex items-center gap-5">
                    <span
                      className="font-poster text-encre-faible text-2xl leading-none"
                      aria-hidden="true"
                    >
                      0{i + 1}
                    </span>
                    <span className="text-encre text-base font-bold">{TODO}</span>
                  </div>
                  <span className="text-encre-faible text-xs">
                    Bail non signé · Ouverture {TODO}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bowly-wide py-20 md:py-28">
        <Reveal>
          <h2 className="poster-title text-encre">
            Ta ville
            <br />
            <span className="text-rouge-fonce">mérite mieux&nbsp;?</span>
          </h2>
          <p className="lead mt-6 max-w-lg">
            Dis-nous laquelle. Les premiers emplacements ne sont pas arrêtés,
            et les demandes comptent.
          </p>
          <Button asChild size="xl" className="mt-9" data-curseur="Proposer">
            <Link href="/contact">Proposer une ville</Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
