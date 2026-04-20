# Pitàgores & Figures Planes — 2n ESO

Web estàtica de suport per a les activitats de classe sobre el **Teorema de Pitàgores**, càlcul d'àrees i aplicacions reals.

## 🎯 Objectiu

Complementa les activitats en paper (A1–A4a) amb:
- **Exercicis de reforç** — mateixos conceptes, nous números i contextos senzills
- **Exercicis d'ampliació** — contextos reals (futbol, bretxes d'abella, GPS, Minecraft, televisors...)
- **Eines interactives** — calculadora de Pitàgores, geoplanell, plotter de coordenades, hexàgon animat

## 📚 Activitats

| Fitxer | Contingut |
|--------|-----------|
| `index.html` | Pàgina principal |
| `a1.html` | Triangles rectangles i Pitàgores |
| `a2.html` | Quadrats «girats» i àrees |
| `a3.html` | Àrea de polígons regulars (hexàgons) |
| `a4.html` | Aplicacions reals (escales, GPS, drons...) |

## 🌐 Idiomes

La web funciona en **Català**, **Castellà** i **Anglès** (selector a la barra de navegació).

## 🚀 Publicació (GitHub Pages)

1. Crea un repositori nou a GitHub
2. Puja tots els fitxers
3. Ves a **Settings → Pages → Source: GitHub Actions**
4. El workflow `.github/workflows/pages.yml` publica automàticament a cada push a `main`
5. La URL serà: `https://<usuari>.github.io/<repositori>/`

## 📁 Estructura

```
/
├── index.html
├── a1.html
├── a2.html
├── a3.html
├── a4.html
├── css/
│   └── style.css
├── js/
│   ├── i18n.js     ← traduccions CA/ES/EN
│   └── app.js      ← eines interactives
└── .github/
    └── workflows/
        └── pages.yml
```

## 👨‍🏫 Professor

**Albert Godina Lapaz** · Matemàtiques 2n ESO
