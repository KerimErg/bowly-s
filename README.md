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
npm run build        # export statique -> dossier out/
npm run lint         # ESLint
npx tsc --noEmit     # vérification des types
```

> `npm run start` n'est pas utilisable : le projet est configuré en export
> statique (`output: "export"`), il n'y a donc pas de serveur Next.js à lancer.
> Pour prévisualiser le build : `npx serve out`.

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

Base claire crème, orange de marque en accent fort. Le sombre est réservé aux
zones où il est justifié : voile sur les photos et pied de page.

| Rôle | Valeur | Variable |
| --- | --- | --- |
| Fond de page | `#fff8f3` | `--cream` / `bg-cream` |
| Surface alternée | `#f7ede4` | `--sand` / `bg-sand` |
| Cartes | `#ffffff` | `bg-white` |
| Bordures | `#e6d5c6` | `--line` / `border-line` |
| Texte principal | `#1c1310` | `--ink` / `text-ink` |
| Texte secondaire | `#6e5a4e` | `--ink-soft` / `text-ink-soft` |
| Orange — aplats | `#ff5a1f` | `--brand` / `bg-brand` |
| Orange — texte sur clair | `#bf360c` | `--brand-ink` / `text-brand-ink` |
| Zones sombres | `#140f0d` | `--night` / `bg-night` |
| Texte sur sombre | `#b5a49a` | `--ink-dim` / `text-ink-dim` |

### ⚠️ Deux oranges, non interchangeables

C'est le seul piège de la palette :

- **`--brand` (`#ff5a1f`) sert aux aplats** — boutons, badges, pastilles. En
  *texte* sur crème il ne fait que **2,97:1**, sous le seuil WCAG AA de 4,5:1.
- **`--brand-ink` (`#bf360c`) sert au texte orange sur fond clair** (5,33:1 sur
  crème, 4,85:1 sur sable).
- Sur fond sombre, `--brand` redevient utilisable en texte (6,10:1) : c'est le
  cas dans le hero, les cartes du carousel et le pied de page. L'utilitaire
  `.eyebrow` prend l'orange profond, `.eyebrow-invert` l'orange vif.

Les boutons orange portent un **texte encre** et non blanc : le blanc sur
`#ff5a1f` plafonne à 3,1:1, l'encre atteint 5,9:1 — et le rendu est plus franc.

Le carousel, lui, calcule cette couleur depuis sa prop `accentColor`
(`readableOn()`), il reste donc correct si l'on change l'accent.

**Logo** — `components/brand/logo.tsx`. Le « B » est dessiné en tracés SVG (pas
en texte) : rendu identique quel que soit le chargement de la police, net à
toutes les tailles, et réutilisable tel quel pour le favicon. Variantes :
`<Logo />` (monogramme + mot-clé), `<Logo variant="mark" />`, `<LogoGlyph />`.
La prop `tone` (`dark` par défaut, `light` sur une photo) pilote la couleur du
mot-clé ; la pastille orange, elle, ne change jamais.

## Les composants 3D

Deux mécaniques distinctes, une seule perspective (`--perspective`, 1600 px) et
une seule courbe (`--ease-float`), pour que tout semble filmé par le même
objectif.

| Composant | Rôle | Où |
| --- | --- | --- |
| `components/ui/3d-card.tsx` | Carte à profondeur : chaque élément se détache à sa propre hauteur au survol | Cartes de la carte (`/menu`) |
| `components/shared/tilt-card.tsx` | Inclinaison simple de toute la carte | Hero, piliers « Pourquoi » |
| `components/ui/3-d-coverflow-carousel.tsx` | Carousel coverflow | Best-sellers de l'accueil |

### `3d-card.tsx` — d'après Aceternity UI

Composant copier-coller (licence permissive), API conservée telle quelle :
`CardContainer`, `CardBody`, `CardItem`, `useMouseEnter`. Quatre adaptations :

1. perspective prise sur le jeton partagé (1600 px au lieu de 1000 px) ;
2. `prefers-reduced-motion` neutralise rotation et profondeur ;
3. props typées sans `any` ;
4. `py-8` et `h-96 w-96` figés retirés, pour que la carte remplisse sa cellule.

> ⚠️ Ne posez jamais `overflow-hidden` sur `CardBody` : la propriété force
> `transform-style: flat` et aplatirait toute la profondeur. Arrondissez
> l'image dans son propre conteneur, qui est une feuille de l'arbre.

Profondeurs utilisées sur les cartes de la carte : photo `translateZ 100`,
prix `60`, nom `50`, description `30`, étiquettes `40`.

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

Pensez aussi à l'URL du site : `siteConfig.url` lit `NEXT_PUBLIC_SITE_URL` et
retombe sur `https://www.bowlys.example`. Elle sert de base aux métadonnées
Open Graph — renseignez le vrai domaine (le workflow GitHub Pages le fait
automatiquement, voir [Déploiement](#déploiement)).

### 2. La carte et les prix — `lib/menu-data.ts`

Tous les prix valent `[X €]`. Les descriptions sont des propositions à valider.
`getMenu()` est le point d'entrée unique : branchez-y un CMS ou une API sans
toucher à l'interface.

### 3. Textes de marque — `app/histoire/page.tsx`

Manifeste, frise chronologique (4 chapitres) et 3 convictions : chaque bloc est
balisé `[À COMPLÉTER] — texte de marque à valider`. **Aucune date, aucun nom de
dirigeant, aucun chiffre n'a été inventé.**

### 3 bis. Ton éditorial

La section « Pourquoi Bowly's » (`components/home/why-bowlys.tsx`) est écrite
dans un registre street-food : tutoiement, phrases courtes, envie plutôt
qu'argumentaire. Le reste du site est encore dans un registre plus posé — à
harmoniser si ce ton est validé.

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
| `components/contact/contact-form.tsx` | Endpoint d'envoi externe (Formspree, Resend via une fonction serverless, SMTP…), anti-spam, mention RGPD |
| `components/home/newsletter-cta.tsx` | Service d'e-mailing, double opt-in, stockage du consentement |

Les deux affichent une confirmation locale et indiquent clairement à
l'utilisateur qu'il s'agit d'une démonstration.

> ⚠️ **L'export statique interdit les Route Handlers et les Server Actions** :
> il n'y a pas de serveur Next.js à l'exécution. Ces formulaires devront donc
> appeler une **API externe** depuis le navigateur (service de formulaires,
> fonction serverless, backend dédié) — et non une route `app/api/...`. Si vous
> préférez une route interne, il faut abandonner `output: "export"` et déployer
> sur un hébergeur avec serveur (Vercel, Netlify Functions, Node…).

### 7. Bouton « Commander »

Il pointe aujourd'hui vers `/menu` et `/restaurants`. À rediriger vers la vraie
plateforme de commande en ligne (voir `TODO(commande)`).

---

## Déploiement

Le projet est configuré en **export statique** : `npm run build` produit un
dossier `out/` (HTML/CSS/JS uniquement), hébergeable sur n'importe quel serveur
de fichiers.

### GitHub Pages (automatique)

Le workflow `.github/workflows/deploy-github-pages.yml` construit et publie le
site à chaque `push` sur `main`, ainsi qu'à la demande (« Run workflow »).

**À faire une seule fois** : `Settings` → `Pages` → *Build and deployment* →
*Source* : **GitHub Actions**. Le site est ensuite servi sur
`https://<utilisateur>.github.io/<dépôt>/`.

Le workflow enchaîne : `npm ci` → `tsc --noEmit` → `npm run lint` →
`npm run build` → `upload-pages-artifact` → `deploy-pages`. L'URL publiée
apparaît dans le résumé du job `Déploiement`.

> Le déclencheur manuel n'apparaît dans l'onglet *Actions* qu'une fois le
> fichier de workflow présent sur la branche par défaut. Tant que la PR n'est
> pas fusionnée, le workflow ne peut donc pas être lancé.

### `basePath` et URL du site

GitHub Pages sert un dépôt « projet » depuis un sous-répertoire
(`/bowly-s`), pas depuis la racine. Plutôt que de coder ce préfixe en dur — ce
qui casserait `npm run dev` et un futur déploiement sur domaine propre — il est
piloté par deux variables d'environnement, renseignées automatiquement par le
workflow depuis les sorties de `actions/configure-pages` :

| Variable | Rôle | Valeur en local |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Préfixe d'URL (`basePath` + `assetPrefix`) | vide → site à la racine |
| `NEXT_PUBLIC_SITE_URL` | Base des métadonnées Open Graph (`metadataBase`) | `https://www.bowlys.example` |

Pour reproduire un build « Pages » en local :

```bash
NEXT_PUBLIC_BASE_PATH=/bowly-s \
NEXT_PUBLIC_SITE_URL=https://<utilisateur>.github.io/bowly-s \
npm run build
```

### Autres hébergeurs

Vercel, Netlify, Cloudflare Pages ou un simple serveur de fichiers servent
`out/` tel quel, **sans variable d'environnement** : le site se déploie alors à
la racine du domaine. Pensez à renseigner `NEXT_PUBLIC_SITE_URL` avec le vrai
domaine pour que les métadonnées Open Graph soient correctes.

### Conséquences de l'export statique

- **`trailingSlash: true`** est activé : sans slash final, GitHub Pages
  renverrait une 404 sur `/menu`. Next.js émet donc `out/menu/index.html`.
- **`images.unoptimized: true`** : l'API d'optimisation d'images de Next.js
  exige un serveur Node.js. `next/image` retombe sur une balise `<img>`, en
  conservant le lazy loading natif, les `sizes` et les dimensions — donc aucun
  décalage de mise en page. Pour retrouver une optimisation réelle, branchez un
  loader personnalisé (Cloudinary, imgix…), voir les commentaires de
  `next.config.ts`.
- **Un `.nojekyll`** est déposé dans `out/` par le workflow : sans lui, un
  hébergement passant par Jekyll ignorerait le dossier `_next/` (préfixé par un
  underscore) et le site s'afficherait sans CSS ni JavaScript.
- Les fonctionnalités nécessitant un serveur (Route Handlers, Server Actions,
  ISR, `cookies()`, redirections/en-têtes via `next.config`) ne sont pas
  disponibles. Le site n'en utilise aucune — c'est aussi pourquoi les
  formulaires devront viser une API externe plutôt qu'une route interne.

## Photos

Direction photo : **street-food en barquette** — plats servis en barquette ou
en boîte à emporter, poulet croustillant, frites chargées, cadrage serré et
lumière chaude. Pas d'assiette de restaurant.

Toutes les images distantes passent par `lib/images.ts`, qui associe à chaque
photo son identifiant Unsplash, son texte alternatif en français **et le lien
de recherche Unsplash correspondant** — il devient donc impossible d'oublier
un `alt`, et remplacer une photo prend quelques secondes. L'hôte
`images.unsplash.com` est le seul autorisé dans `next.config.ts`.

> ⚠️ **À vérifier au premier lancement.** Les identifiants Unsplash n'ont pas
> pu être testés depuis l'environnement de développement, dont la politique
> réseau bloque `images.unsplash.com`. Ouvrez le site une fois en local : si
> une photo manque, suivez le lien `recherche` de son entrée dans
> `lib/images.ts`, choisissez-en une autre et collez son segment `photo-...`
> dans `id`. Le composant `<SmartImage />` affiche un dégradé de marque en
> secours, donc une photo indisponible ne casse jamais la mise en page.
>
> Les cinq bowls du carousel ont leurs URLs en dur dans `defaultDishes`
> (`components/ui/3-d-coverflow-carousel.tsx`) — même manipulation.

**N'utilisez pas les photos d'une enseigne existante** (Crousty One, Tasty
Crousty ou autre) : elles sont protégées par le droit d'auteur, et présenter
leurs plats comme ceux de Bowly's serait trompeur. Unsplash, une banque
d'images sous licence, ou la production photo de la marque.

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
