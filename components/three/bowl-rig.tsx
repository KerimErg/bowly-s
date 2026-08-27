"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import {
  ACTES,
  adoucir,
  avancement,
  clamp01,
  couleurFond,
  dansActe,
  lerp,
  scene as pilote,
  useRecette,
} from "@/lib/stage";
import { couleurDe } from "@/lib/recette";

/* ========================================================================== */
/*  CONSTANTES DE MISE EN SCÈNE                                               */
/* ========================================================================== */

/**
 * Géométrie du dôme de nourriture.
 *
 * ⚠️ CES TROIS VALEURS DOIVENT RESTER À L'INTÉRIEUR DU PROFIL DU BOWL.
 * Première version : R = 1,16 et Y_DOME = 0,42 — soit un équateur de rayon
 * 1,16 à une hauteur où la paroi intérieure du bowl n'en fait que 1,02. Le
 * dôme traversait la céramique et débordait sous l'objet : une large bande
 * crème apparaissait sous le bowl, sans qu'on comprenne d'où elle venait.
 *
 * Le point le plus large du dôme est son équateur, à la hauteur Y_DOME, et il
 * y vaut exactement R. Il faut donc que R soit inférieur au rayon intérieur
 * du bowl à cette hauteur (≈ 1,08 à y = 0,52 sur le profil actuel).
 */
const R = 1.02;
/** Aplatissement du dôme (1 = hémisphère). Aussi l'échelle Y de la sphère. */
const DOME = 0.34;
/** Hauteur de l'équateur du dôme. */
const Y_DOME = 0.52;

const CHAUD = new THREE.Color("#ee4520");
const OR = new THREE.Color("#ffbf2e");
/**
 * ⚠️ IL N'Y A PLUS DE CONTRE-JOUR VIOLET.
 *
 * L'ancienne version détourait le bowl avec un --plasma froid, au motif que le
 * rim-light froid sur sujet chaud est un code de photo culinaire. C'est vrai en
 * photo — et faux ici : combiné à l'orange saturé sur fond noir, ce violet
 * produisait exactement la signature « rendu 3D généré ». C'était le premier
 * marqueur d'artificialité de toute la scène.
 *
 * Le contre-jour est désormais doré : même fonction — détacher la silhouette
 * du fond — mais une couleur qui existe dans une cuisine.
 */
const CONTRE_JOUR = new THREE.Color("#ffd08a");

/** Hauteur du dôme à une distance `r` de l'axe. */
function hauteurDome(r: number): number {
  const dedans = Math.max(0, R * R - r * r);
  return Y_DOME + DOME * Math.sqrt(dedans);
}

/** mulberry32 — même générateur que le script d'assets, mêmes garanties. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ========================================================================== */
/*  GÉOMÉTRIES                                                                */
/* ========================================================================== */

/**
 * Le bowl, par révolution d'un profil.
 *
 * Le profil décrit la paroi intérieure du fond jusqu'à la lèvre, passe
 * par-dessus l'épaisseur du bord, puis redescend le long de la paroi
 * extérieure. On obtient une coque avec une vraie tranche visible sur la
 * lèvre — c'est ce liseré qui accroche le rim-light et donne l'objet.
 */
function useGeometrieBowl() {
  return React.useMemo(() => {
    const profil = [
      [0.0, 0.1],
      [0.42, 0.11],
      [0.76, 0.19],
      [1.0, 0.38],
      [1.14, 0.63],
      [1.2, 0.85],
      [1.29, 0.87],
      [1.25, 0.62],
      [1.11, 0.36],
      [0.86, 0.15],
      [0.46, 0.02],
      [0.0, 0.0],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    const g = new THREE.LatheGeometry(profil, 96);
    g.computeVertexNormals();
    return g;
  }, []);
}

/** Dôme de nourriture : sphère aplatie dont on ne verra que la calotte. */
function useGeometrieDome() {
  return React.useMemo(() => new THREE.SphereGeometry(R, 64, 40), []);
}

/**
 * Trois rubans de sauce qui traversent le dôme.
 *
 * Même geste que dans les illustrations SVG de la carte : des passes ouvertes
 * qui traversent, pas des boucles fermées. La cohérence entre l'illustration
 * 2D et l'objet 3D est ce qui fait tenir l'identité.
 */
function useGeometrieSauce() {
  return React.useMemo(() => {
    const r = rng(4242);
    const geos: THREE.BufferGeometry[] = [];

    for (let k = 0; k < 3; k++) {
      const angle = (k / 3) * Math.PI + r() * 0.6;
      const decalage = (k - 1) * 0.34;
      const pts: THREE.Vector3[] = [];

      for (let i = 0; i <= 14; i++) {
        const t = (i / 14 - 0.5) * 1.9;
        const onde = Math.sin(i * 0.9 + k) * 0.16;
        const lx = t;
        const ly = decalage + onde;
        const x = lx * Math.cos(angle) - ly * Math.sin(angle);
        const z = lx * Math.sin(angle) + ly * Math.cos(angle);
        const d = Math.hypot(x, z);
        if (d > R * 0.94) continue;
        pts.push(new THREE.Vector3(x, hauteurDome(d) + 0.035, z));
      }

      if (pts.length < 4) continue;
      const courbe = new THREE.CatmullRomCurve3(pts);
      geos.push(new THREE.TubeGeometry(courbe, 64, 0.035, 8, false));
    }

    return geos;
  }, []);
}

/* ========================================================================== */
/*  SEMIS D'INSTANCES                                                          */
/* ========================================================================== */

type Semis = {
  positions: Float32Array;
  rotations: Float32Array;
  echelles: Float32Array;
  /** Délai d'entrée de chaque pièce, en secondes. */
  delais: Float32Array;
  nb: number;
};

/** Répartit `nb` pièces sur la calotte du dôme, jusqu'au rayon `rMax`. */
function semer(nb: number, seed: number, rMax: number, tailleMin: number, tailleMax: number): Semis {
  const r = rng(seed);
  const positions = new Float32Array(nb * 3);
  const rotations = new Float32Array(nb * 3);
  const echelles = new Float32Array(nb);
  const delais = new Float32Array(nb);

  for (let i = 0; i < nb; i++) {
    const a = r() * Math.PI * 2;
    // Racine carrée : sans elle tout s'agglutine au centre.
    const d = Math.sqrt(r()) * rMax;
    positions[i * 3] = Math.cos(a) * d;
    positions[i * 3 + 1] = hauteurDome(d);
    positions[i * 3 + 2] = Math.sin(a) * d;
    rotations[i * 3] = r() * Math.PI * 2;
    rotations[i * 3 + 1] = r() * Math.PI * 2;
    rotations[i * 3 + 2] = r() * Math.PI * 2;
    echelles[i] = tailleMin + r() * (tailleMax - tailleMin);
    delais[i] = r();
  }

  return { positions, rotations, echelles, delais, nb };
}

/**
 * Une couche d'ingrédients instanciés.
 *
 * `chute` (0 → 1) fait tomber les pièces depuis le ciel : c'est
 * l'animation d'entrée. `elevation` les soulève ensuite pendant la descente
 * pour que la caméra puisse traverser les couches une à une.
 */
type CoucheProps = {
  semis: Semis;
  geometrie: THREE.BufferGeometry;
  couleur: THREE.Color | string;
  emission: THREE.Color | string;
  intensiteEmission?: number;
  /** Décalage vertical appliqué à toute la couche pendant la descente. */
  facteurElevation: number;
  rugosite?: number;
  /**
   * Part des pièces réellement affichées, 0 → 1.
   *
   * Sert au configurateur : trois toppings cochés remplissent le bowl, un
   * seul le garnit à peine. Les pièces au-delà du seuil sont mises à
   * l'échelle 0 plutôt que retirées — le nombre d'instances du tampon GPU
   * ne change jamais, donc aucune réallocation pendant qu'on clique.
   */
  proportion?: number;
};

function Couche({
  semis,
  geometrie,
  couleur,
  emission,
  intensiteEmission = 0.25,
  facteurElevation,
  rugosite = 0.62,
  proportion = 1,
}: CoucheProps) {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const objet = React.useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const t = pilote.temps;
    const p = pilote.progression;
    // Les couches s'écartent pendant la descente, puis se REPOSENT pendant
    // l'atelier — au même rythme que la caméra, via `avancement`.
    const separation = avancement(p, "descente") * (1 - avancement(p, "atelier"));
    const elevation = separation * facteurElevation;

    for (let i = 0; i < semis.nb; i++) {
      const x = semis.positions[i * 3];
      const yCible = semis.positions[i * 3 + 1];
      const z = semis.positions[i * 3 + 2];

      // Entrée : chaque pièce tombe après son propre délai. Au-delà de la
      // seconde 3,2 tout est posé et le terme s'annule complètement.
      const depart = 0.35 + semis.delais[i] * 2.1;
      const avancement = clamp01((t - depart) / 0.95);
      // Chute accélérée puis arrêt net : une pièce qui tombe ne freine pas.
      const chute = (1 - avancement) * (1 - avancement) * 5.4;

      // Flottement propre à chaque pièce, imperceptible mais il empêche la
      // scène de paraître figée quand on ne scrolle pas.
      const respire = pilote.mouvementReduit
        ? 0
        : Math.sin(t * 0.9 + semis.delais[i] * 12) * 0.012;

      objet.position.set(x, yCible + chute + elevation + respire, z);
      objet.rotation.set(
        semis.rotations[i * 3] + chute * 0.8,
        semis.rotations[i * 3 + 1] + chute * 0.6,
        semis.rotations[i * 3 + 2],
      );
      // `delais` sert aussi de rang stable : les mêmes pièces disparaissent
      // toujours en premier quand la proportion baisse, ce qui évite le
      // scintillement aléatoire d'un clic à l'autre.
      const retenue = semis.delais[i] <= proportion ? 1 : 0;
      const s = semis.echelles[i] * clamp01(avancement * 1.6) * retenue;
      objet.scale.setScalar(s);
      objet.updateMatrix();
      mesh.setMatrixAt(i, objet.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[geometrie, undefined, semis.nb]}
      castShadow={false}
      receiveShadow={false}
      frustumCulled={false}
    >
      <meshStandardMaterial
        color={couleur}
        emissive={emission}
        emissiveIntensity={intensiteEmission}
        roughness={rugosite}
        metalness={0.05}
        flatShading
      />
    </instancedMesh>
  );
}

/* ========================================================================== */
/*  HALO                                                                       */
/* ========================================================================== */

/** Dégradé radial en texture — sert de source lumineuse visible. */
function useTextureHalo(couleur: string) {
  return React.useMemo(() => {
    const taille = 256;
    const c = document.createElement("canvas");
    c.width = c.height = taille;
    const ctx = c.getContext("2d");
    if (!ctx) return null;

    const g = ctx.createRadialGradient(taille / 2, taille / 2, 0, taille / 2, taille / 2, taille / 2);
    g.addColorStop(0, couleur);
    g.addColorStop(0.35, `${couleur}66`);
    g.addColorStop(1, `${couleur}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, taille, taille);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [couleur]);
}

/**
 * L'ombre portée au sol.
 *
 * ⚠️ ELLE REMPLACE LES HALOS LUMINEUX, ET CE N'EST PAS UN DÉTAIL.
 * Sur fond noir, un objet se détache par la lumière : d'où les anciens halos
 * dégradés derrière le bowl. Sur fond clair, ce raisonnement s'inverse
 * complètement — un halo lumineux sur du crème ne se voit pas, et s'il se
 * voyait il ressemblerait à un défaut d'objectif.
 *
 * Ce qui pose un objet sur une surface claire, c'est son OMBRE. Sans elle, le
 * bowl flotte dans le vide et retrouve exactement l'aspect « rendu 3D » qu'on
 * cherche à fuir. Avec elle, il est posé sur une table.
 *
 * Un vrai `shadowMap` coûterait une passe de rendu supplémentaire pour un
 * résultat à peine meilleur : un disque dégradé sous l'objet suffit, et c'est
 * ce que fait tout studio photo avec un carton.
 */
function OmbrePortee({ taille, y }: { taille: number; y: number }) {
  const tex = useTextureHalo("#3a2419");
  if (!tex) return null;

  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[taille, taille]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.45}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ========================================================================== */
/*  LE PLATEAU                                                                 */
/* ========================================================================== */

/**
 * Tout ce qui tourne : bowl, contenu, sauce, halos.
 * Séparé de la caméra pour que la rotation de l'objet et le déplacement du
 * point de vue restent deux gestes distincts.
 */
function Plateau() {
  /**
   * Le seul abonnement React de toute la scène.
   *
   * Il ne se déclenche qu'au changement de recette — jamais au scroll, jamais
   * au mouvement du pointeur, qui passent par l'objet mutable partagé. Un
   * rendu de `Plateau` ne recrée aucune géométrie (toutes mémoïsées) : il ne
   * fait que repasser des couleurs aux matériaux.
   */
  const recette = useRecette();

  const groupe = React.useRef<THREE.Group>(null);
  const groupeSauce = React.useRef<THREE.Group>(null);
  const groupeDome = React.useRef<THREE.Group>(null);


  const geoBowl = useGeometrieBowl();
  const geoDome = useGeometrieDome();
  const geosSauce = useGeometrieSauce();

  const geoMorceau = React.useMemo(() => new THREE.IcosahedronGeometry(0.14, 0), []);
  const geoTopping = React.useMemo(() => new THREE.TetrahedronGeometry(0.05, 0), []);
  const geoGraine = React.useMemo(() => new THREE.OctahedronGeometry(0.032, 0), []);

  const semisMorceaux = React.useMemo(() => semer(26, 1201, R * 0.78, 0.75, 1.35), []);
  const semisToppings = React.useMemo(() => semer(70, 1302, R * 0.9, 0.7, 1.5), []);
  const semisGraines = React.useMemo(() => semer(90, 1403, R * 0.94, 0.6, 1.4), []);

  React.useEffect(() => {
    return () => {
      geoBowl.dispose();
      geoDome.dispose();
      geoMorceau.dispose();
      geoTopping.dispose();
      geoGraine.dispose();
      for (const g of geosSauce) g.dispose();
    };
  }, [geoBowl, geoDome, geoMorceau, geoTopping, geoGraine, geosSauce]);

  useFrame((_, delta) => {
    const g = groupe.current;
    if (!g) return;

    const p = pilote.progression;

    // Rotation continue, très lente. Elle ne s'arrête jamais : un objet
    // parfaitement immobile a l'air d'une image.
    if (!pilote.mouvementReduit) {
      g.rotation.y += delta * 0.11;
    }

    // Bascule : le bowl se redresse à mesure qu'on plonge dedans, pour que
    // la caméra entre par le haut sans traverser la paroi.
    const descente = avancement(p, "descente");
    const atelier = avancement(p, "atelier");
    const ecart = descente * (1 - atelier);
    g.rotation.x = lerp(0, -0.18, ecart);

    // Pendant la descente, les couches s'écartent : le dôme reste, la sauce
    // et les toppings montent (géré dans `Couche`), et le dôme lui-même
    // s'enfonce très légèrement pour creuser l'écart.
    if (groupeDome.current) {
      groupeDome.current.position.y = -ecart * 0.22;
    }
    if (groupeSauce.current) {
      groupeSauce.current.position.y = ecart * 1.35;
    }

  });

  return (
    <group ref={groupe}>
      {/* La céramique. Sombre, mate, sans reflet spéculaire marqué : c'est
          la nourriture qui doit briller, pas le contenant. */}
      <mesh geometry={geoBowl} castShadow={false}>
        {/* Une pointe d'émission chaude tient la céramique au-dessus du noir
            absolu : sans elle, la moitié non éclairée du bowl se confond
            avec le fond et l'objet perd sa silhouette. */}
        {/* Céramique brune mate. Sur fond crème, un bol sombre est un objet
            posé ; il n'a plus besoin d'émission propre pour exister, et lui
            en donner le ferait paraître lumineux de l'intérieur. */}
        <meshStandardMaterial
          color="#40291f"
          roughness={0.62}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={groupeDome}>
        <mesh geometry={geoDome} position={[0, Y_DOME, 0]} scale={[1, DOME, 1]}>
          <meshStandardMaterial
            color={couleurDe(recette.base, "#e5d6b4")}
            roughness={0.94}
            metalness={0}
          />
        </mesh>

        <Couche
          semis={semisMorceaux}
          geometrie={geoMorceau}
          couleur={couleurDe(recette.proteine, "#d08b3c")}
          emission={CHAUD}
          intensiteEmission={0.05}
          facteurElevation={0.85}
          rugosite={0.55}
          proportion={recette.extras.includes("double") ? 1 : 0.78}
        />
        <Couche
          semis={semisToppings}
          geometrie={geoTopping}
          couleur={couleurDe(recette.toppings[0] ?? "oignons", "#ffc23d")}
          emission={OR}
          intensiteEmission={0.42}
          facteurElevation={2.35}
          rugosite={0.45}
          proportion={0.25 + recette.toppings.length * 0.25}
        />
        <Couche
          semis={semisGraines}
          geometrie={geoGraine}
          couleur={couleurDe(recette.toppings[1] ?? "sesame", "#8ec44a")}
          emission="#8ec44a"
          intensiteEmission={0.3}
          facteurElevation={3.1}
          rugosite={0.5}
          proportion={0.2 + recette.toppings.length * 0.27 + recette.extras.length * 0.1}
        />
      </group>

      <group ref={groupeSauce}>
        {geosSauce.map((g, i) => (
          <mesh key={i} geometry={g}>
            <meshStandardMaterial
              color={couleurDe(recette.sauce, "#c9421f")}
              emissive={couleurDe(recette.sauce, "#c9421f")}
              emissiveIntensity={0.35}
              roughness={0.22}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* L'ombre au sol, légèrement décalée du côté opposé à la lumière clé. */}
      <OmbrePortee taille={5.2} y={-0.02} />
    </group>
  );
}

/* ========================================================================== */
/*  CAMÉRA SUR RAIL                                                            */
/* ========================================================================== */

/** Une station du rail : où est la caméra, et ce qu'elle regarde. */
type Station = {
  position: [number, number, number];
  cible: [number, number, number];
  /** Champ de vision — se resserre quand on plonge, pour l'effet de tunnel. */
  fov: number;
};

const RAIL: Record<keyof typeof ACTES, [Station, Station]> = {
  // Le bowl occupe déjà les deux tiers de la hauteur : c'est un objet qu'on
  // découvre de près, pas une vignette. La cible est placée SOUS le bowl pour
  // que la caméra pique légèrement et repousse l'objet dans le haut du cadre,
  // où le bloc typographique ne le recouvre pas.
  // La cible est très en dessous du bowl : la caméra pique, et l'objet
  // remonte dans le haut du cadre. C'est ce qui libère la moitié basse de
  // l'écran pour le bloc typographique, au lieu de le faire passer devant.
  portail: [
    { position: [0, 3.15, 6.15], cible: [0, -0.82, 0], fov: 40 },
    { position: [0, 2.95, 5.5], cible: [0, -0.72, 0], fov: 40 },
  ],
  // On plonge. La caméra descend au-dessus du bowl pendant que les couches
  // s'écartent.
  //
  // ⚠️ ELLE NE RENTRE PLUS DEDANS.
  // La version précédente finissait à l'intérieur du bol (y = 1,15, z = 0,42).
  // Spectaculaire sur fond noir ; catastrophique sur fond crème — l'écran se
  // remplissait d'un aplat beige uniforme qu'on prenait pour un bug
  // d'affichage. La station finale est désormais un plan très serré en
  // plongée, assez proche pour qu'on ne voie presque que la nourriture, mais
  // assez reculé pour que la lèvre du bol reste dans le cadre et donne
  // l'échelle.
  descente: [
    { position: [0, 2.95, 5.5], cible: [0, -0.72, 0], fov: 40 },
    { position: [0, 2.15, 1.35], cible: [0, 0.45, 0], fov: 58 },
  ],
  // On ressort en plan trois quarts. La caméra reste braquée SUR le bowl :
  // le décalage vers la droite de l'écran est obtenu par décentrement
  // d'objectif (voir `decalageAtelier` plus bas), pas en visant à côté.
  atelier: [
    { position: [0, 2.15, 1.35], cible: [0, 0.45, 0], fov: 58 },
    { position: [2.3, 2.05, 4.5], cible: [0, 0.45, 0], fov: 42 },
  ],
  // Recul final : le bowl redevient un objet, la page peut se terminer.
  sortie: [
    { position: [2.3, 2.05, 4.5], cible: [0, 0.45, 0], fov: 42 },
    { position: [0.6, 4.8, 10.2], cible: [0, 0.45, 0], fov: 38 },
  ],
};

function Camera() {
  const { camera, size } = useThree();
  const cible = React.useMemo(() => new THREE.Vector3(), []);

  /* eslint-disable react-hooks/immutability -- Piloter la caméra en mutant
     l'objet `THREE.PerspectiveCamera` DANS `useFrame` est le fonctionnement
     normal de react-three-fiber, pas un contournement : `useFrame` s'exécute
     hors du cycle de rendu React, dans la boucle d'animation du moteur, et
     n'a aucun effet sur l'arbre React.

     La règle `react-hooks/immutability` ne connaît pas cette frontière et
     voit une valeur issue d'un hook (`useThree`) modifiée après le rendu.
     L'alternative qu'elle suggère — passer par un état React — reviendrait à
     provoquer un rendu à chaque image, soit soixante par seconde.

     La désactivation est limitée à cette fonction, qui ne fait que ça. */
  useFrame((_, delta) => {
    const p = pilote.progression;

    // Lissage du pointeur — un suivi direct donne une caméra nerveuse.
    const k = Math.min(1, delta * 3.2);
    pilote.pointeurX = lerp(pilote.pointeurX, pilote.cibleX, k);
    pilote.pointeurY = lerp(pilote.pointeurY, pilote.cibleY, k);

    // Acte courant + progression locale.
    let acte: keyof typeof ACTES = "sortie";
    for (const cle of Object.keys(ACTES) as (keyof typeof ACTES)[]) {
      if (p < ACTES[cle][1]) {
        acte = cle;
        break;
      }
    }
    /* Part de l'acte consommée par le mouvement (le reste est un maintien).
       Deux actes ne doivent PAS étaler leur déplacement sur toute leur durée :

       atelier  le visiteur doit voir ce qu'il compose dès qu'il arrive sur le
                configurateur. Étalé sur toute la section, on restait au fond
                du bowl pendant qu'il cliquait, et le plan trois quarts
                n'arrivait qu'une fois la section quittée.
       sortie   elle couvre la moitié basse de la page. Un recul réparti sur
                dix écrans donne un mouvement permanent et imperceptible
                derrière un texte qu'on lit — le pire des deux mondes. */
    const VITESSE: Record<typeof acte, number> = {
      portail: 1,
      descente: 1,
      atelier: 0.25,
      sortie: 0.33,
    };

    const brut = dansActe(p, acte);
    const t = adoucir(clamp01(brut / VITESSE[acte]));
    const [a, b] = RAIL[acte];

    // La parallaxe s'atténue quand on est à l'intérieur du bowl : là, le
    // moindre déplacement traverserait la paroi.
    const dedans = adoucir(dansActe(p, "descente"));
    const ampleur = (1 - dedans * 0.75) * (pilote.mouvementReduit ? 0 : 1);

    camera.position.set(
      lerp(a.position[0], b.position[0], t) + pilote.pointeurX * 0.55 * ampleur,
      lerp(a.position[1], b.position[1], t) + pilote.pointeurY * 0.32 * ampleur,
      lerp(a.position[2], b.position[2], t),
    );

    cible.set(
      lerp(a.cible[0], b.cible[0], t) + pilote.pointeurX * 0.12 * ampleur,
      lerp(a.cible[1], b.cible[1], t),
      lerp(a.cible[2], b.cible[2], t),
    );
    camera.lookAt(cible);

    const perspective = camera as THREE.PerspectiveCamera;

    /* DÉCENTREMENT D'OBJECTIF.
       Pendant l'atelier, la colonne du configurateur occupe la moitié gauche
       de l'écran : le bowl doit se caler à droite.
       Première tentative : viser un point décalé sur la gauche. Mauvaise
       idée — l'objet se retrouve au bord du champ, là où la projection
       perspective l'étire, et le bowl paraissait franchement penché.
       `setViewOffset` translate le cadre de rendu sans toucher à l'axe de
       visée : c'est exactement le décentrement d'un objectif à bascule, et
       la géométrie reste juste. */
    const decalage = avancement(p, "atelier") * (1 - avancement(p, "sortie")) * size.width * 0.2;

    if (decalage > 0.5) {
      perspective.setViewOffset(size.width, size.height, -decalage, 0, size.width, size.height);
    } else if (perspective.view?.enabled) {
      perspective.clearViewOffset();
    }

    const fov = lerp(a.fov, b.fov, t);
    if (Math.abs(perspective.fov - fov) > 0.01) {
      perspective.fov = fov;
      perspective.updateProjectionMatrix();
    }
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

/* ========================================================================== */
/*  HORLOGE                                                                    */
/* ========================================================================== */

/**
 * Une seule horloge pour toute la scène, exposée via le pilote.
 *
 * Les composants lisent `pilote.temps` plutôt que d'appeler chacun
 * `state.clock` : ça garantit que la chute des ingrédients, le battement des
 * halos et le flottement restent en phase.
 */
function Horloge() {
  useFrame((_, delta) => {
    pilote.temps += delta;
  });
  return null;
}

/* ========================================================================== */
/*  BROUILLARD                                                                 */
/* ========================================================================== */

/**
 * Le brouillard suit la couleur de fond de la page.
 *
 * Sans ça, le bowl s'estomperait vers un brun sombre alors que la page a viré
 * au crème : on verrait une auréole grise autour de l'objet. Les deux valeurs
 * viennent de la même fonction, elles ne peuvent donc pas diverger.
 */
function Brouillard() {
  const { scene: troisD } = useThree();
  const teinte = React.useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const brouillard = troisD.fog;
    if (!brouillard) return;
      const [r, v, b] = couleurFond(pilote.progression);
    teinte.setRGB(r / 255, v / 255, b / 255, THREE.SRGBColorSpace);
    if (!brouillard.color.equals(teinte)) brouillard.color.copy(teinte);
  });

  return null;
}

/* ========================================================================== */

export function BowlRig({ qualite }: { qualite: "complete" | "legere" }) {
  return (
    <>
      <Horloge />
      <Camera />

      <Brouillard />
      {/* BROUILLARD LINÉAIRE, de la couleur exacte du fond.
          Sa raison d'être est de composition, pas d'atmosphère : dans la
          seconde moitié de la page (carte, cinéma, réseaux, teasing), le bowl
          n'est plus le sujet, c'est un décor. Sans lui, il restait aussi net
          et aussi contrasté qu'au premier écran et venait percuter les
          titres — « BOWLY'S IS EVERYWHERE. » passait littéralement dedans.

          Le plan proche est repoussé à 11 unités : sur fond clair le
          brouillard délave beaucoup plus vite qu'en fond sombre, et à 8 le
          bowl devenait laiteux dès la sortie de la descente. */}
      <fog attach="fog" args={["#fff7ec", 11, 22]} />

      {/* Ambiante volontairement faible et presque neutre.
          Première version : 0,55 en plein --plasma. Résultat, tout baignait
          dans le violet et le riz virait au rose. L'ambiante ne sert qu'à
          empêcher les ombres d'être bouchées ; le caractère vient des deux
          directionnelles, pas d'elle. */}
      {/* Ambiante ÉLEVÉE et crème : sur un fond clair, l'environnement renvoie
          énormément de lumière sur l'objet. Une ambiante faible — correcte
          dans le noir — donnerait ici un objet découpé au cutter, incohérent
          avec la surface sur laquelle il est censé reposer. */}
      <ambientLight intensity={0.68} color="#ffeedb" />

      {/* CLÉ — quasi blanche, à peine ambrée.
          ⚠️ C'EST LA RÈGLE QUI A COÛTÉ LE PLUS D'ESSAIS ICI.
          Les premières versions éclairaient avec un orange saturé (--brand-hot)
          « pour rester dans la charte ». Résultat : la lumière repeignait les
          matériaux, le riz crème virait au rose et les morceaux dorés au rouge
          vif. En photo culinaire la clé est neutre ; la couleur vient des
          accents et de l'environnement, jamais de la source principale.
          C'est ce qui permet au riz de rester du riz. */}
      <directionalLight position={[-3.2, 3.2, 2.8]} intensity={2.8} color="#fff4ea" />

      {/* CONTRE-JOUR — doré, haut et derrière. Il détoure la silhouette et
          fait briller la lèvre du bol. */}
      <directionalLight position={[3.4, 4.2, -3.2]} intensity={1.2} color={CONTRE_JOUR} />

      {/* DÉBOUCHEUR — face, très doux. C'est le carton blanc du photographe :
          il ouvre le côté à l'ombre sans créer de seconde source visible. */}
      <directionalLight position={[1.2, 1.4, 4.2]} intensity={0.7} color="#ffffff" />

      {/* Ponctuelle juste au-dessus de la nourriture : creuse le relief des
          morceaux et fait briller la sauce. Coupée en mode léger. */}
      {qualite === "complete" && (
        <pointLight position={[0, 1.9, 0.7]} intensity={9} distance={6.5} decay={2} color={OR} />
      )}

      <Plateau />
    </>
  );
}
