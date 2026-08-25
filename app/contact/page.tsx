import type { Metadata } from "next";
import { Briefcase, Mail, Newspaper, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { photos } from "@/lib/images";
import { contactInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question, une demande presse, un projet de franchise ? Écrivez à l'équipe Bowly's.",
};

const contactChannels = [
  {
    icon: Mail,
    label: "Questions générales",
    value: contactInfo.email,
  },
  {
    icon: Phone,
    label: "Par téléphone",
    value: contactInfo.phone,
  },
  {
    icon: Newspaper,
    label: "Presse & médias",
    value: contactInfo.pressEmail,
  },
  {
    icon: Briefcase,
    label: "Franchise & partenariats",
    value: contactInfo.franchiseEmail,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Parlons <span className="text-brand">bowls</span>.
          </>
        }
        description="Une question sur la carte, une demande presse, une envie de travailler avec nous : on lit tout."
        photo={photos.toppings}
      />

      <section aria-labelledby="contact-titre" className="bowly-container py-20 lg:py-28">
        <h2 id="contact-titre" className="sr-only">
          Nous écrire
        </h2>

        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal from="left">
            <p className="eyebrow mb-4">Nos canaux</p>
            <h3 className="text-display text-cream text-3xl sm:text-4xl">
              Choisissez le bon
              <br /> interlocuteur.
            </h3>
            <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
              Les coordonnées ci-dessous seront renseignées avant l&apos;ouverture.
            </p>

            <ul className="mt-10 flex flex-col gap-6">
              {contactChannels.map((channel) => (
                <li key={channel.label} className="flex items-start gap-4">
                  <span className="bg-brand/12 text-brand ring-brand/25 flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1">
                    <channel.icon size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="font-display text-cream block text-sm font-bold">
                      {channel.label}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {channel.value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal from="right">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
