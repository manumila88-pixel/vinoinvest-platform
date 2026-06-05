# Skill: premium-design

Checklist design premium per VinoInvest. Verifica e applica standard visivi di lusso
coerenti con una piattaforma di investimento sul vino di alta gamma.

## Trigger

Invoca quando:
- Stai creando un nuovo componente UI
- L'utente chiede miglioramenti visivi
- Un componente sembra "basic" o non allineato al brand

## Standard di design VinoInvest

### Tipografia
```css
/* Font principale */
font-family: 'Playfair Display', Georgia, serif;   /* titoli, prezzi, score */
font-family: 'Inter', 'Helvetica Neue', sans-serif; /* corpo, badge, label */

/* Scala tipografica */
h1: 56px, weight 800, line-height 1.1
h2: 32-36px, weight 800
h3: 20-24px, weight 700
body: 14-15px, weight 400
label: 11-12px, uppercase, letter-spacing 0.08em
```

Carica Playfair Display in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
```

### Palette colori
```css
--gold:        #c9a227   /* oro primario — prezzi, accent, CTA */
--gold-light:  #f0c040   /* oro highlight */
--gold-dim:    #c9a22722 /* oro trasparente — hover, badge bg */
--bordeaux:    #722F37   /* vino rosso — chart line, accenti caldi */
--navy:        #020617   /* sfondo principale */
--navy-card:   #0b1220   /* card background */
--navy-border: #1f2937   /* bordi sottili */
--navy-mid:    #1e293b   /* bordi secondari, separatori */
--slate:       #64748b   /* testo secondario */
--slate-light: #94a3b8   /* placeholder, disabled */
--green:       #4ade80   /* profit, bullish, low risk */
--red:         #f87171   /* loss, bearish, high risk */
--blue:        #60a5fa   /* info, link, badge */
```

### Glassmorphism header
```css
.header {
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(201, 162, 39, 0.12);
  position: sticky;
  top: 0;
  z-index: 100;
}
```

### 3D tilt card
```jsx
// Applica a wineCard con mouse tracking
const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  e.currentTarget.style.transform =
    `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
};
const handleMouseLeave = (e) => {
  e.currentTarget.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
};
// Aggiunge: onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
```

### Animazioni CSS
```css
/* Fade-in su mount */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-in { animation: fadeInUp 0.35s ease forwards; }

/* Shimmer skeleton loading */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #0b1220 25%, #1e293b 50%, #0b1220 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

/* Pulse su badge "live" */
@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(201,162,39,0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(201,162,39,0); }
}
.badge-live { animation: pulse-gold 2s infinite; }
```

### Parallax hero
```jsx
useEffect(() => {
  const onScroll = () => {
    const y = window.scrollY;
    heroRef.current.style.transform = `translateY(${y * 0.4}px)`;
    heroRef.current.style.opacity = 1 - y / 400;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

### Componenti standard

**Badge score:**
```jsx
<span style={{
  fontFamily: "'Playfair Display', serif",
  fontSize: 22,
  fontWeight: 800,
  color: "#c9a227",
  letterSpacing: "-0.02em",
}}>{score}</span>
```

**Separatore decorativo:**
```jsx
<div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
  <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #c9a22744)" }} />
  <span style={{ color: "#c9a227", fontSize: 10 }}>✦</span>
  <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #c9a22744, transparent)" }} />
</div>
```

**CTA button premium:**
```css
.btn-premium {
  background: linear-gradient(135deg, #c9a227 0%, #f0c040 50%, #c9a227 100%);
  background-size: 200% 200%;
  color: #000;
  font-weight: 800;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 15px;
  cursor: pointer;
  transition: background-position 0.4s, transform 0.2s, box-shadow 0.2s;
}
.btn-premium:hover {
  background-position: 100% 100%;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201,162,39,0.35);
}
```

## Checklist di verifica (esegui prima di ogni commit UI)

- [ ] Font Playfair Display su tutti i titoli e prezzi
- [ ] Header usa glassmorphism (backdrop-filter)
- [ ] Wine card ha 3D tilt su hover
- [ ] Score e prezzi usano `font-family: 'Playfair Display'`
- [ ] Badge usano i colori palette corretti
- [ ] Animazioni CSS su mount (fadeInUp)
- [ ] Skeleton loading su sezioni async
- [ ] Bottoni CTA usano gradiente oro
- [ ] Nessun colore hardcoded fuori dalla palette
- [ ] Dark mode: sfondo mai più chiaro di `#0b1220`
