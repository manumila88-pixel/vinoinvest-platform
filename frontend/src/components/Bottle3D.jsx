import { useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ── Glass color by wine type ───────────────────────────────────────────────
function getGlassHex(wine) {
  const t = [wine.variety, wine.name, wine.region].filter(Boolean).join(" ").toLowerCase();
  if (t.includes("champagne") || t.includes("prosecco") || t.includes("cava") || t.includes("spumante") || t.includes("cremant")) return 0x3e5c18;
  if (t.includes("chardonnay") || t.includes("sauvignon") || t.includes("riesling") || t.includes("pinot grigio") || t.includes("pinot gris") || t.includes("viognier") || t.includes("moscato") || t.includes("gewurz") || t.includes("albari") || t.includes("white") || t.includes("bianco") || t.includes("blanc") || t.includes("soave") || t.includes("vermentino")) return 0x4f7a22;
  if (t.includes("ros")) return 0x5a2035;
  if (t.includes("barolo") || t.includes("amarone") || t.includes("brunello") || t.includes("monfortino") || t.includes("masseto") || t.includes("conterno")) return 0x080f09;
  if (t.includes("cabernet") || t.includes("merlot") || t.includes("pinot noir") || t.includes("chianti") || t.includes("sassicaia") || t.includes("ornellaia")) return 0x0d2015;
  return 0x1b3d22;
}

// ── Label canvas texture ───────────────────────────────────────────────────
function makeLabel(wine) {
  const C = document.createElement("canvas");
  C.width = 256; C.height = 320;
  const ctx = C.getContext("2d");

  ctx.fillStyle = "#f7f2e8";
  ctx.fillRect(0, 0, 256, 320);

  ctx.strokeStyle = "#c9a227"; ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, 244, 308);

  ctx.strokeStyle = "rgba(201,162,39,0.45)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(18, 40); ctx.lineTo(238, 40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(18, 280); ctx.lineTo(238, 280); ctx.stroke();

  const rawName = (wine.name || "").replace(/\s+\d{4}$/, "");
  ctx.fillStyle = "#1a1205";
  ctx.font = "bold 21px Georgia, serif";
  ctx.textAlign = "center";

  const words = rawName.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > 220) { if (cur) lines.push(cur); cur = w; } else cur = test;
  }
  if (cur) lines.push(cur);

  const ly = lines.length > 1 ? 82 : 108;
  lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, 128, ly + i * 28));

  const afterName = ly + lines.length * 28;

  if (wine.producer) {
    ctx.fillStyle = "#4a3a10"; ctx.font = "italic 15px Georgia, serif";
    ctx.fillText(wine.producer.slice(0, 26), 128, afterName + 20);
  }

  const divY = afterName + 42;
  ctx.strokeStyle = "rgba(201,162,39,0.55)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(64, divY); ctx.lineTo(192, divY); ctx.stroke();

  if (wine.vintage) {
    ctx.fillStyle = "#8a6010"; ctx.font = "bold 30px Georgia, serif";
    ctx.fillText(String(wine.vintage), 128, divY + 42);
  }
  if (wine.region) {
    ctx.fillStyle = "#6a5020"; ctx.font = "12px Georgia, serif";
    ctx.fillText(wine.region.toUpperCase().slice(0, 20), 128, divY + 62);
  }

  return new THREE.CanvasTexture(C);
}

// ── The 3D bottle mesh (pure R3F JSX) ────────────────────────────────────
function BottleMesh({ wine }) {
  const glassColor = getGlassHex(wine);
  const labelTex = useMemo(() => makeLabel(wine), [wine.id]);

  // Dispose canvas texture when wine changes or unmount
  useEffect(() => () => labelTex.dispose(), [labelTex]);

  const specGlass = useMemo(() => new THREE.Color(0x99bbff), []);
  const specGold  = useMemo(() => new THREE.Color(0xffffaa), []);

  return (
    <group position={[0, -0.4, 0]}>
      {/* Body — CylinderGeometry(radiusTop, radiusBottom, height, segments) */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 2, 32]} />
        <meshPhongMaterial
          color={glassColor} transparent opacity={0.85}
          shininess={100} specular={specGlass} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Base disk */}
      <mesh position={[0, -1.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshPhongMaterial color={glassColor} shininess={40} />
      </mesh>

      {/* Neck — tapered: top 0.15, bottom 0.35 */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.15, 0.35, 0.6, 32]} />
        <meshPhongMaterial
          color={glassColor} transparent opacity={0.85}
          shininess={100} specular={specGlass} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cap — gold capsule */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.2, 32]} />
        <meshPhongMaterial color={0xc9a227} shininess={120} specular={specGold} />
      </mesh>

      {/* Label — canvas texture on front face */}
      <mesh position={[0, -0.15, 0.353]}>
        <planeGeometry args={[0.62, 0.78]} />
        <meshPhongMaterial map={labelTex} shininess={6} />
      </mesh>
    </group>
  );
}

// ── Public component ───────────────────────────────────────────────────────
/**
 * Bottle3D — React Three Fiber wine bottle
 * Props:
 *   wine        — wine object from API
 *   height      — canvas height in px
 *   interactive — true = OrbitControls drag enabled (modal), false = auto-only (card)
 */
export default function Bottle3D({ wine, height = 300, interactive = false }) {
  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <Canvas
        camera={{ position: [0, 0.2, 5.5], fov: 35, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: interactive ? "auto" : "none" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 4, 4]}   intensity={1.0} />
        <directionalLight position={[-3, 1, 2]}  intensity={0.3} color="#3366cc" />
        <directionalLight position={[0, 5, -3]}  intensity={0.5} color="#c9a227" />

        <BottleMesh wine={wine} />

        <OrbitControls
          autoRotate
          autoRotateSpeed={2.5}
          enableZoom={false}
          enablePan={false}
          enableRotate={interactive}
        />
      </Canvas>
    </div>
  );
}
