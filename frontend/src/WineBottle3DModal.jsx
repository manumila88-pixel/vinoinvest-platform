import { useEffect, useRef } from "react";
import * as THREE from "three";

function getBottleInfo(wine) {
  const text = (wine.variety || wine.name || "").toLowerCase();
  if (text.includes("champagne") || text.includes("prosecco") || text.includes("sparkling") || text.includes("cava"))
    return { color: 0x2d5a3d, label: "Bollicine" };
  if (text.includes("ros"))
    return { color: 0x6b2d45, label: "Rosé" };
  if (
    text.includes("white") || text.includes("bianco") || text.includes("blanc") ||
    text.includes("chardonnay") || text.includes("riesling") || text.includes("pinot grigio") ||
    text.includes("sauvignon") || text.includes("moscato") || text.includes("viognier") ||
    text.includes("pinot gris") || text.includes("albari") || text.includes("gewurz")
  ) return { color: 0x4a6e28, label: "Bianco" };
  return { color: 0x1b3d22, label: "Rosso" };
}

export default function WineBottle3DModal({ wine, onClose }) {
  const mountRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.offsetWidth || 520;
    const H = 420;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060e1c);
    scene.fog = new THREE.FogExp2(0x060e1c, 0.06);

    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    camera.position.set(0, 0.1, 5.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 5, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3355bb, 0.35);
    fill.position.set(-4, 2, 3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc9a227, 0.6);
    rim.position.set(0, 5, -4);
    scene.add(rim);

    const pt1 = new THREE.PointLight(0xc9a227, 0.5, 7);
    pt1.position.set(1.5, 1.5, 2.5);
    scene.add(pt1);

    const pt2 = new THREE.PointLight(0x6688ff, 0.3, 6);
    pt2.position.set(-1.5, 0.5, 2);
    scene.add(pt2);

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0x090f1e, shininess: 20 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.15;
    ground.receiveShadow = true;
    scene.add(ground);

    // Reflection disk under bottle
    const reflGeo = new THREE.CircleGeometry(0.5, 48);
    const reflMat = new THREE.MeshPhongMaterial({
      color: 0x1a2a44,
      transparent: true,
      opacity: 0.5,
      shininess: 80,
    });
    const refl = new THREE.Mesh(reflGeo, reflMat);
    refl.rotation.x = -Math.PI / 2;
    refl.position.y = -1.14;
    scene.add(refl);

    // Bottle profile (Bordeaux)
    const pts = [
      new THREE.Vector2(0.000, 0.000),
      new THREE.Vector2(0.235, 0.000),
      new THREE.Vector2(0.255, 0.025),
      new THREE.Vector2(0.275, 0.120),
      new THREE.Vector2(0.293, 0.350),
      new THREE.Vector2(0.300, 0.650),
      new THREE.Vector2(0.298, 0.850),
      new THREE.Vector2(0.272, 0.980),
      new THREE.Vector2(0.190, 1.110),
      new THREE.Vector2(0.105, 1.240),
      new THREE.Vector2(0.093, 1.500),
      new THREE.Vector2(0.092, 1.680),
      new THREE.Vector2(0.105, 1.710),
      new THREE.Vector2(0.107, 1.740),
      new THREE.Vector2(0.093, 1.760),
    ];

    const { color } = getBottleInfo(wine);

    const bottleGeo = new THREE.LatheGeometry(pts, 64);
    const bottleMat = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity: 0.83,
      shininess: 160,
      specular: new THREE.Color(0x99bbff),
      side: THREE.DoubleSide,
    });
    const bottle = new THREE.Mesh(bottleGeo, bottleMat);
    bottle.position.y = -0.88;
    bottle.castShadow = true;
    scene.add(bottle);

    // Base disk
    const baseGeo = new THREE.CircleGeometry(0.235, 48);
    const baseMat = new THREE.MeshPhongMaterial({ color, shininess: 60 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.rotation.x = -Math.PI / 2;
    base.position.y = 0.001;
    bottle.add(base);

    // Gold capsule
    const capGeo = new THREE.CylinderGeometry(0.107, 0.107, 0.14, 48);
    const capMat = new THREE.MeshPhongMaterial({
      color: 0xc9a227,
      shininess: 130,
      specular: new THREE.Color(0xffffaa),
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 1.71;
    cap.castShadow = true;
    bottle.add(cap);

    // Label
    const labelGeo = new THREE.CylinderGeometry(
      0.302, 0.302, 0.52,
      64, 1, true,
      -Math.PI * 0.42, Math.PI * 0.84
    );
    const labelMat = new THREE.MeshPhongMaterial({
      color: 0xf5f0de,
      shininess: 8,
      side: THREE.FrontSide,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = 0.42;
    bottle.add(label);

    // Mouse / touch drag rotation
    let isDragging = false;
    let autoRotate = true;
    let lastX = 0;
    let velX = 0;

    const onDown = (x) => { isDragging = true; autoRotate = false; lastX = x; velX = 0; };
    const onMove = (x) => {
      if (!isDragging) return;
      const dx = x - lastX;
      bottle.rotation.y += dx * 0.011;
      velX = dx;
      lastX = x;
    };
    const onUp = () => { isDragging = false; };

    const onMouseDown = (e) => onDown(e.clientX);
    const onMouseMove = (e) => onMove(e.clientX);
    const onMouseUp = () => onUp();
    const onTouchStart = (e) => onDown(e.touches[0].clientX);
    const onTouchMove = (e) => { e.preventDefault(); onMove(e.touches[0].clientX); };
    const onTouchEnd = () => onUp();

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false });
    renderer.domElement.addEventListener("touchend", onTouchEnd);

    // Animation
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate) {
        bottle.rotation.y += 0.006;
      } else if (!isDragging && Math.abs(velX) > 0.01) {
        // Momentum decay after drag
        bottle.rotation.y += velX * 0.011;
        velX *= 0.92;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchmove", onTouchMove);
      renderer.domElement.removeEventListener("touchend", onTouchEnd);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      [bottleGeo, bottleMat, baseGeo, baseMat, capGeo, capMat,
        labelGeo, labelMat, groundGeo, groundMat, reflGeo, reflMat].forEach(o => o.dispose());
    };
  }, [wine.id]);

  const { label: wineType } = getBottleInfo(wine);
  const aiScore = wine.analysis?.aiScore ?? wine.investmentScore ?? "—";

  return (
    <div className="bottle-overlay" onClick={onClose}>
      <div className="bottle-modal" onClick={e => e.stopPropagation()}>
        <button className="bottle-modal-close" onClick={onClose}>×</button>

        <div
          ref={mountRef}
          style={{ width: "100%", height: "420px", cursor: "grab", userSelect: "none" }}
        />

        <div className="bottle-modal-info">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 3, lineHeight: 1.3 }}>{wine.name}</h3>
              <p style={{ color: "#64748b", fontSize: 12 }}>{wine.producer} · {wine.vintage} · {wine.region}</p>
            </div>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#c9a227", whiteSpace: "nowrap" }}>€ {wine.currentPrice}</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#0c1a2e", color: "#60a5fa", border: "1px solid #1e3a5f" }}>{wineType}</span>
            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#1a1207", color: "#c9a227", border: "1px solid #5a400d" }}>AI Score {aiScore}</span>
            {wine.risk && (
              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#0d1f0d", color: "#4ade80", border: "1px solid #166534" }}>{wine.risk}</span>
            )}
            {wine.marketTrend && (
              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#131a0d", color: "#86efac", border: "1px solid #166534" }}>{wine.marketTrend}</span>
            )}
          </div>

          <p style={{ fontSize: 10, color: "#334155", marginTop: 14, textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Trascina per ruotare · ESC o clicca fuori per chiudere
          </p>
        </div>
      </div>
    </div>
  );
}
