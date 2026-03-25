# 🏺 Catàleg Interactiu d'Artesania Mallorquina

Web-App SPA (Single Page Application) orientada a la difusió i digitalització de l'artesania tradicional de Mallorca. Combina un catàleg interactiu, fitxes multimèdia, mapa de tallers i funcionalitats d'IA per oferir una experiència immersiva i educativa.

## 🚀 Execució

Obrir `index.html` directament al navegador (no requereix servidor).

```bash
# O amb un servidor local:
npx serve .
```

## 📁 Estructura del Projecte

```
artesania-mallorca/
├── index.html          ← Punt d'entrada SPA (esquelet HTML)
├── README.md           ← Documentació principal
├── DESIGN.md           ← Sistema de disseny "Mediterranean Clay"
│
├── css/
│   └── styles.css      ← Estils globals i animacions
│
├── js/
│   ├── data.js         ← Dades placeholder (futur: fetch JSON)
│   ├── templates.js    ← Funcions render*() que generen HTML
│   ├── main.js         ← Orquestrador: init(), modals, events
│   └── utils.js        ← Funcions auxiliars
│
├── data/               ← (Futur) Fitxers JSON estructurats
├── media/              ← (Futur) Imatges WebP, vídeos MP4, àudios
└── docs/               ← Documentació tècnica
    └── arquitectura.md
```

## 🏗️ Arquitectura

**Front-end desacoblat** amb 3 capes:

- **Presentació**: `index.html` + `css/styles.css` (Tailwind CSS via CDN)
- **Lògica**: `js/main.js` (orquestrador) + `js/templates.js` (renderitzat)
- **Dades**: `js/data.js` (objectes JS placeholder → futur JSON via `fetch()`)

## ✨ Funcionalitats

| Funcionalitat                                      | Estat |
| -------------------------------------------------- | ----- |
| Catàleg amb targetes interactives                  | ✅    |
| Filtres (zona, tècnica, material, vídeo, favorits) | ✅    |
| Canvi de columnes (2/3/4)                          | ✅    |
| Fitxa detallada amb multimèdia                     | ✅    |
| Mapa interactiu amb marcadors                      | ✅    |
| Geolocalització + tallers propers                  | ✅    |
| Previsió meteorològica (placeholder)               | ✅    |
| Galeria d'imatges                                  | ✅    |
| Ressenyes i comentaris                             | ✅    |
| Xat IA (placeholder)                               | ✅    |
| Sistema de favorits amb notificacions              | ✅    |
| Cerca per text                                     | 🔜    |
| Cerca per veu (Web Speech API)                     | 🔜    |
| Ordenació dinàmica                                 | 🔜    |
| Persistència localStorage                          | 🔜    |
| PWA / Service Worker                               | 🔜    |

## 🛠️ Tecnologies

- **HTML5** + **Tailwind CSS** (CDN)
- **JavaScript** vanilla (ES6+)
- **Google Material Symbols** (icones)
- **Fonts**: Newsreader, Playfair Display, Plus Jakarta Sans, Inter

## 📝 Llicència

© 2026 Catàleg d'Artesania Mallorquina. Tots els drets reservats.
