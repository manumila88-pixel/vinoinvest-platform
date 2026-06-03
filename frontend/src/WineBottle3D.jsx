import { useEffect, useRef } from "react";
import * as THREE from "three";

function getBottleColor(wine) {
  const text = (wine.variety || wine.name || "").toLowerCase();
  if (text.includes("champagne") || text.includes("prosecco") || text.includes("sparkling") || text.includes("cava")) {
    return 0x2d5a3d;
  }
  if (text.includes("ros") && (text.includes("é") || text.includes("e") || text.includes("ato"))) {
    return 0x6b2d45;
  }
  if (
    text.includes("white") || text.includes("bianco") || text.includes("blanc") ||
    text.includes("chardonnay") || text.includes("riesling") || text.includes("pinot grigio") ||
    text.includes("sauvignon") || text.includes("moscato") || text.includes("gewurz") ||
    text.includes("pinot gris") || text.includes("viognier") || text.includes("albari")
  ) {
    return 0x4a6e28;
  }
  return 0x1b3d22;
}

export default function WineBottle3D({ wine }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.offsetWidth || 280;
    const H = 180;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Let click events pass through the canvas to the parent div
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const key = new THREE.DirectionalLight(0xffffff, 0.95);
    key.position.set(2, 3, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3366cc, 0.25);
    fill.position.set(-3, 1, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xc9a227, 0.5);
    rim.position.set(0, 4, -3);
    scene.add(rim);

    // Bottle silhouette (LatheGeometry, Bordeaux-style)
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

    const color = getBottleColor(wine);

    const bottleGeo = new THREE.LatheGeometry(pts, 48);
    const bottleMat = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity: 0.82,
      shininess: 150,
      specular: new THREE.Color(0x88aaee),
      side: THREE.DoubleSide,
    });
    const bottle = new THREE.Mesh(bottleGeo, bottleMat);
    // Bottle height = 1.76 → center at 0.88
    bottle.position.y = -0.88;
    scene.add(bottle);

    // Base disk
    const baseGeo = new THREE.CircleGeometry(0.235, 32);
    const baseMat = new THREE.MeshPhongMaterial({ color, shininess: 60 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.rotation.x = -Math.PI / 2;
    base.position.y = 0.001;
    bottle.add(base);

    // Gold capsule (foil on neck)
    const capGeo = new THREE.CylinderGeometry(0.107, 0.107, 0.14, 32);
    const capMat = new THREE.MeshPhongMaterial({
      color: 0xc9a227,
      shininess: 110,
      specular: new THREE.Color(0xffffaa),
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 1.71; // top of neck area (local to bottle)
    bottle.add(cap);

    // Label (partial open cylinder on body)
    const labelGeo = new THREE.CylinderGeometry(
      0.302, 0.302, 0.52,
      48, 1, true,
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

    // Animation
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      bottle.rotation.y += 0.007;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bottleGeo.dispose();
      bottleMat.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      capGeo.dispose();
      capMat.dispose();
      labelGeo.dispose();
      labelMat.dispose();
    };
  }, [wine.id]);

  return <div ref={mountRef} style={{ width: "100%", height: "180px" }} />;
}
