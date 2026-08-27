import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bike, ShoppingBag, Store } from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { TODO, contactInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Commander",
  description:
    "Sur place, à emporter ou en livraison : les modes de commande Bowly's. Aucun restaurant n'est encore ouvert.",
};

/**
 * PAGE DE COMMANDE.
 *
 * ⚠️ LA PAGE LA PLUS SENSIBLE DU SITE.
 * On ne peut pas commander : aucun restaurant n'a ouvert et aucune plateforme
 * n'est branchée. La tentation serait d'afficher un beau bouton « Commander »
 * qui ne fait rien, ou pire, de renvoyer vers un service de livraison au
 * hasard. Les deux reviendraient à tromper quelqu'un qui a faim.
 *
 * Le parti pris : dire la vérité en haut de page, puis livrer le GABARIT
 * complet des trois modes de commande. Le jour où une plateforme existe,
 * chaque carte reçoit son lien et la page fonctionne — rien à redessiner.
 *
 * La seule action réellement possible aujourd'hui est proposée en bas :
 * demander à être prévenu de l'ouverture.
 */

const MODES = [
  {
    icone: Store,
    titre: "Sur place",
    ligne: "Composé devant toi, servi en cinq minutes.",
    detail:
      "Le comptoir est ouvert sur la cuisine : tu vois la panure sortir de l'huile et la sauce tomber sur ton bowl.",
    statut: "Aucun restaurant ouvert",
  },
  {
    icone: ShoppingBag,
    titre: "À emporter",
    ligne: "Boîte pensée pour que ça craque encore.",
    detail:
      "Le croustillant voyage à part et se verse au dernier moment. C'est le seul moyen qu'il tienne le trajet.",
    statut: "Plateforme non branchée",
  },
  {
    icone: Bike,
    titre: "En livraison",
    ligne: "Quand la zone le permettra.",
    detail:
      "Aucun partenaire n'est signé. Les zones de livraison seront annoncées avec l'ouverture du premier restaurant.",
    statut: "Partenaire non signé",
  },
];

export default function CommanderPage() {
  return (
    <>
      <PageHero
        kicker="Commander"
        lignes={[
          <span key="1">Pas encore.</span>,
          <span key="2" className="text-rouge-fonce">
            Bientôt.
          </span>,
        ]}
        chapo="Bowly's n'a pas encore ouvert. Aucune commande ne peut être passée aujourd'hui, et aucun bouton de cette page ne prétendra le contraire."
      />

      {/* --- Avertissement, en clair et en haut ---------------------------- */}
      <section className="bowly-wide">
        <Reveal>
          <div className="border-encre bg-jaune/25 rounded-[var(--radius)] border-2 p-7 shadow-[6px_6px_0_var(--encre)] md:p-9">
            <p className="kicker text-rouge-fonce">État du service</p>
            <p className="text-encre mt-4 text-lg leading-snug font-bold">
              Zéro restaurant ouvert. Zéro plateforme de commande connectée.
              Zéro partenaire de livraison signé.
            </p>
            <p className="text-encre-douce mt-4 max-w-2xl text-sm leading-relaxed">
              Les trois modes ci-dessous décrivent le service tel qu&apos;il est
              prévu. Ils sont présentés pour que vous sachiez à quoi vous
              attendre, pas pour laisser croire qu&apos;ils fonctionnent
              aujourd&apos;hui.
            </p>
          </div>
        </Reveal>
      </section>

      {/* --- Les trois modes ------------------------------------------------ */}
      <section aria-labelledby="modes-titre" className="bowly-wide py-20 md:py-28">
        <Reveal>
          <h2 id="modes-titre" className="poster-section text-encre">
            Trois façons, à terme.
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {MODES.map((mode, i) => (
            <Reveal as="li" key={mode.titre} delay={i * 0.06}>
              <div className="bg-creme border-2 border-encre flex h-full flex-col rounded-[var(--radius)] p-7">
                <span className="border-trait text-rouge-fonce flex size-12 items-center justify-center rounded-full border">
                  <mode.icone size={20} aria-hidden="true" />
                </span>

                <h3 className="poster-section text-encre mt-6">{mode.titre}</h3>
                <p className="text-encre mt-3 text-base font-bold">{mode.ligne}</p>
                <p className="text-encre-douce mt-3 flex-1 text-sm leading-relaxed">
                  {mode.detail}
                </p>

                {/* Le bouton est désactivé, et il DIT pourquoi. Un bouton
                    actif qui ne fait rien serait pire qu'un bouton grisé. */}
                <button
                  type="button"
                  disabled
                  className="border-encre/30 text-encre-faible mt-7 w-full cursor-not-allowed rounded-[var(--radius)] border-2 border-dashed px-5 py-3 text-sm font-bold"
                >
                  {mode.statut}
                </button>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* --- Ce qu'on peut vraiment faire ---------------------------------- */}
      <section aria-labelledby="prevenir-titre" className="relative overflow-hidden py-20 md:py-28">


        <div className="bowly-wide relative">
          <Reveal>
            <p className="kicker text-rouge-fonce">Ce qui est possible, maintenant</p>
            <h2 id="prevenir-titre" className="poster-title text-encre mt-5">
              Sois prévenu
              <br />
              <span className="text-rouge-fonce">le premier jour.</span>
            </h2>
            <p className="lead mt-6 max-w-lg">
              Laisse une adresse et la ville où tu voudrais qu&apos;on ouvre. Ça
              ne coûte rien et ça compte : les premiers emplacements ne sont pas
              arrêtés.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" data-curseur="Écrire">
                <Link href="/contact">
                  Me prévenir de l&apos;ouverture
                  <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/menu">Regarder la carte en attendant</Link>
              </Button>
            </div>

            <dl className="border-trait mt-14 grid gap-8 border-t pt-10 sm:grid-cols-3">
              {[
                ["Téléphone", contactInfo.phone],
                ["E-mail", contactInfo.email],
                ["Ouverture", TODO],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="kicker text-encre-faible">{k}</dt>
                  <dd className="text-encre-douce mt-2 text-sm break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}
