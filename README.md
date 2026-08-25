# Bowly's — site vitrine

Site web de **Bowly's**, marque de fast-food premium spécialisée dans les bowls
composés. Next.js (App Router) + TypeScript + Tailwind CSS + structure shadcn/ui.

> ⚠️ **Bowly's n'existe pas encore physiquement.** Aucune donnée réelle
> (adresse, prix, horaires, téléphone, avis clients, réseaux sociaux) n'a été
> inventée : tout est marqué `[À COMPLÉTER]`. Voir
> [Placeholders à remplacer](#placeholders-à-remplacer-avant-mise-en-ligne).

---

## Lancer le projet

```bash
npm install
npm run dev          # http://localhost:3000
```

Autres commandes :

```bash
npm run build        # build de production
npm run start        # sert le build de production
npm run lint         # ESLint
npx tsc --noEmit     # vérification des types
```

Prérequis : **Node.js 20.9+** (contrainte Next.js 16).

---

## Stack

| Brique | Choix |
| --- | --- |
| Framework | Next.js 16 — App Router, Turbopack, composants serveur par défaut |
| Langage | TypeScript (strict) |
| Styles | Tailwind CSS v4 — tokens déclarés en `@theme` dans `app/globals.css` |
| Composants | Convention shadcn/ui — primitives copiées dans `components/ui/` |
| Icônes | `lucide-react` (+ SVG inline pour les logos de réseaux sociaux) |
| Animations | `framer-motion` — apparitions au scroll et parallaxe du hero |
| Polices | `next/font/google` — Poppins (titres, logo) et Inter (texte courant) |

### À propos de shadcn/ui

Le projet suit la convention shadcn/ui : `components.json` à la racine, alias
`@/components/ui`, helper `cn()` dans `lib/utils.ts`, variantes en
`class-variance-authority`. Les primitives (`button`, `card`, `input`,
`textarea`, `label`, `badge`) ont été écrites directement dans
`components/ui/` — c'est exactement ce que fait la CLI, qui copie le code source
dans le projet plutôt que d'ajouter une dépendance.

Pour ajouter un composant par la suite :

```bash
npx shadcn@latest add dialog
```

---

## Structure

```
app/
├── layout.tsx              en-tête, pied de page, polices, métadonnées SEO
├── globals.css             tokens de marque (couleurs, typo, utilitaires)
├── icon.svg                favicon — même monogramme « B » que le logo
├── page.tsx                accueil
├── menu/page.tsx           la carte + filtres par catégorie
├── histoire/page.tsx       récit de marque (texte placeholder)
├── restaurants/page.tsx    adresse, horaires, zone d'intégration Maps
└── contact/page.tsx        formulaire (UI seule)

components/
├── ui/                     primitives shadcn/ui + le carousel 3D
│   ├── 3-d-coverflow-carousel.tsx        ← pièce maîtresse de l'accueil
│   └── 3-d-coverflow-carousel.demo.tsx   ← référence d'usage (non monté)
├── brand/logo.tsx          logo « B » vectoriel, réutilisable
├── layout/                 en-tête, pied de page, icônes sociales
├── home/                   les 7 sections de la page d'accueil
├── menu/menu-explorer.tsx  filtres client-side de la carte
├── contact/contact-form.tsx
└── shared/                 Reveal (scroll), SmartImage, PageHero, SectionHeading

lib/
├── site.ts                 ⭐ coordonnées, navigation, liens légaux
├── menu-data.ts            ⭐ la carte et les prix
├── images.ts               ⭐ toutes les photos Unsplash
└── utils.ts                helper cn()
```

Les trois fichiers marqués ⭐ concentrent **la totalité** du contenu à remplacer.

---

## Identité visuelle

| Rôle | Valeur | Variable |
| --- | --- | --- |
| Fond premium | `#0c0a09` | `--ink` / `bg-ink` |
| Surfaces | `#16120f`, `#1f1a16` | `--ink-800`, `--ink-700` |
| Orange de marque | `#ff5a1f` | `--brand` / `text-brand` |
| Texte principal | `#fff6ef` | `--cream` / `text-cream` |
| Texte secondaire | `#a29489` | `text-muted-foreground` |

**Contraste :** les boutons orange utilisent un texte **encre sombre** et non
blanc — le blanc sur `#ff5a1f` ne plafonne qu'à 3,1:1, sous le seuil WCAG AA de
4,5:1, alors que l'encre atteint 6,4:1. Le carousel calcule cette couleur
automatiquement (`readableOn()`), pour rester correct si l'on change l'accent.

**Logo** — `components/brand/logo.tsx`. Le « B » est dessiné en tracés SVG (pas
en texte) : rendu identique quel que soit le chargement de la police, net à
toutes les tailles, et réutilisable tel quel pour le favicon. Trois variantes :
`<Logo />` (monogramme + mot-clé), `<Logo variant="mark" />`, `<LogoGlyph />`.

---

## Le carousel 3D coverflow

`components/ui/3-d-coverflow-carousel.tsx` — utilisé dans la section
« Nos best-sellers » de l'accueil.

- **Aucune dépendance d'icônes** : les chevrons et la flèche sont des SVG inline.
- **Palette pilotée par props** : `accentColor` (orange de marque, en
  remplacement du doré d'origine) et `backgroundColor` (fond sombre premium).
- **Contenu** : `defaultDishes` contient les 5 bowls signature Bowly's, dans la
  structure de données d'origine (`tag`, `titleLine1`, `titleLine2`, `desc`,
  `img`, `ctaText`, `ctaUrl`, plus un `alt` optionnel pour l'accessibilité).
  Chaque CTA pointe vers `/menu`.
- **Interactions** : flèches ← →, touches Début/Fin, glisser-déposer / swipe,
  pastilles, clic sur une carte de profil pour l'amener au centre.
- **Défilement automatique** suspendu au survol, au focus, pendant un glissement,
  quand l'onglet est masqué, et si `prefers-reduced-motion` est activé.

```tsx
import { Coverflow3DCarousel } from "@/components/ui/3-d-coverflow-carousel";

<Coverflow3DCarousel
  accentColor="#ff5a1f"
  backgroundColor="transparent"
  ariaLabel="Les bowls best-sellers de Bowly's"
/>
```

`3-d-coverflow-carousel.demo.tsx` conserve un exemple d'usage complet (props
personnalisées), il n'est monté par aucune route.

---

## Placeholders à remplacer avant mise en ligne

Pour tout retrouver d'un coup :

```bash
grep -rn "À COMPLÉTER" app components lib     # données manquantes
grep -rn "TODO(" app components lib           # branchements techniques
```

### 1. Coordonnées et liens — `lib/site.ts`

Adresse, code postal, ville, téléphone, e-mails (général, presse, franchise),
comptes de réseaux sociaux (les `href` sont à `#`), horaires des sept jours,
et les cinq pages légales (mentions, confidentialité, CGV, cookies, allergènes)
qui restent à créer.

Pensez aussi à `siteConfig.url` : `https://www.bowlys.example` sert de base aux
métadonnées Open Graph et doit être remplacé par le vrai domaine.

### 2. La carte et les prix — `lib/menu-data.ts`

Tous les prix valent `[X €]`. Les descriptions sont des propositions à valider.
`getMenu()` est le point d'entrée unique : branchez-y un CMS ou une API sans
toucher à l'interface.

### 3. Textes de marque — `app/histoire/page.tsx`

Manifeste, frise chronologique (4 chapitres) et 3 convictions : chaque bloc est
balisé `[À COMPLÉTER] — texte de marque à valider`. **Aucune date, aucun nom de
dirigeant, aucun chiffre n'a été inventé.**

### 4. Avis clients — `components/home/testimonials.tsx`

Trois témoignages d'exemple, prénoms fictifs génériques (Camille, Yanis, Léa),
chacun explicitement libellé « Avis d'exemple ». La section elle-même précise
que Bowly's n'a pas encore ouvert. À remplacer par de vrais avis (avec accord
écrit des clients) ou par un widget d'avis vérifiés.

### 5. Carte Google Maps — `app/restaurants/page.tsx`

Un bloc réservé attend l'`<iframe>` Maps ; le code exact est en commentaire
`TODO(intégration)`. Pensez au consentement cookies avant de charger un service
tiers.

### 6. Formulaires — aucun backend

| Fichier | Ce qu'il manque |
| --- | --- |
| `components/contact/contact-form.tsx` | Route Handler `app/api/contact/route.ts` ou Server Action, envoi réel (Resend / SendGrid / SMTP), anti-spam, mention RGPD |
| `components/home/newsletter-cta.tsx` | Service d'e-mailing, double opt-in, stockage du consentement |

Les deux affichent une confirmation locale et indiquent clairement à
l'utilisateur qu'il s'agit d'une démonstration.

### 7. Bouton « Commander »

Il pointe aujourd'hui vers `/menu` et `/restaurants`. À rediriger vers la vraie
plateforme de commande en ligne (voir `TODO(commande)`).

---

## Photos

Toutes les images distantes passent par `lib/images.ts`, qui associe à chaque
photo son identifiant Unsplash **et** son texte alternatif en français — il
devient donc impossible d'oublier un `alt`. L'hôte `images.unsplash.com` est le
seul autorisé dans `next.config.ts` ; ajoutez-y votre CDN le jour où la marque
disposera de sa propre production photo.

> ⚠️ **À vérifier au premier lancement.** Les identifiants Unsplash n'ont pas pu
> être testés depuis l'environnement de développement, dont la politique réseau
> bloque `images.unsplash.com`. Ouvrez le site une fois en local : si une photo
> manque, remplacez son `id` dans `lib/images.ts` (et dans `defaultDishes` pour
> le carousel) par celui d'une autre photo Unsplash. Le composant
> `<SmartImage />` affiche un dégradé de marque en secours, donc une photo
> indisponible ne casse jamais la mise en page.

---

## Performance, SEO, accessibilité

- **Images** : `next/image` partout, lazy loading natif, `priority` réservé aux
  photos de hero (LCP), formats AVIF/WebP, `sizes` renseigné sur chaque image en
  `fill`.
- **Rendu** : les 5 pages sont pré-rendues statiquement ; seuls les îlots
  réellement interactifs sont des composants client.
- **SEO** : `metadataBase`, titres par page via `template`, descriptions,
  Open Graph et Twitter Card, `lang="fr"`, hiérarchie `h1 → h2 → h3` respectée.
- **Accessibilité** : lien d'évitement, focus visible sur toute la page,
  `aria-label` sur les boutons d'action, `aria-live` sur le carousel et les
  filtres, navigation clavier complète, `prefers-reduced-motion` respecté à la
  fois en CSS et dans framer-motion.
  Audit axe-core (WCAG 2.1 AA + best practices) : **0 violation** sur les
  5 pages.
- **Responsive** : mobile-first, vérifié de 360 px à 1920 px, aucun débordement
  horizontal.
