import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/shared/page-hero";
import { Reveal, Ruban } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { etatDesVisuels } from "@/lib/photos";
import { TODO } from "@/lib/site";

export const metadata: Metadata = {
  title: "La marque",
  description:
    "Ce que Bowly's veut être, et ce qui n'existe pas encore. Sans enjoliver.",
};

/**
 * LA MARQUE.
 *
 * ⚠️ CE QUI EST ÉCRIT ICI ET CE QUI NE PEUT PAS L'ÊTRE.
 * Une page « à propos » est l'endroit où l'on invente le plus : un fondateur,
 * une date de création, un chef formé quelque part, une première boutique.
 * Rien de tout cela n'existe. Cette page ne raconte donc AUCUN fait — pas de
 * personne, pas de date, pas de lieu, pas de chiffre.
 *
 * Ce qu'elle peut raconter sans mentir, ce sont les PARTIS PRIS : ce que la
 * marque a décidé de faire et de ne pas faire. Ce sont des intentions, elles
 * n'ont pas besoin d'un passé pour être vraies. Le bloc « ce qui n'existe pas
 * encore » les tient honnêtes en disant explicitement ce qui manque.
 */

const PARTIS_PRIS = [
  {
    numero: "01",
    titre: "Le croustillant décide de tout",
    texte:
      "Tout le reste s'organise autour. La panure sort de l'huile à la commande, jamais avant, et se pose en dernier. Un bowl où le croustillant a ramolli est un bowl raté — c'est le seul critère qui ne se négocie pas.",
  },
  {
    numero: "02",
    titre: "Cinq sauces, toutes maison",
    texte:
      "Pas quinze. Cinq, faites sur place, assez marquées pour qu'on les reconnaisse. Une carte de sauces industrielles est une carte sans point de vue.",
  },
  {
    numero: "03",
    titre: "Composé devant toi",
    texte:
      "Le comptoir donne sur la cuisine. Ce n'est pas de la mise en scène : quand on voit assembler, on comprend ce qu'on paie, et on choisit mieux.",
  },
  {
    numero: "04",
    titre: "Cinq minutes, pas dix",
    texte:
      "Un bowl doit être prêt le temps de payer. Au-delà, ce n'est plus de la restauration rapide, c'est un restaurant qui s'ignore.",
  },
];

/** Ce que la marque n'a pas encore — dit sans détour. */
const PAS_ENCORE = [
  ["Restaurant ouvert", "Aucun. Le premier emplacement n'est pas signé."],
  ["Équipe publique", `Non communiquée — ${TODO}`],
  ["Date de création", TODO],
  ["Siège social", TODO],
  ["Comptes sociaux", "Non ouverts. Aucun compte à ce nom n'est officiel."],
  ["Grille tarifaire", "Non arrêtée. Tous les prix du site sont des [X €]."],
];

export default function AboutPage() {
  const etat = etatDesVisuels();

  return (
    <>
      <PageHero
        kicker="La marque"
        lignes={[
          <span key="1">Une idée</span>,
          <span key="2" className="text-rouge-fonce">
            avant d&apos;être
          </span>,
          <span key="3">un restaurant.</span>,
        ]}
        chapo="Bowly's n'existe pas encore physiquement. Cette page dit ce que la marque a décidé d'être — et ce qui lui manque encore."
      />

      <Ruban
        mots={["croustillant", "composé devant toi", "cinq minutes", "cinq sauces", "zéro sachet"]}
        duree={46}
        className="font-poster text-encre/50 border-trait border-y py-5 text-3xl uppercase md:text-5xl"
      />

      {/* --- Les partis pris ----------------------------------------------- */}
      <section aria-labelledby="partis-titre" className="bowly-wide py-20 md:py-28">
        <Reveal>
          <p className="kicker text-rouge-fonce">Ce qui est décidé</p>
          <h2 id="partis-titre" className="poster-title text-encre mt-5">
            Quatre partis pris.
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-px md:grid-cols-2">
          {PARTIS_PRIS.map((parti, i) => (
            <Reveal as="li" key={parti.numero} delay={i * 0.05}>
              <div className="border-trait h-full border-t py-9 md:pr-10">
                <span className="font-poster text-rouge-fonce text-4xl leading-none" aria-hidden="true">
                  {parti.numero}
                </span>
                <h3 className="text-encre mt-5 text-2xl font-bold tracking-tight">
                  {parti.titre}
                </h3>
                <p className="text-encre-douce mt-4 max-w-md text-sm leading-relaxed">
                  {parti.texte}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* --- Ce qui manque -------------------------------------------------- */}
      <section
        aria-labelledby="manque-titre"
        className="border-trait bg-beurre/60 border-y py-20 md:py-28"
      >
        <div className="bowly-wide">
          <Reveal>
            <p className="kicker text-vert-fonce">Transparence</p>
            <h2 id="manque-titre" className="poster-title text-encre mt-5">
              Ce qui n&apos;existe
              <br />
              <span className="text-rouge-fonce">pas encore.</span>
            </h2>
            <p className="lead mt-6 max-w-xl">
              Ce site est une maquette de marque, pas la vitrine d&apos;une
              enseigne en activité. Voilà tout ce qui reste à remplir.
            </p>
          </Reveal>

          <dl className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {PAS_ENCORE.map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.04}>
                <dt className="kicker text-encre-faible">{k}</dt>
                <dd className="text-encre-douce mt-2.5 text-sm leading-relaxed">{v}</dd>
              </Reveal>
            ))}
          </dl>

          {/* --- Où en sont les visuels ---
              Ce compteur est calculé à partir de `lib/photos.ts`. Il se met
              donc à jour tout seul à mesure que les vraies photos arrivent —
              plutôt qu'un texte figé qui deviendrait faux au premier ajout. */}
          <Reveal delay={0.2}>
            <div className="border-encre bg-creme mt-14 border-2 p-7 shadow-[6px_6px_0_var(--encre)]">
              <p className="kicker text-rouge-fonce">Où en sont les visuels</p>
              <dl className="mt-5 grid gap-5 sm:grid-cols-3">
                {[
                  ["Photos de plats", `${etat.bowlsFournis} / ${etat.bowlsTotal}`],
                  ["Plans cinéma", `${etat.plansFournis} / ${etat.plansTotal}`],
                  ["Vidéos", `${etat.videosFournies} / ${etat.plansTotal}`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="kicker text-encre-faible">{k}</dt>
                    <dd className="font-poster text-encre tabular mt-1.5 text-3xl">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-encre-douce mt-6 max-w-2xl text-xs leading-relaxed">
                Tant qu&apos;une case est vide, le site affiche une{" "}
                <strong className="text-encre">illustration dessinée</strong>{" "}
                (voir <code>scripts/generate-assets.mjs</code>). Ces
                illustrations ne représentent aucun plat réellement servi, et{" "}
                <strong className="text-encre">
                  aucune photo n&apos;est empruntée à une autre enseigne
                </strong>{" "}
                — ni maintenant, ni en maquette. Pour les remplacer, il n&apos;y
                a qu&apos;un fichier à ouvrir : <code>lib/photos.ts</code>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- Sortie --------------------------------------------------------- */}
      <section className="bowly-wide py-20 md:py-28">
        <Reveal>
          <h2 className="poster-title text-encre">
            Envie d&apos;en être
            <br />
            <span className="text-rouge-fonce">au début&nbsp;?</span>
          </h2>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl" data-curseur="Écrire">
              <Link href="/contact">Nous écrire</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/menu">Voir la carte</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
