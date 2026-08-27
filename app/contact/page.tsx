import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { SocialIcon } from "@/components/layout/social-icon";
import { TODO, contactInfo, socialLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrire à Bowly's : proposer une ville, poser une question, parler franchise ou presse.",
};

/**
 * CONTACT.
 *
 * ⚠️ Le formulaire n'est relié à aucun serveur (le site est en export
 * statique : ni Route Handler ni Server Action). Il le dit lui-même à
 * l'envoi — voir `components/contact/contact-form.tsx`, qui liste les cinq
 * étapes à faire avant mise en production.
 *
 * Toutes les coordonnées viennent de `lib/site.ts` et restent
 * `[À COMPLÉTER]` : aucune adresse ni aucun numéro n'est inventé.
 */

const RAISONS = [
  { titre: "Proposer une ville", ligne: "C'est la demande la plus utile aujourd'hui." },
  { titre: "Être prévenu", ligne: "De l'ouverture du premier restaurant." },
  { titre: "Franchise", ligne: `Dossier non ouvert — ${TODO}` },
  { titre: "Presse", ligne: `Kit de presse non disponible — ${TODO}` },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        lignes={[
          <span key="1">Dis-nous</span>,
          <span key="2" className="text-rouge-fonce">
            où on ouvre.
          </span>,
        ]}
        chapo="La marque se construit. Les demandes reçues maintenant pèsent réellement sur les premiers emplacements."
      />

      <div className="bowly-wide grid gap-14 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* --- Le formulaire --- */}
        <Reveal>
          <ContactForm />
        </Reveal>

        {/* --- Les coordonnées --- */}
        <div className="flex flex-col gap-10">
          <Reveal delay={0.08}>
            <h2 className="poster-section text-encre">Pourquoi écrire</h2>
            <ul className="mt-6 flex flex-col">
              {RAISONS.map((raison) => (
                <li key={raison.titre} className="border-trait border-t py-4">
                  <p className="text-encre text-sm font-bold">{raison.titre}</p>
                  <p className="text-encre-douce mt-1 text-sm">{raison.ligne}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.14}>
            <h2 className="poster-section text-encre">Coordonnées</h2>
            <ul className="mt-6 flex flex-col gap-5">
              {[
                { icone: MapPin, label: "Adresse", valeur: `${contactInfo.address}, ${contactInfo.postalCode} ${contactInfo.city}` },
                { icone: Phone, label: "Téléphone", valeur: contactInfo.phone },
                { icone: Mail, label: "E-mail", valeur: contactInfo.email },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <span className="border-trait text-rouge-fonce mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border">
                    <item.icone size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="kicker text-encre-faible">{item.label}</p>
                    <p className="text-encre-douce mt-1.5 text-sm break-words">{item.valeur}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-encre-faible mt-6 text-xs leading-relaxed">
              Ces coordonnées n&apos;existent pas encore. Elles sont affichées
              en <span className="text-encre-douce">[À COMPLÉTER]</span> plutôt
              qu&apos;inventées : un numéro fictif finirait par sonner chez
              quelqu&apos;un.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="poster-section text-encre">Réseaux</h2>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  {/* Compte inexistant : élément inerte, jamais un lien vers
                      le profil de quelqu'un d'autre. */}
                  <span className="border-trait text-encre-douce inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm">
                    <SocialIcon name={social.icon} />
                    {social.label}
                    <span className="text-encre-faible text-xs">{social.handle}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </>
  );
}
