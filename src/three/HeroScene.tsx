"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { simplex3d } from "@/lib/noise.glsl";
import { scrollStore, startScrollTracking } from "@/lib/scroll-store";
import { useIsLight } from "@/lib/use-theme-colors";

/* ------------------------------------------------------------------ */
/* The core object: a noise-displaced icosahedron with a fresnel rim   */
/* ------------------------------------------------------------------ */

const blobVertex = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform float uPointer;

varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;

${simplex3d}

void main() {
  vec3 pos = position;

  // two octaves of drifting noise; scrolling tightens the frequency
  float freq = 1.15 + uScroll * 1.9;
  float n  = snoise(pos * freq + vec3(0.0, uTime * 0.22, 0.0));
  float n2 = snoise(pos * (freq * 2.6) - vec3(uTime * 0.14, 0.0, 0.0)) * 0.35;
  float amount = n + n2;

  // amplitude swells near the pointer and eases off as the hero scrolls away
  float amp = 0.28 + uPointer * 0.14 - uScroll * 0.10;
  pos += normal * amount * amp;

  vNoise = amount;
  vNormal = normalize(normalMatrix * normal);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vView = normalize(-mv.xyz);

  gl_Position = projectionMatrix * mv;
}
`;

const blobFragment = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorRim;

varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;

void main() {
  // fresnel rim: bright where the surface turns away from the camera
  float fres = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0), 2.4);

  // body gradient driven by the same noise that deforms the mesh
  float t = clamp(vNoise * 0.5 + 0.5, 0.0, 1.0);
  vec3 body = mix(uColorA, uColorB, smoothstep(0.15, 0.85, t));

  // thin contour bands keep the deformation legible while it moves
  float bands = smoothstep(0.42, 0.5, fract(vNoise * 3.0 + uTime * 0.1));
  body += bands * 0.06;

  vec3 color = body + uColorRim * fres * (1.1 + uScroll * 0.6);

  float alpha = 0.82 + fres * 0.18;
  gl_FragColor = vec4(color, alpha);
}
`;

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const pointerEase = useRef(0);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: 0 },
      uColorA: { value: new THREE.Color("#161a2b") },
      uColorB: { value: new THREE.Color("#2b2260") },
      uColorRim: { value: new THREE.Color("#8f7bff") },
    }),
    []
  );

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);

    if (mat.current) {
      mat.current.uniforms.uTime.value += d;
      mat.current.uniforms.uScroll.value = scrollStore.progress;

      // pointer distance from centre, eased so it never snaps
      const p = state.pointer;
      const target = 1 - Math.min(1, Math.hypot(p.x, p.y));
      pointerEase.current += (target - pointerEase.current) * 0.06;
      mat.current.uniforms.uPointer.value = pointerEase.current;
    }

    if (mesh.current) {
      mesh.current.rotation.y += d * 0.16;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.14;
      // rises and shrinks slightly as the hero leaves the viewport
      const wide = viewport.width > 7;
      // on narrow screens there is no room to move sideways, so lift it above
      // the body copy instead; on wide ones, offset right of the headline
      mesh.current.position.y = scrollStore.progress * 4.0 + (wide ? 0 : 0.9);
      const bias = wide ? viewport.width * 0.24 : 0;
      mesh.current.position.x +=
        (bias + state.pointer.x * 0.35 - mesh.current.position.x) * 0.04;
      mesh.current.scale.setScalar(
        (1 - Math.min(0.35, scrollStore.progress * 1.4)) * scaleFor(viewport.width)
      );
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.5, 64]} />
      <shaderMaterial
        ref={mat}
        vertexShader={blobVertex}
        fragmentShader={blobFragment}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

function scaleFor(viewportWidth: number) {
  return Math.min(1.15, Math.max(0.52, viewportWidth / 9.5));
}

/* ------------------------------------------------------------------ */
/* Particle field: depth, plus a sense of travel while scrolling       */
/* ------------------------------------------------------------------ */

const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uScroll;
attribute float aScale;
attribute float aSpeed;
varying float vAlpha;

void main() {
  vec3 pos = position;

  // independent drift, plus a scroll-linked push along Z
  pos.y += sin(uTime * aSpeed + pos.x * 2.0) * 0.25;
  pos.z = mod(pos.z + uScroll * 14.0 * aSpeed, 20.0) - 10.0;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * (26.0 / -mv.z);

  // fade at both ends of the depth range so particles never pop in
  vAlpha = smoothstep(-10.0, -4.0, mv.z) * smoothstep(0.0, -1.5, mv.z);
}
`;

const dustFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float soft = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(uColor, soft * vAlpha * 0.85);
}
`;

function Dust({ count = 900 }: { count?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const light = useIsLight();

  const [positions, scales, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = Math.random() * 20 - 10;
      sc[i] = Math.random() * 2.2 + 0.4;
      sp[i] = Math.random() * 0.8 + 0.25;
    }
    return [pos, sc, sp];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColor: { value: new THREE.Color("#c8ff2e") },
    }),
    []
  );

  // Additive blending only brightens, so lime dust over a white page is
  // invisible. On light the particles go dark and blend normally instead.
  useEffect(() => {
    if (!mat.current) return;
    mat.current.uniforms.uColor.value.set(light ? "#4a6b00" : "#c8ff2e");
    mat.current.blending = light
      ? THREE.NormalBlending
      : THREE.AdditiveBlending;
    mat.current.needsUpdate = true;
  }, [light]);

  useFrame((_, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += Math.min(delta, 0.05);
    mat.current.uniforms.uScroll.value = scrollStore.progress;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Orbiting wireframe rings                                            */
/* ------------------------------------------------------------------ */

function Rings() {
  const group = useRef<THREE.Group>(null);
  const light = useIsLight();

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.z += Math.min(delta, 0.05) * 0.08;
    group.current.rotation.x =
      0.5 +
      Math.sin(state.clock.elapsedTime * 0.15) * 0.1 +
      scrollStore.progress * 1.2;
  });

  return (
    <group ref={group}>
      {[2.6, 3.2, 3.9].map((r, i) => (
        <mesh key={r} rotation={[0, 0, (i * Math.PI) / 5]}>
          <torusGeometry args={[r, 0.004, 8, 220]} />
          <meshBasicMaterial
            color={
              i === 1
                ? light
                  ? "#5c8000"
                  : "#c8ff2e"
                : light
                  ? "#4b3ce0"
                  : "#6b5bff"
            }
            transparent
            opacity={light ? (i === 1 ? 0.4 : 0.22) : i === 1 ? 0.5 : 0.28}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Rig() {
  useFrame((state) => {
    // camera pulls back as the hero leaves, parallaxing against the DOM
    const target = 6 + scrollStore.progress * 3;
    state.camera.position.z += (target - state.camera.position.z) * 0.05;
    state.camera.position.y += (state.pointer.y * 0.4 - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  useEffect(() => startScrollTracking(), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.6} />
      <Blob />
      <Rings />
      <Dust />
      <Rig />
    </Canvas>
  );
}
