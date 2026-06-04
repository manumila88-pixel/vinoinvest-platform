import { useEffect, useRef } from "react";
import * as THREE from "three";

function getGlassHex(wine) {
  const t = [wine.variety, wine.name, wine.region].filter(Boolean).join(" ").toLowerCase();
  if (t.includes("champagne") || t.includes("prosecco") || t.includes("cava") || t.includes("spumante") || t.includes("cremant")) return 0x3e5c18;
  if (t.includes("chardonnay") || t.includes("sauvignon") || t.includes("riesling") || t.includes("pinot grigio") || t.includes("pinot gris") || t.includes("viognier") || t.includes("moscato") || t.includes("gewurz") || t.includes("albari") || t.includes("white") || t.includes("bianco") || t.includes("blanc") || t.includes("soave") || t.includes("vermentino")) return 0x4f7a22;
  if (t.includes("ros")) return 0x5a2035;
  if (t.includes("barolo") || t.includes("amarone") || t.includes("brunello") || t.includes("monfortino") || t.includes("masseto") || t.includes("conterno")) return 0x080f09;
  if (t.includes("cabernet") || t.includes("merlot") || t.includes("pinot noir") || t.includes("chianti") || t.includes("sassicaia") || t.includes("ornellaia")) return 0x0d2015;
  return 0x1b3d22;
}

function makeLabelTexture(wine) {
  const C = document.createElement("canvas");
  C.width = 256; C.height = 320;
  const ctx = C.getContext("2d");

  ctx.fillStyle = "#f7f2e8";
  ctx.fillRect(0, 0, 256, 320);

  ctx.strokeStyle = "#c9a227";
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, 244, 308);

  ctx.strokeStyle = "rgba(201,162,39,0.5)";
  ctx.lineWidth = 1;
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
    if (ctx.measureText(test).width > 220) { if (cur) lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);

  const ly = lines.length > 1 ? 82 : 108;
  lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, 128, ly + i * 28));

  const afterName = ly + lines.length * 28;

  if (wine.producer) {
    ctx.fillStyle = "#4a3a10";
    ctx.font = "italic 15px Georgia, serif";
    ctx.fillText(wine.producer.slice(0, 26), 128, afterName + 20);
  }

  const divY = afterName + 42;
  ctx.strokeStyle = "rgba(201,162,39,0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(64, divY); ctx.lineTo(192, divY); ctx.stroke();

  if (wine.vintage) {
    ctx.fillStyle = "#8a6010";
    ctx.font = "bold 30px Georgia, serif";
    ctx.fillText(String(wine.vintage), 128, divY + 42);
  }

  if (wine.region) {
    ctx.fillStyle = "#6a5020";
    ctx.font = "12px Georgia, serif";
    ctx.fillText(wine.region.toUpperCase().slice(0, 20), 128, divY + 62);
  }

  return new THREE.CanvasTexture(C);
}

/**
 * Bottle3D — Three.js wine bottle with CylinderGeometry
 * Props:
 *   wine        — wine object
 *   height      — canvas height in px (number)
 *   interactive — enable mouse/touch drag (default false)
 */
export default function Bottle3D({ wine, height = 300, interactive = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.offsetWidth || 300;
    const H = height;

    // ── Scene ──
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
    camera.position.set(0, 0.2, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // card mode: let clicks pass through to the parent div
    renderer.domElement.style.pointerEvents = interactive ? "auto" : "none";
    container.appendChild(renderer.domElement);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(2, 4, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3366cc, 0.3);
    fill.position.set(-3, 1, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc9a227, 0.5);
    rim.position.set(0, 5, -3);
    scene.add(rim);

    // ── Materials ──
    const glassColor = getGlassHex(wine);
    const glassMat = new THREE.MeshPhongMaterial({
      color: glassColor,
      transparent: true,
      opacity: 0.85,
      shininess: 100,
      specular: new THREE.Color(0x99bbff),
      side: THREE.DoubleSide,
    });
    const goldMat = new THREE.MeshPhongMaterial({
      color: 0xc9a227,
      shininess: 120,
      specular: new THREE.Color(0xffffaa),
    });
    const baseMat = new THREE.MeshPhongMaterial({ color: glassColor, shininess: 40 });
    const labelTex = makeLabelTexture(wine);
    const labelMat = new THREE.MeshPhongMaterial({ map: labelTex, shininess: 6 });

    // ── Bottle group (shifted so visual center ≈ camera lookat) ──
    const group = new THREE.Group();
    group.position.y = -0.4;
    scene.add(group);

    // Body — CylinderGeometry(radiusTop, radiusBottom, height, segments)
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 2, 32);
    const body = new THREE.Mesh(bodyGeo, glassMat);
    body.position.y = 0;
    group.add(body);

    // Base cap disk
    const baseGeo = new THREE.CircleGeometry(0.35, 32);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.rotation.x = -Math.PI / 2;
    base.position.y = -1.001;
    group.add(base);

    // Neck — tapered: top=0.15, bottom=0.35, h=0.6
    const neckGeo = new THREE.CylinderGeometry(0.15, 0.35, 0.6, 32);
    const neck = new THREE.Mesh(neckGeo, glassMat);
    neck.position.y = 1.3; // body top (1.0) + half neck (0.3)
    group.add(neck);

    // Cap — gold capsule: radius=0.16, h=0.2
    const capGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.2, 32);
    const cap = new THREE.Mesh(capGeo, goldMat);
    cap.position.y = 1.7; // neck top (1.6) + half cap (0.1)
    group.add(cap);

    // Label — canvas texture plane on the front face of the body
    const labelGeo = new THREE.PlaneGeometry(0.62, 0.78);
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(0, -0.15, 0.353); // just proud of body surface (r=0.35)
    group.add(labelMesh);

    // ── Interaction ──
    let isDragging = false;
    let autoRotate = true;
    let lastX = 0;
    let vel = 0;

    const onDown = (x) => { isDragging = true; autoRotate = false; lastX = x; vel = 0; };
    const onMove = (x) => {
      if (!isDragging) return;
      const dx = x - lastX;
      group.rotation.y += dx * 0.011;
      vel = dx;
      lastX = x;
    };
    const onUp = () => { isDragging = false; };

    const h = {
      md: (e) => onDown(e.clientX),
      mm: (e) => onMove(e.clientX),
      mu: onUp,
      ts: (e) => onDown(e.touches[0].clientX),
      tm: (e) => { e.preventDefault(); onMove(e.touches[0].clientX); },
      te: onUp,
    };

    if (interactive) {
      renderer.domElement.addEventListener("mousedown", h.md);
      window.addEventListener("mousemove", h.mm);
      window.addEventListener("mouseup", h.mu);
      renderer.domElement.addEventListener("touchstart", h.ts, { passive: true });
      renderer.domElement.addEventListener("touchmove", h.tm, { passive: false });
      renderer.domElement.addEventListener("touchend", h.te);
    }

    // ── Animation loop ──
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate) {
        group.rotation.y += 0.007;
      } else if (!isDragging && Math.abs(vel) > 0.1) {
        group.rotation.y += vel * 0.011;
        vel *= 0.92;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (interactive) {
        renderer.domElement.removeEventListener("mousedown", h.md);
        window.removeEventListener("mousemove", h.mm);
        window.removeEventListener("mouseup", h.mu);
        renderer.domElement.removeEventListener("touchstart", h.ts);
        renderer.domElement.removeEventListener("touchmove", h.tm);
        renderer.domElement.removeEventListener("touchend", h.te);
      }
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      [bodyGeo, baseGeo, neckGeo, capGeo, labelGeo,
        glassMat, baseMat, goldMat, labelMat, labelTex].forEach(o => o.dispose());
    };
  }, [wine.id, height, interactive]);

  return <div ref={mountRef} style={{ width: "100%", height: `${height}px` }} />;
}
