"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { DISCOVERIES, REGION_META } from "@/lib/world";
import type { Discovery, RegionId } from "@/lib/types";

const regionPositions: Record<RegionId, [number, number, number]> = {
  center: [0, 0, 0],
  park: [-2.05, 0.02, -1.2],
  river: [2.05, 0.02, 0.72],
  forest: [-1.95, 0.02, 1.55],
  industrial: [2.05, 0.02, -1.6],
  residential: [0.55, 0.02, 1.9]
};

const regionSizes: Record<RegionId, [number, number]> = {
  center: [2.3, 1.65],
  park: [1.55, 1.55],
  river: [1.75, 1.5],
  forest: [1.55, 1.45],
  industrial: [1.7, 1.4],
  residential: [1.8, 1.35]
};

function Plot({ region, active, onSelect }: { region: RegionId; active: boolean; onSelect: (region: RegionId) => void }) {
  const [hovered, setHovered] = useState(false);
  const [width, depth] = regionSizes[region];
  const [x, y, z] = regionPositions[region];
  const meta = REGION_META[region];
  const color = active ? meta.color : new THREE.Color(meta.color).multiplyScalar(0.52).getStyle();
  return (
    <group position={[x, y, z]} onClick={(event) => { event.stopPropagation(); onSelect(region); }} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={color} roughness={0.94} transparent opacity={active ? 0.88 : 0.69} />
      </mesh>
      <mesh position={[0, -0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 0.12, depth + 0.12]} />
        <meshBasicMaterial color={active ? meta.accent : "#1e3a35"} transparent opacity={active ? 0.38 : 0.65} />
      </mesh>
      {region === "center" && <CityCore />}
      {region === "park" && <ParkDetails />}
      {region === "river" && <RiverDetails />}
      {region === "forest" && <ForestDetails />}
      {region === "industrial" && <IndustrialDetails />}
      {region === "residential" && <ResidentialDetails />}
      {(hovered || active) && <Html position={[0, 0.24, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full border border-white/15 bg-[#091817]/90 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#e5f6dd] shadow-lg">
          {meta.label}
        </div>
      </Html>}
    </group>
  );
}

function CityCore() {
  return <group>
    <mesh position={[-0.47, 0.17, -0.18]} castShadow><boxGeometry args={[0.36, 0.34, 0.42]} /><meshStandardMaterial color="#d4ae70" roughness={0.6} /></mesh>
    <mesh position={[0.35, 0.22, 0.18]} castShadow><boxGeometry args={[0.32, 0.44, 0.34]} /><meshStandardMaterial color="#f2c989" roughness={0.55} /></mesh>
    <mesh position={[0.83, 0.12, -0.36]} castShadow><boxGeometry args={[0.24, 0.22, 0.32]} /><meshStandardMaterial color="#b8895d" roughness={0.7} /></mesh>
    <mesh position={[-0.02, 0.06, 0.47]}><cylinderGeometry args={[0.2, 0.24, 0.12, 12]} /><meshStandardMaterial color="#84ceb1" /></mesh>
  </group>;
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.035, 0.055, 0.4, 6]} /><meshStandardMaterial color="#704d3d" /></mesh>
    <mesh position={[0, 0.48, 0]} castShadow><icosahedronGeometry args={[0.28, 0]} /><meshStandardMaterial color="#559b6d" roughness={0.9} /></mesh>
  </group>;
}

function ParkDetails() { return <group><Tree position={[-0.47, 0.1, -0.4]} /><Tree position={[0.38, 0.1, -0.28]} scale={0.84} /><Tree position={[0.48, 0.1, 0.42]} scale={0.7} /><mesh position={[-0.05, 0.08, 0.22]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.25, 12]} /><meshStandardMaterial color="#7cc7a0" /></mesh></group>; }
function ForestDetails() { return <group><Tree position={[-0.5, 0.11, -0.4]} scale={1.18} /><Tree position={[0.35, 0.11, -0.35]} scale={1.25} /><Tree position={[-0.25, 0.11, 0.36]} scale={1.04} /><Tree position={[0.55, 0.11, 0.45]} scale={0.8} /></group>; }
function RiverDetails() { return <group><mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.5, 0.72]} /><meshStandardMaterial color="#348b91" roughness={0.2} metalness={0.15} /></mesh><mesh position={[-0.32, 0.09, 0.32]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.1, 0.35]} /><meshBasicMaterial color="#9de5d0" transparent opacity={0.8} /></mesh></group>; }
function IndustrialDetails() { return <group><mesh position={[-0.34, 0.28, -0.15]} castShadow><boxGeometry args={[0.65, 0.54, 0.42]} /><meshStandardMaterial color="#8d6c62" roughness={0.7} /></mesh><mesh position={[0.43, 0.2, 0.28]} castShadow><cylinderGeometry args={[0.16, 0.2, 0.4, 8]} /><meshStandardMaterial color="#bd8569" /></mesh><mesh position={[-0.34, 0.59, -0.15]}><boxGeometry args={[0.71, 0.03, 0.47]} /><meshStandardMaterial color="#303f3a" metalness={0.6} /></mesh></group>; }
function ResidentialDetails() { return <group><mesh position={[-0.4, 0.18, -0.2]} castShadow><boxGeometry args={[0.52, 0.33, 0.42]} /><meshStandardMaterial color="#857eae" /></mesh><mesh position={[0.38, 0.17, 0.27]} castShadow><boxGeometry args={[0.42, 0.31, 0.5]} /><meshStandardMaterial color="#a98275" /></mesh><Tree position={[0.7, 0.1, -0.36]} scale={0.68} /></group>; }

function DiscoveryMarker({ discovery, discovered, onDiscover }: { discovery: Discovery; discovered: boolean; onDiscover: (discovery: Discovery) => void }) {
  const [hovered, setHovered] = useState(false);
  const [x, y, z] = discovery.position;
  const base = regionPositions[discovery.region];
  return <group position={[base[0] + x, base[1] + y, base[2] + z]} onClick={(event) => { event.stopPropagation(); onDiscover(discovery); }} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
    <mesh position={[0, 0.1, 0]}>
      <sphereGeometry args={[discovered ? 0.1 : 0.14, 12, 8]} />
      <meshStandardMaterial color={discovered ? "#b9ff76" : "#eefab8"} emissive={discovered ? "#b9ff76" : "#cbff87"} emissiveIntensity={discovered ? 0.6 : 1.5} transparent opacity={discovered ? 0.75 : 1} />
    </mesh>
    {!discovered && <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.16, 0.19, 24]} /><meshBasicMaterial color="#b9ff76" transparent opacity={0.65} /></mesh>}
    {(hovered || discovered) && <Html position={[0, 0.38, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}><div className="rounded-md border border-[#b9ff76]/30 bg-[#081615]/95 px-2 py-1 text-[9px] text-[#e9ffd0] shadow-xl">{discovered ? "REGISTRADO" : discovery.title}</div></Html>}
  </group>;
}

function Scene({ activeRegion, discoveredIds, onRegionSelect, onDiscover }: { activeRegion: RegionId; discoveredIds: Set<string>; onRegionSelect: (region: RegionId) => void; onDiscover: (discovery: Discovery) => void }) {
  const roads = useMemo(() => [
    { position: [0, 0.005, 0.83] as [number, number, number], size: [5.9, 0.18] as [number, number], rotation: 0 },
    { position: [0.65, 0.006, 0] as [number, number, number], size: [0.18, 5.25] as [number, number], rotation: 0 },
    { position: [-1.05, 0.007, 0] as [number, number, number], size: [0.12, 5.1] as [number, number], rotation: 0 }
  ], []);
  return <>
    <color attach="background" args={["#0d2523"]} />
    <fog attach="fog" args={["#0d2523", 7, 12]} />
    <ambientLight intensity={1.7} color="#a8d6c3" />
    <directionalLight position={[-3, 7, 2]} intensity={3.2} color="#fff0c8" castShadow shadow-mapSize={[1024, 1024]} />
    <pointLight position={[0, 2, 0]} intensity={8} distance={6} color="#a8ffd6" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow><planeGeometry args={[9, 7]} /><meshStandardMaterial color="#102421" roughness={1} /></mesh>
    {roads.map((road, index) => <mesh key={index} rotation={[-Math.PI / 2, road.rotation, 0]} position={road.position}><planeGeometry args={road.size} /><meshBasicMaterial color="#1a3733" /></mesh>)}
    {(Object.keys(REGION_META) as RegionId[]).map((region) => <Plot key={region} region={region} active={region === activeRegion} onSelect={onRegionSelect} />)}
    {DISCOVERIES.map((discovery) => <DiscoveryMarker key={discovery.id} discovery={discovery} discovered={discoveredIds.has(discovery.id)} onDiscover={onDiscover} />)}
    <OrbitControls enablePan={false} minPolarAngle={0.55} maxPolarAngle={1.25} minDistance={5.2} maxDistance={8.3} target={[0, 0, 0]} />
  </>;
}

export function GameMap({ activeRegion, discoveredIds, onRegionSelect, onDiscover }: { activeRegion: RegionId; discoveredIds: Set<string>; onRegionSelect: (region: RegionId) => void; onDiscover: (discovery: Discovery) => void }) {
  return <div className="map-shell relative h-full min-h-[360px] w-full overflow-hidden rounded-2xl">
    <Canvas shadows camera={{ position: [0, 5.9, 5.5], fov: 35 }} dpr={[1, 1.75]}>
      <Scene activeRegion={activeRegion} discoveredIds={discoveredIds} onRegionSelect={onRegionSelect} onDiscover={onDiscover} />
    </Canvas>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_43%,transparent_30%,rgba(2,12,12,.5)_100%)]" />
    <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-[#071413]/65 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#b9d6ca] backdrop-blur-md"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b9ff76]" /> mapa vivo · arraste para explorar</div>
    <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg border border-white/10 bg-[#071413]/70 px-2.5 py-2 text-[9px] leading-4 text-[#96aca4] backdrop-blur-md"><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#b9ff76]" /> ponto de descoberta</div>
  </div>;
}
