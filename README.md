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
puis à l'intérieur d'un bowl unique, monté une seule fois.

```
PORTAIL    un objet dans le noir, les ingrédients y tombent un par un
   ↓
DESCENTE   la caméra plonge ; chaque couche traversée est une section
           01 la base · 02 la protéine · 03 la sauce · 04 le croustillant
   ↓
ATELIER    on ressort en plan trois quarts ; le visiteur compose le bowl
           et l'objet à l'écran change réellement
   ↓
SORTIE     la caméra recule, le bowl redevient un décor
           casting · cinéma · carte de France · réseaux · teasing
```

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

**Le repli n'est pas un écran vide.** C'est la même composition — bowl centré,
halo chaud à gauche, halo froid à droite — construite avec l'illustration SVG
de la carte et deux dégradés. Un visiteur sans WebGL voit une page finie.

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

### La lumière

**La clé est quasi blanche.** C'est la règle qui a demandé le plus d'essais :
éclairer avec un orange saturé « pour rester dans la charte » repeint les
matériaux — le riz crème virait au rose et les morceaux dorés au rouge vif. En
photo culinaire, la couleur vient des accents et de l'environnement, jamais de
la source principale. Le contre-jour froid frôle la silhouette, il n'éclaire
pas.

---

## Direction artistique — « Braise nocturne »

Base presque noire, et **deux températures qui ne se mélangent jamais** :

- **chaud** `--brand` `--crisp` → la nourriture, l'appétit, les appels à l'action ;
- **froid** `--plasma` → le contour, le portail, les arêtes 3D.

C'est ce rim-light froid sur sujet chaud — un vrai code de photo culinaire
premium — qui donne à Bowly's une empreinte reconnaissable là où la plupart des
marques de street-food restent monochromes.

### Jetons

| Rôle | Valeur | Variable |
| --- | --- | --- |
| Le vide | `#08070a` | `--void` / `bg-void` |
| Surface relevée | `#0f0d12` | `--void-2` |
| Cartes | `#17141b` | `--void-3` |
| Texte principal | `#f4efe9` | `--bone` |
| Texte secondaire | `#a49a94` | `--bone-dim` |
| Texte discret | `#8e857f` | `--bone-faint` |
| Braise | `#f0452a` | `--brand` |
| Braise claire | `#ff6a3d` | `--brand-hot` |
| Or du croustillant | `#ffc23d` | `--crisp` |
| Plasma (froid) | `#8b6bff` | `--plasma` |
| Encre (sur aplat chaud) | `#120c0a` | `--ink` |

### ⚠️ Texte sur aplat chaud

`--bone` sur `--brand` ne fait que **3,29:1** — sous le seuil AA. Tout texte
posé sur un aplat `--brand` ou `--crisp` doit être en `--ink` (5,16:1 et
12,04:1). Les variantes de bouton l'appliquent déjà.

Pour les **pastilles du configurateur**, dont la couleur varie avec
l'ingrédient, une couleur figée ne peut pas marcher : `lisibleSur()` calcule la
luminance et choisit l'encre ou l'os. Ne pas la remplacer par une constante.

### `npm run verifier`

Un garde-fou exécutable, distinct de l'audit axe-core :

```
── Jetons de la charte ───────────────────────────
  ok   texte principal sur le vide        17.58  (seuil 4.5)
  ok   orange de marque sur le vide        5.35  (seuil 4.5)
  …
── Couleurs d'ingrédients ────────────────────────
  ok   gochujang (#b23a1c, os)             5.23  (seuil 4.5)
  …
```

Il attrape ce qu'un calcul ne peut pas rattraper : une couleur de luminance
**moyenne**, sur laquelle ni l'encre ni l'os ne tiennent le seuil. Il a
effectivement pris la sauce « Fumée » (`#c9421f`, 4,29:1 au mieux, corrigée en
`#b53a19`) et la paire `--bone-faint` sur `--void-3` (4,46:1), que l'audit du
site rendu n'avait pas vue parce que la combinaison n'était affichée nulle part
à ce moment-là.

### Typographie

Deux familles, contraste maximal. **Anton** pour les moments d'affiche (une
seule graisse, moins de 40 ko), **Inter** pour tout ce qui informe.

> ⚠️ Ne pas descendre l'interlignage d'Anton sous 0,92. Elle place ses accents
> très haut : le É de « EXPÉRIENCE » et le È de « TIÈDE » disparaissaient
> derrière la ligne précédente. Rédhibitoire pour un site en français.

---

## Les visuels

**Aucune image distante.** Le site fonctionne hors ligne, en export statique, et
rien ne casse parce qu'un CDN a changé d'avis.

Les bowls sont **dessinés**, pas photographiés : `scripts/generate-assets.mjs`
compose chaque plat couche par couche — base, protéine, sauce, toppings — selon
sa vraie recette. Ce n'est pas un pis-aller mais un style d'illustration propre
à la marque, reconnaissable sans le logo, et remplaçable plat par plat le jour
du shooting. Le générateur est déterministe : deux exécutions produisent des
fichiers identiques.

```
public/assets/
├── branding/   symbole, version mono, image Open Graph
├── products/   un fichier par bowl — le nom de fichier est le contrat
├── food/       gros plans de la section cinématique
├── videos/     vide ; la section retombe sur le visuel fixe
└── 3d/         vide ; la géométrie est générée par code
```

`lib/assets.ts` est le **seul** endroit du code qui connaît ces chemins. Voir
`public/assets/README.md` pour la marche à suivre.

Ces illustrations ne représentent aucun plat réel, et aucune photo n'est
empruntée à une autre enseigne.

---

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
