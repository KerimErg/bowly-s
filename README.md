# Bowly's — Enter the bowl

Site de marque pour **Bowly's**, enseigne de bowls croustillants **qui n'existe
pas encore physiquement**. Next.js (App Router), TypeScript, Tailwind CSS v4,
Framer Motion, react-three-fiber.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Commande | Ce qu'elle fait |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Export statique dans `out/` |
| `npm run lint` | ESLint |
| `npm run verifier` | Garde-fou de contraste (voir plus bas) |
| `npm run assets` | Régénère les illustrations de bowls |

---

## 📷 Mettre vos photos et vos vidéos

**Un seul fichier : `lib/photos.ts`.** Collez une adresse entre les guillemets,
enregistrez, c'est à l'écran. Laissez vide, le site retombe sur l'illustration
dessinée. Rien d'autre à toucher.

```ts
"the-og": {
  src: "/assets/products/the-og.jpg",        // un fichier à vous
  // ou
  src: "https://images.unsplash.com/photo-…", // une adresse, pour aller vite
  alt: "…",
},
```

Pour les vidéos de la section cinéma, même fichier : `.mp4` muet, en boucle,
3 à 6 secondes, cadrage vertical. Sans vidéo, la section affiche l'image fixe —
pas de lecteur cassé, pas de trou.

La page **La marque** affiche un compteur de visuels réellement fournis, calculé
depuis ce fichier. Il se met à jour tout seul.

### ⚠️ Ne pas prendre les photos d'une autre enseigne

Ce sont leurs plats, leur shooting, leur budget. Les afficher comme ceux de
Bowly's — même « juste pour la maquette » — est une contrefaçon dès que le site
est en ligne, et il l'est. Unsplash et Pexels sont gratuits, libres pour un
usage commercial, et personne ne viendra les réclamer.

---

## ⚠️ À lire avant de toucher au contenu

Bowly's est une **marque en construction**. Aucun restaurant n'a ouvert, aucun
prix n'est arrêté, aucun compte social n'existe, aucune équipe n'est publique.

**Toute donnée réelle indisponible est affichée `[À COMPLÉTER]` et n'est jamais
inventée.** Ce n'est pas une négligence à corriger, c'est une règle de
fabrication : un numéro de téléphone fictif finit par sonner chez quelqu'un, un
« 4,9/5 sur 12 000 avis » est un faux témoignage, et une adresse inventée
déplace réellement des gens.

Trouver tout ce qui reste à remplir :

```bash
grep -rn "À COMPLÉTER" lib/ components/ app/
grep -rn "\[X €\]" lib/
```

Concrètement, sur ce site :

| Endroit | Ce qui est affiché | Pourquoi |
| --- | --- | --- |
| Prix, partout | `[X €]` | Aucune grille tarifaire |
| « L'effet Bowly's » | Zéro chiffre de fréquentation | La marque n'a pas de clients |
| Mur social | Auteurs `[À COMPLÉTER]`, compteurs `—` | Les comptes n'existent pas |
| Page restaurants | Aucune adresse, gabarit vide | Aucun bail signé |
| Page commander | Boutons **désactivés**, avec le motif | On ne peut pas commander |
| Réseaux sociaux | Éléments inertes, jamais des liens | Ne pas pointer vers le compte d'un tiers |

Les liens légaux (mentions, CGV, cookies, allergènes) sont inertes eux aussi :
les pages n'existent pas et un lien mort vaut mieux qu'une 404.

---

## Le concept

**Un seul objet 3D traverse toute la page d'accueil.** Le scroll ne fait pas
apparaître et disparaître des canvas : il déplace une caméra sur un rail autour
d'un bowl unique, monté une seule fois.

```
PORTAIL    un objet posé sur la table, avec son ombre ; les ingrédients
           y tombent un par un
   ↓
DESCENTE   la caméra plonge en plan de plus en plus serré, les couches
           s'écartent ; chaque couche traversée est une section
           01 la base · 02 la protéine · 03 la sauce · 04 le croustillant
   ↓
ATELIER    plan serré en plongée ; le visiteur compose le bowl sur un
           carnet de commande et l'objet à l'écran change réellement
   ↓
SORTIE     la caméra recule, le bowl redevient un décor
           casting · cinéma · carte de France · réseaux · teasing
```

> ⚠️ **La caméra ne rentre plus dans le bol.** Elle le faisait quand le fond
> était noir : spectaculaire. Sur fond crème, l'écran se remplissait d'un aplat
> beige uniforme qu'on prenait pour un bug d'affichage. La station finale de la
> descente est un plan très serré, mais la lèvre du bol reste dans le cadre —
> c'est elle qui donne l'échelle.

### La chorégraphie est mesurée, pas codée en dur

`lib/stage.ts` définit quatre **actes** en progression de scroll. Ces bornes ne
sont pas des constantes : `calerActes()` les recalcule depuis la position
réelle des sections `#portail`, `#descente` et `#composer`, au montage, après
le chargement des polices et à chaque redimensionnement.

> La première version utilisait des fractions calculées à la main. Elles se
> sont désynchronisées dès la première section ajoutée : la caméra était encore
> au fond du bowl pendant que la page affichait la carte des plats. Une
> constante ne peut pas connaître la hauteur d'un bloc de texte, qui dépend de
> la police chargée, de la largeur de l'écran et de la longueur des libellés.

**Conséquence pratique :** ajouter ou déplacer une section de `app/page.tsx` ne
casse rien, tant que les trois identifiants restent en place.

---

## La 3D

### Pourquoi WebGL2, et pas WebGPU

WebGPU n'est pas disponible sur une part significative du parc, et son rendu
n'était vérifiable nulle part pendant le développement. WebGL2 est supporté
quasi partout et donne exactement le même résultat ici. Un hero WebGPU
expérimental existait dans une version précédente ; il a été retiré — il ne
survivait à aucun des critères de choix technologique.

### Trois niveaux de rendu

Décidés **une seule fois** au montage (`lib/capacites.ts`), jamais réévalués :
en changer en cours de visite ferait clignoter la page.

| Niveau | Condition | Effet |
| --- | --- | --- |
| `complete` | WebGL2, ≥ 4 cœurs, ≥ 4 Go, grand écran | Scène entière, densité jusqu'à 1,75× |
| `legere` | WebGL2, machine modeste ou petit écran | Densité 1×, lampe d'appoint coupée |
| `aucune` | Pas de WebGL2, **ou mouvement réduit demandé** | Repli CSS |

**Le repli n'est pas un écran vide.** C'est la même composition — bowl centré
sur un fond kraft tramé — construite avec l'illustration SVG de la carte. Un
visiteur sans WebGL voit une page finie.

### Ce que ça coûte

Mesuré sur le build de production, tailles après gzip :

| | Scripts au premier chargement |
| --- | --- |
| Avec la scène 3D | ≈ 430 ko |
| En repli (mouvement réduit, pas de WebGL2) | ≈ 200 ko |

Le morceau Three.js (**236 ko gzip**) est importé dynamiquement : il ne part
jamais vers un navigateur qui tombe en repli. La boucle de rendu s'arrête aussi
dès que l'onglet passe en arrière-plan — c'est la première cause de batterie
vidée sur les sites à scène 3D.

### Deux pièges de géométrie, documentés dans le code

1. **Le dôme de nourriture doit rester dans le profil du bowl.** Son point le
   plus large est son équateur ; s'il dépasse le rayon intérieur de la
   céramique à cette hauteur, il traverse la paroi et une bande crème apparaît
   sous l'objet sans qu'on comprenne d'où elle vient.
2. **Ne jamais décaler le bowl en visant à côté.** Pour le caler dans la moitié
   droite pendant l'atelier, on utilise `setViewOffset()` — un décentrement
   d'objectif. Viser un point décalé placerait l'objet au bord du champ, là où
   la projection perspective l'étire, et le bowl paraîtrait penché.

### La lumière — trois règles apprises à la dure

1. **La clé est quasi blanche.** Éclairer avec un orange saturé « pour rester
   dans la charte » repeint les matériaux : le riz crème virait au rose, les
   morceaux dorés au rouge vif. En photo culinaire la couleur vient des accents
   et de l'environnement, jamais de la source principale.
2. **Pas d'ACES sur une scène claire.** `ACESFilmicToneMapping` est fait pour le
   cinéma : il compresse les hautes lumières, parfait dans le noir et désastreux
   sur fond crème — la panure y devenait beige. `NeutralToneMapping` conserve la
   saturation dans les clairs.
3. **Sur fond clair, c'est l'ombre qui pose l'objet, pas la lumière.** Les halos
   lumineux derrière le bowl — indispensables sur noir — ne se voient pas sur du
   crème, et s'ils se voyaient ils ressembleraient à un défaut d'objectif. Ils
   ont été remplacés par une ombre portée au sol. Sans elle, le bowl flotte et
   retrouve exactement l'aspect « rendu 3D » qu'on cherche à fuir.

Le contre-jour, lui, était violet — en écho au rim-light froid de la photo
culinaire. Il est désormais doré : le violet saturé sur objet chaud est **le**
marqueur du rendu généré, et c'était le premier point d'artificialité de toute
la scène.

---

## Direction artistique — « Cantine »

Base **claire et chaude** — crème, beurre, kraft. Le sombre n'est plus une
ambiance mais une ponctuation : le bloc de teasing et le pied de page, rien
d'autre.

> Trois versions ont précédé celle-ci. D'abord un site presque noir. Puis un
> fond brun brûlé qui s'éclaircissait pendant la descente. Dans les deux cas le
> même défaut : **un plat sur fond sombre est en vitrine, on l'admire ; sur un
> fond chaud il est sur une table, on a faim.** C'est aussi ce qui a réglé le
> « ça fait trop IA » : la combinaison orange saturé + violet froid + halos
> flous sur noir est la signature du rendu généré.

Trois familles, toutes comestibles :

| | Rôle |
| --- | --- |
| **Braise** `--rouge` | la friture, la sauce piquante, les appels à l'action |
| **Doré** `--jaune` | la panure, le miel, le croustillant |
| **Frais** `--vert` | les herbes, les pickles — c'est lui qui apporte la vivacité |

### Jetons

| Rôle | Valeur | Variable |
| --- | --- | --- |
| Papier principal | `#fff7ec` | `--creme` |
| Papier alterné | `#ffedd0` | `--beurre` |
| Kraft | `#f2e2c9` | `--carton` |
| Texte principal | `#17100d` | `--encre` |
| Texte secondaire | `#6b5346` | `--encre-douce` |
| Texte discret | `#775f4f` | `--encre-faible` |
| Braise (aplats) | `#ee4520` | `--rouge` |
| Braise (texte sur clair) | `#b82a0e` | `--rouge-fonce` |
| Doré | `#ffbf2e` | `--jaune` |
| Frais (aplats) | `#8fd11f` | `--vert` |
| Frais (texte sur clair) | `#456d08` | `--vert-fonce` |
| Zones sombres | `#1c120e` | `--braise` |

### ⚠️ Deux rouges, deux verts

`--rouge` sur crème ne fait que **3,59:1**, `--vert` **1,75:1**. Le texte
coloré sur fond clair utilise donc `--rouge-fonce` et `--vert-fonce`. Et sur un
aplat `--rouge` ou `--jaune`, le texte est en `--encre` : `--creme` n'y fait que
3,59:1.

Pour les **cases du configurateur**, dont la couleur varie avec l'ingrédient,
une couleur figée ne peut pas marcher : `lisibleSur()` calcule la luminance et
choisit. Ne pas la remplacer par une constante.

### Ce qui remplace les « rectangles »

`components/shared/decor.tsx` fournit le vocabulaire d'atelier qui a remplacé
les cartes à coins arrondis : **tampon** à l'encre posé de travers, **étiquette**
collée avec ombre dure, **trait au feutre**, **cadre photo** punaisé, **numéro
détouré**, **entourage** tracé à la main. Plus, en CSS : texture **papier**,
**trame** d'imprimerie, **bord déchiré**, **soulignement** à main levée.

> Règle d'usage : jamais deux fois la même rotation à la suite. Si deux
> étiquettes voisines penchent pareil, l'effet « posé à la main » s'effondre et
> on retombe dans la grille.

### `npm run verifier`

Un garde-fou exécutable, distinct de l'audit axe-core. Il teste chaque encre sur
**les trois papiers** — ce qui passe sur le crème peut échouer sur le carton,
plus foncé — et chaque couleur d'ingrédient.

Il a effectivement attrapé, à chaque refonte de palette, ce que l'audit du site
rendu ne voyait pas : la sauce « Fumée » (4,29:1 au mieux), `--bone-faint` sur
`--void-3` (4,46:1), et `--vert-fonce` sur carton (4,02:1).

### Typographie

Deux familles, contraste maximal. **Anton** pour les moments d'affiche (une
seule graisse, moins de 40 ko), **Inter** pour tout ce qui informe.

> ⚠️ Ne pas descendre l'interlignage d'Anton sous 0,92. Elle place ses accents
> très haut : le É de « EXPÉRIENCE » et le È de « TIÈDE » disparaissaient
> derrière la ligne précédente. Rédhibitoire pour un site en français.

---

## Les visuels

**Aucune image distante par défaut.** Le site fonctionne hors ligne, en export
statique, et rien ne casse parce qu'un CDN a changé d'avis.

Deux couches, une seule règle — **votre photo d'abord, l'illustration sinon** :

1. `lib/photos.ts` — vos photos et vos vidéos ;
2. `public/assets/` — les illustrations dessinées, qui prennent le relais.

`lib/assets.ts` applique la bascule. Aucun composant ne la connaît : ils
demandent un visuel, ils en reçoivent un, avec un drapeau `estPhoto` qui leur
dit s'il faut recadrer (`cover`) ou poser entier (`contain`).

Les bowls sont **dessinés**, pas photographiés : `scripts/generate-assets.mjs`
compose chaque plat couche par couche — base, protéine, sauce, toppings — selon
sa vraie recette. Générateur déterministe : deux exécutions produisent des
fichiers identiques.

```
public/assets/
├── branding/   symbole, version mono, image Open Graph
├── products/   un fichier par bowl — le nom de fichier est le contrat
├── food/       macros de la section cinématique
├── videos/     vide ; la section retombe sur l'image fixe
└── 3d/         vide ; la géométrie est générée par code
```

## Architecture

```
app/
├── page.tsx            accueil — le parcours complet
├── menu/               la carte, en bandes pleine largeur
├── composer/           le configurateur seul (même composant que l'accueil)
├── commander/          modes de commande — tous désactivés, motifs affichés
├── restaurants/        gabarit de fiche, cinq emplacements à l'étude
├── about/              partis pris de la marque + ce qui n'existe pas encore
└── contact/            formulaire (interface seule) + coordonnées

components/
├── three/              bowl-scene (décision + repli) · bowl-canvas · bowl-rig
├── home/               portail · descente · atelier · casting · cinema ·
│                       effet · partout · next-bowl
├── menu/carte.tsx      la carte complète
├── layout/             en-tête · pied de page · curseur · barre de commande
├── shared/             reveal (apparitions, lignes révélées, ruban) · page-hero
└── ui/                 primitives shadcn/ui

lib/
├── stage.ts            pilote de la scène : actes, progression, recette
├── capacites.ts        détection WebGL et media queries
├── recette.ts          ingrédients du configurateur + lisibilité
├── assets.ts           registre des visuels
├── menu-data.ts        la carte
└── site.ts             marque, coordonnées, navigation
```

### Le pilote de scène (`lib/stage.ts`)

Le scroll et le pointeur écrivent dans un **objet mutable**, lu directement par
la boucle de rendu WebGL. Aucun rendu React pendant le défilement. Les rares
composants qui doivent se redessiner (le configurateur) s'abonnent
explicitement via `useRecette()`, qui ne notifie qu'au changement réel.

Le configurateur est la seule chose qui traverse la frontière dans les deux
sens, et elle ne circule que dans un sens : l'interface écrit la recette, la
scène la lit. Pas de boucle de synchronisation possible.

---

## Accessibilité

- **Mouvement réduit** : la scène 3D est remplacée par le repli statique. C'est
  volontairement radical — les grands mouvements de caméra sont exactement ce
  que ce réglage sert à éviter. Les transitions déclenchées par l'utilisateur
  (survol, focus) sont conservées mais raccourcies.
- **Curseur personnalisé** : pointeur fin uniquement, et le curseur système
  n'est **jamais** masqué. L'anneau vient en plus, pas à la place.
- **Configurateur** : de vrais `fieldset`, `radio` et `checkbox`. Les flèches
  parcourent un groupe, la tabulation passe au suivant — comportement natif.
  Le récapitulatif est en `aria-live`.
- **Défilement horizontal du casting** : `overflow-x` natif avec accroche, pas
  de scroll détourné. La zone est focusable au clavier.
- **Carte de France** : `role="group"` et non `role="img"` — un rôle `img` ne
  peut pas contenir de descendants interactifs.

Audit `axe-core` (WCAG 2.1 A + AA) sur les sept pages, en 1280 px et 390 px :
**aucune violation**.

---

## Déploiement

Export statique (`output: "export"`), déployé sur GitHub Pages par
`.github/workflows/deploy-github-pages.yml`. Le workflow enchaîne construction,
publication, puis **une vérification de la page réellement servie** : il télécharge
l'URL publiée et vérifie qu'elle contient bien les fichiers `_next/static`.

> Ce troisième job existe pour une raison. Le workflow `pages-build-deployment`
> de GitHub (Jekyll) peut entrer en concurrence avec le déploiement Actions et
> publier le `README.md` à la place du site, tout en laissant les deux
> workflows au vert. Un statut vert ne prouve pas qu'un site est en ligne.

`basePath` et `assetPrefix` sont pilotés par `NEXT_PUBLIC_BASE_PATH`, alimenté
par `actions/configure-pages`. Rien n'est codé en dur : un déploiement à la
racine d'un domaine fonctionne sans toucher à `next.config.ts`.

---

## Ce qui reste à faire

1. **Contenu réel** — remplacer tous les `[À COMPLÉTER]` de `lib/site.ts` et
   les `[X €]` de `lib/menu-data.ts` et `lib/recette.ts`.
2. **Photos et vidéos** — déposer dans `public/assets/`, aux mêmes chemins.
3. **Formulaire de contact** — il n'envoie rien (export statique : ni Route
   Handler ni Server Action). Les cinq étapes sont listées en tête de
   `components/contact/contact-form.tsx`.
4. **Plateforme de commande** — brancher `LIEN_COMMANDE` dans `lib/site.ts` et
   réactiver les boutons de `app/commander/page.tsx`.
5. **Pages légales** — mentions, confidentialité, CGV, cookies, allergènes.
