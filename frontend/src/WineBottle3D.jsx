import { useState } from "react";
import Bottle3D from "./components/Bottle3D";

export default function WineBottle3D({ wine }) {
  const [useImage, setUseImage] = useState(!!wine.imageUrl);

  if (useImage) {
    return (
      <div style={{
        width: "100%", height: "180px",
        display: "flex", alignItems: "center", justifyContent: "center",
        perspective: "280px",
        pointerEvents: "none",
      }}>
        <div style={{ animation: "cssBottleSpin 8s linear infinite" }}>
          <img
            src={wine.imageUrl}
            alt=""
            style={{
              height: "162px", width: "auto", objectFit: "contain",
              filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.7)) drop-shadow(0 0 8px rgba(201,162,39,0.15))",
            }}
            onError={() => setUseImage(false)}
          />
        </div>
      </div>
    );
  }

  // Three.js bottle — pointerEvents:none is set internally on the canvas
  return <Bottle3D wine={wine} height={180} interactive={false} />;
}
