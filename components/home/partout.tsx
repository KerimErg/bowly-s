"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, MessageCircle, Play, Send } from "lucide-react";

import { Reveal, Ruban } from "@/components/shared/reveal";
import { visuelsBowls, type CleBowl } from "@/lib/assets";
import { TODO, socialLinks } from "@/lib/site";

/**
 * BOWLY'S IS EVERYWHERE
 *
 * ⚠️ SECTION SENSIBLE — SUITE.
 * Un mur social est le deuxième endroit où l'on ment sur un site de marque :
 * faux compteurs, faux commentaires, faux comptes. Les comptes Bowly's
 * n'existent pas encore. Donc :
 *   - aucun pseudo n'est inventé : chaque auteur est `[À COMPLÉTER]` ;
 *   - aucun compteur n'affiche de nombre : les emplacements sont dessinés,
 *     les valeurs manquent visiblement ;
 *   - aucune vidéo n'est empruntée ailleurs.
 *
 * Ce qui est livré, c'est la MAQUETTE FONCTIONNELLE : le jour où le premier
 * post existe, il prend la place d'une carte et tout s'allume.
 *
 * Le mouvement — deux rangées qui défilent en sens contraire — n'est pas
 * décoratif : c'est ce qui donne l'impression d'un flux vivant plutôt que
 * d'une grille figée, sans avoir à remplir douze cases de contenu.
 */

type Post = {
  bowl: CleBowl;
  format: "video" | "photo";
  legende: string;
};

/** Les légendes décrivent le plan, elles ne citent personne. */
const POSTS: Post[] = [
  { bowl: "the-og", format: "video", legende: "Le premier craquement." },
  { bowl: "spicy-bowly", format: "photo", legende: "Trois piments. Assumé." },
  { bowl: "crispy-korean", format: "video", legende: "Laqué en direct." },
  { bowl: "green-riot", format: "photo", legende: "Végétal, pas sage." },
  { bowl: "blue-lagoon", format: "video", legende: "Tranché à la commande." },
  { bowl: "the-heavy", format: "photo", legende: "Double. Sans négocier." },
];

export function Partout() {
  return (
    <section aria-labelledby="partout-titre" className="relative overflow-hidden py-24 md:py-32">
      <div className="bowly-wide">
        <Reveal>
          <p className="kicker text-rouge-fonce">Le flux</p>
          <h2 id="partout-titre" className="poster-title text-encre mt-5">
            Bowly&apos;s
            <br />
            <span className="text-rouge-fonce">is everywhere.</span>
          </h2>
          <p className="lead mt-6 max-w-lg">
            Enfin, presque. Les comptes ouvriront avec le premier restaurant.
            Voilà à quoi ressemblera le mur.
          </p>
        </Reveal>
      </div>

      {/* Deux rangées en sens contraire. `aria-hidden` sur les rubans : le
          contenu est purement illustratif et sa répétition n'apporte rien à
          un lecteur d'écran — le paragraphe ci-dessus dit tout. */}
      <div className="mt-14 space-y-5">
        <Rangee posts={POSTS} duree={64} />
        <Rangee posts={[...POSTS].reverse()} duree={78} sens="inverse" />
      </div>

      <div className="bowly-wide mt-14">
        <Reveal>
          <ul className="flex flex-wrap gap-3">
            {socialLinks.map((social) => (
              <li key={social.label}>
                {/* URL réelle inconnue : le lien reste inerte plutôt que de
                    pointer vers le compte de quelqu'un d'autre. */}
                <span className="bg-creme border-2 border-encre text-encre-douce inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm">
                  <Send size={14} aria-hidden="true" />
                  {social.label}
                  <span className="text-encre-faible text-xs">{social.handle}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Ruban
        mots={["#bowlys", "#enterthebowl", "#pasunbowl", "#croustillant"]}
        duree={30}
        separateur="·"
        className="font-poster text-encre/50 mt-16 py-4 text-3xl uppercase md:text-5xl"
      />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Rangee({
  posts,
  duree,
  sens = "normal",
}: {
  posts: Post[];
  duree: number;
  sens?: "normal" | "inverse";
}) {
  const serie = (
    <div className="flex shrink-0 gap-5 pr-5">
      {posts.map((post, i) => (
        <Carte key={`${post.bowl}-${i}`} post={post} />
      ))}
    </div>
  );

  return (
    <div className="fade-edges-x overflow-hidden" aria-hidden="true">
      <div
        className="marquee-track"
        style={
          {
            "--marquee-duration": `${duree}s`,
            animationDirection: sens === "inverse" ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {serie}
        {serie}
      </div>
    </div>
  );
}

function Carte({ post }: { post: Post }) {
  const visuel = visuelsBowls[post.bowl];

  return (
    <article className="border-trait bg-beurre w-56 shrink-0 overflow-hidden rounded-[var(--radius)] border">
      <div className="relative aspect-[9/16] overflow-hidden">
        {/* Le visuel du bowl, recadré en vertical : c'est le format des
            réseaux, et c'est celui qu'il faudra tourner. */}
        <Image
          src={visuel.src}
          alt=""
          fill
          sizes="14rem"
          loading="lazy"
          className="scale-[1.35] object-cover"
        />
        <div className="from-creme/90 absolute inset-0 bg-gradient-to-t to-transparent" />

        {post.format === "video" && (
          <span className="bg-creme/70 absolute top-3 right-3 flex size-8 items-center justify-center rounded-full backdrop-blur-sm">
            <Play size={13} className="text-encre" />
          </span>
        )}

        <p className="text-encre absolute inset-x-3 bottom-3 text-xs leading-snug font-semibold">
          {post.legende}
        </p>
      </div>

      <div className="p-3.5">
        <p className="text-encre-faible text-[0.65rem]">{TODO}</p>

        {/* Les compteurs sont dessinés, jamais chiffrés : un nombre inventé
            ici serait un faux témoignage. */}
        <div className="text-encre-faible mt-2.5 flex items-center gap-4 text-[0.65rem]">
          <span className="flex items-center gap-1.5">
            <Heart size={11} /> —
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle size={11} /> —
          </span>
        </div>
      </div>
    </article>
  );
}
