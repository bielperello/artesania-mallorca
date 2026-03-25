# Arquitectura del Projecte

## Visió General

L'aplicació segueix una arquitectura **Single Page Application (SPA)** amb front-end desacoblat. Tot el contingut es carrega una sola vegada a `index.html` i es genera dinàmicament via JavaScript.

## Capes de l'Aplicació

```
┌─────────────────────────────────────────┐
│            PRESENTACIÓ (HTML)           │
│  index.html → Esquelet amb IDs buits   │
│  css/styles.css → Estils i animacions  │
│  Tailwind CSS (CDN) → Utilitats        │
├─────────────────────────────────────────┤
│              LÒGICA (JS)               │
│  main.js → init(), modals, events      │
│  templates.js → 14 funcions render*()  │
│  utils.js → Helpers reutilitzables     │
├─────────────────────────────────────────┤
│            DADES (JS → JSON)           │
│  data.js → APP_DATA (objecte global)   │
│  Futur: data/*.json via fetch()        │
└─────────────────────────────────────────┘
```

## Flux de Renderitzat

1. El navegador carrega `index.html` (esquelet buit)
2. Es carreguen `data.js`, `templates.js`, `main.js`
3. `DOMContentLoaded` → `init()` s'executa
4. `init()` crida cada funció `render*()` passant dades de `APP_DATA`
5. Cada `render*()` genera HTML i l'injecta al contenidor corresponent

## Mòduls JS

### `data.js`
Objecte global `APP_DATA` amb totes les dades:
- `crafts[]` — Artesanies (nom, material, galeria, tallers, ressenyes, artesans)
- `filterZones[]`, `filterTechniques[]`, `filterMaterials[]` — Filtres
- `mapComarques[]`, `mapMaterials[]`, `mapMarkers[]` — Mapa
- `multimedia[]`, `weather{}`, `chatMessages[]` — Altres

### `templates.js`
Funcions pures que reben dades i retornen HTML string:
- `renderCatalogCards()`, `renderCraftDetail()`, `renderWeatherModal()`
- `renderMapMarkers()`, `renderMultimediaGrid()`, `renderChatMessages()`
- I 8 funcions més (filtres, galeria, geo, estrelles)

### `main.js`
Orquestrador amb:
- `init()` — Pobla tots els contenidors
- `openModal(craftId)` — Obre fitxa detallada dinàmicament
- Funcions de toggle (modals, favorits, geolocalització, xat IA)
- Event listeners per tancar modals, toggling de filtres

## Convencions

- **IDs HTML**: `catalog-grid`, `craft-modal-body`, `filter-zones`, etc.
- **Classes CSS**: Tailwind per utilitats, `styles.css` per animacions custom
- **Prefixos**: `mk-` (map markers), `ws-` (workshop items)
- **Toast**: Element `#toast` per notificacions temporals

## Com Afegir una Nova Artesania

1. Afegir objecte a `APP_DATA.crafts[]` a `data.js`
2. La funció `renderCatalogCards()` la renderitzarà automàticament
3. `openModal(id)` la trobarà per ID i generarà la fitxa completa

## Historial de Canvis

| Data | Canvi |
|------|-------|
| 2026-03-25 | Refactorització SPA: HTML simplificat + JS modular |
| 2026-03-25 | Afegides 4 artesanies, toast notifications, filtres funcionals |
