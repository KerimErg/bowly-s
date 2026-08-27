# Assets Bowly's

Tout ce que le site affiche vit ici. **Aucune image n'est chargée depuis un
domaine tiers** : le site fonctionne hors ligne, en export statique, et rien ne
peut casser parce qu'un CDN a changé d'avis.

## Arborescence

```
public/assets/
├── branding/   marque : symbole, version mono, image Open Graph
├── products/   un fichier par bowl de la carte
├── food/       gros plans de la section cinématique
├── videos/     vidéos de la section cinématique (vides pour l'instant)
└── 3d/         textures de la scène WebGL (vides pour l'instant)
```

## Comment remplacer un visuel

**Le nom de fichier est le contrat.** Déposez votre fichier au même chemin, le
site le prend sans qu'on touche au code.

| Vous avez… | Déposez-le en… |
| --- | --- |
| La photo de « The OG » | `products/the-og.svg` → ou `.jpg`/`.webp`, puis corrigez l'extension dans `lib/assets.ts` |
| Une vidéo de plan serré | `videos/croustillant.mp4` + `videos/croustillant.webm` |
| Le vrai logo | `branding/mark.svg` |

Le registre typé `lib/assets.ts` est le **seul** endroit du code qui connaît ces
chemins. Un visuel manquant y est signalé, jamais deviné.

## Les visuels actuels sont des placeholders

Les bowls sont **dessinés**, pas photographiés — générés par
`scripts/generate-assets.mjs`. Ce n'est pas un pis-aller : chaque bowl est
composé couche par couche (base, protéine, sauce, toppings) selon sa vraie
recette, ce qui donne à la carte un style reconnaissable en attendant le
shooting. Ils ne représentent aucun plat réel existant.

Pour les régénérer ou en ajouter un :

```bash
node scripts/generate-assets.mjs
```

Les recettes visuelles sont en haut du script, dans l'objet `RECETTES`.
Le générateur est déterministe : deux exécutions donnent des fichiers
identiques au bit près, donc pas de diff parasite dans Git.

## Vidéos — ce qui est prévu

`videos/` est vide. La section cinématique détecte l'absence de fichier et
retombe sur le gros plan `food/*.svg` correspondant, sans espace blanc ni
lecteur cassé. Quand les rushes existeront :

- format : `.mp4` (H.264) **et** `.webm` (VP9), même nom de base ;
- cadrage vertical 9:16 pour rester exploitable sur mobile et en story ;
- durée 3 à 6 s, en boucle propre, **sans son** (le site n'autolance jamais de son) ;
- poids visé : moins de 2 Mo par plan.

## 3D

`3d/` est vide et le restera tant que la scène n'a pas besoin de textures
externes : le bowl du hero est généré par code (géométrie + matériau), donc
rien à charger. Si un modèle `.glb` le remplace un jour, c'est ici qu'il va, et
`components/three/` est le seul dossier à ouvrir.
