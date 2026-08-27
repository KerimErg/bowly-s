"use client";

import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useAspect, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import type { Mesh } from "three";

import {
  abs,
  add,
  blendScreen,
  float,
  mix,
  mod,
  mx_cell_noise_float,
  oneMinus,
  pass,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
} from "three/tsl";

import styles from "./hero-futuristic.module.css";

/* ---------------------------------------------------------------------------
 * Hero expérimental — rendu WebGPU (Three.js TSL + bloom).
 *
 * ⚠️ NE PAS MONTER DIRECTEMENT. Passez par
 * `components/labo/hero-futuriste-preview.tsx`, qui détecte le support WebGPU,
 * charge ce composant à la demande et retombe sinon sur le hero statique.
 *
 * ⚠️ ASSETS DE DÉMONSTRATION À REMPLACER
 * `TEXTUREMAP` et `DEPTHMAP` pointent encore vers les images de démo du
 * composant d'origine (i.postimg.cc) : elles n'ont rien à voir avec Bowly's et
 * sont hébergées chez un tiers. Il faut une photo de bowl **et** sa carte de
 * profondeur — voir la section « Hero futuriste » du README.
 * ------------------------------------------------------------------------- */

const TEXTUREMAP = { src: "https://i.postimg.cc/XYwvXN8D/img-4.png" };
const DEPTHMAP = { src: "https://i.postimg.cc/2SHKQh2q/raw-4.webp" };

extend(THREE as unknown as Parameters<typeof extend>[0]);

const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();

  const { render, uScanProgress } = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(
      gl as unknown as THREE.WebGPURenderer,
    );
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    const uScanProgress = uniform(0);

    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    /* Balayage aux couleurs de la marque plutôt que le rouge d'origine.
       vec3 = --brand #f0452a normalisé (240/255, 69/255, 42/255). */
    const brandOverlay = vec3(0.94, 0.27, 0.16).mul(oneMinus(scanLine)).mul(0.4);

    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, brandOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0,
    );

    postProcessing.outputNode = withScanEffect.add(bloomPass);

    return { render: postProcessing, uScanProgress };
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    /* eslint-disable-next-line react-hooks/immutability --
       Muter un uniforme à chaque frame est le principe même de R3F : c'est
       ce qui évite de repasser par le rendu React soixante fois par seconde.
       La règle vise l'état React, pas les objets impératifs de Three.js. */
    uScanProgress.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

  const meshRef = useRef<Mesh>(null);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;
    const tDepthMap = texture(depthMap);
    const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(strength)));

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const flow = oneMinus(smoothstep(0, 0.02, abs(tDepthMap.sub(uProgress))));
    /* Orange de marque pour la trame, au lieu du rouge pur.
       Même teinte que le balayage, multipliée par 10 pour alimenter le bloom. */
    const mask = dot.mul(flow).mul(vec3(9.4, 2.7, 1.6));

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: blendScreen(tMap, mask),
      transparent: true,
      opacity: 0,
    });

    return { material, uniforms: { uPointer, uProgress } };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  /* Mutations par frame : idiome R3F assumé, voir la justification ci-dessus.
     `useTexture` suspend jusqu'au chargement des textures, la carte est donc
     prête dès le premier rendu — l'opacité peut viser 1 directement. */
  /* eslint-disable react-hooks/immutability */
  useFrame(({ clock }) => {
    uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    const mat = meshRef.current?.material as { opacity?: number } | undefined;
    if (mat && "opacity" in mat) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity ?? 0, 1, 0.07);
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });
  /* eslint-enable react-hooks/immutability */

  const scaleFactor = 0.4;
  return (
    <mesh
      ref={meshRef}
      scale={[w * scaleFactor, h * scaleFactor, 1]}
      material={material}
    >
      <planeGeometry />
    </mesh>
  );
};

/** Accroche Bowly's, dans le ton street-food du reste du site. */
const TITRE = "Le bowl qui craque";
const SOUS_TITRE = "Composé devant toi. Servi en cinq minutes.";

export const HeroFuturistic = () => {
  const titleWords = useMemo(() => TITRE.split(" "), []);
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords((n) => n + 1), 320);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setSubtitleVisible(true), 500);
    return () => clearTimeout(timeout);
  }, [visibleWords, titleWords.length]);

  return (
    <div className="bg-night relative h-svh">
      {/* Le texte reste du vrai DOM : lisible par les lecteurs d'écran et
          sélectionnable, contrairement à un rendu dans le canvas. */}
      <div className="pointer-events-none absolute z-60 flex h-svh w-full flex-col items-center justify-center px-10 text-center uppercase">
        <h1 className="font-display text-3xl font-extrabold text-white md:text-5xl xl:text-6xl 2xl:text-7xl">
          <span className="flex flex-wrap justify-center gap-x-3 lg:gap-x-6">
            {titleWords.map((word, index) => (
              <span
                key={word}
                className={index < visibleWords ? styles.fadeIn : undefined}
                style={{
                  animationDelay: `${index * 0.13}s`,
                  opacity: index < visibleWords ? undefined : 0,
                }}
              >
                {word}
              </span>
            ))}
          </span>
        </h1>

        <p className="mt-3 text-xs font-bold text-white md:text-xl xl:text-2xl">
          <span
            className={subtitleVisible ? styles.fadeInSubtitle : undefined}
            style={{
              animationDelay: `${titleWords.length * 0.13 + 0.2}s`,
              opacity: subtitleVisible ? undefined : 0,
            }}
          >
            {SOUS_TITRE}
          </span>
        </p>
      </div>

      <button type="button" className={styles.exploreBtn}>
        Découvrir le menu
        <span aria-hidden="true" className={styles.exploreArrow}>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <path d="M11 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 12L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <Canvas
        flat
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(
            props as ConstructorParameters<typeof THREE.WebGPURenderer>[0],
          );
          await renderer.init();
          return renderer;
        }}
      >
        <PostProcessing fullScreenEffect />
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroFuturistic;
