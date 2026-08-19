"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";

/**
 * A wireframe knot whose rotation is bound to the host section's scroll
 * progress, so it feels scrubbed rather than merely animated.
 */
function Knot({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const eased = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    const d = Math.min(delta, 0.05);

    eased.current += ((progress.current ?? 0) - eased.current) * 0.08;
    const p = eased.current;

    group.current.rotation.y = p * Math.PI * 2.2 + state.clock.elapsedTime * 0.08;
    group.current.rotation.x = p * Math.PI * 0.9;
    group.current.scale.setScalar(0.72 + Math.sin(p * Math.PI) * 0.16);

    // pointer parallax on top of the scroll scrub
    group.current.position.x += (state.pointer.x * 0.25 - group.current.position.x) * 0.05;
    group.current.position.y += (state.pointer.y * 0.2 - group.current.position.y) * 0.05;

    group.current.children.forEach((child, i) => {
      child.rotation.z += d * (i === 0 ? 0.12 : -0.18);
    });
  });

  return (
    <group ref={group}>
      <mesh>
        <torusKnotGeometry args={[1.15, 0.3, 220, 24]} />
        <meshBasicMaterial color="#6b5bff" wireframe transparent opacity={0.45} />
      </mesh>
      <mesh scale={1.28}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#c8ff2e" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function KnotScene({ progress }: { progress: RefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <Knot progress={progress} />
    </Canvas>
  );
}
