"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

const COLS = 26;
const ROWS = 26;
const GAP = 0.42;
const COUNT = COLS * ROWS;

/**
 * An instanced lattice that ripples outward from the pointer and lifts
 * as the section scrolls in. One draw call for ~700 boxes.
 */
function Lattice({ progress }: { progress: RefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const eased = useRef(0);
  const pointer = useRef(new THREE.Vector2());

  // precompute the grid layout and each cell's distance from centre
  const cells = useMemo(() => {
    const out: { x: number; z: number; dist: number }[] = [];
    for (let i = 0; i < COUNT; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = (col - COLS / 2) * GAP;
      const z = (row - ROWS / 2) * GAP;
      out.push({ x, z, dist: Math.hypot(x, z) });
    }
    return out;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;

    eased.current += ((progress.current ?? 0) - eased.current) * 0.07;
    const p = eased.current;

    // project the pointer onto the lattice plane
    pointer.current.x += (state.pointer.x * 5.5 - pointer.current.x) * 0.08;
    pointer.current.y += (state.pointer.y * 3.5 - pointer.current.y) * 0.08;

    for (let i = 0; i < COUNT; i++) {
      const c = cells[i];

      // concentric wave from the centre
      const wave = Math.sin(c.dist * 1.15 - t * 1.5) * 0.34;
      // localized bump under the pointer
      const pd = Math.hypot(c.x - pointer.current.x, c.z + pointer.current.y);
      const bump = Math.exp(-pd * pd * 0.28) * 1.15;
      // whole field rises as the section enters
      const lift = p * 0.9;

      dummy.position.set(c.x, wave + bump + lift - 1.4, c.z);
      const s = 0.055 + bump * 0.05 + p * 0.02;
      dummy.scale.set(s, s + bump * 0.18, s);
      dummy.rotation.y = t * 0.15 + c.dist * 0.1;
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;

    mesh.current.rotation.y += Math.min(delta, 0.05) * 0.04;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#c8ff2e" transparent opacity={0.55} />
    </instancedMesh>
  );
}

export default function LatticeScene({ progress }: { progress: RefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 5.2], fov: 50, rotation: [-0.25, 0, 0] }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <Lattice progress={progress} />
    </Canvas>
  );
}
