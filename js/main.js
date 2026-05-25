// main.js — Orquestrador de l'SPA d'Artesania Mallorquina

// ── Variables globals ────────────────────────────────────────
let currentCraft = null;
let currentDescriptionAudio = null;
let catalogVisibleRows = 2;
let toastTimeout = null;
let _weatherTallerId = null;
let craftsRes = null;
let tallersRes = null;
let currentGallerySlide = 0;

// ══════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════════════════════════

function showToast(message, type = 'info', icon = 'info', duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Clear previous
    clearTimeout(toastTimeout);
    toast.classList.remove('show');

    // Set content
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.1rem;">${icon}</span> ${message}`;

    // Show
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto-hide
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ══════════════════════════════════════════════════════════════
// NAVEGACIÓ MÒBIL
// ══════════════════════════════════════════════════════════════

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    if (!menu || !icon) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        // Wait a frame for display: block to apply before animating opacity
        requestAnimationFrame(() => {
            menu.classList.remove('opacity-0', '-translate-y-2');
            menu.classList.add('opacity-100', 'translate-y-0');
        });
        icon.textContent = 'close';
    } else {
        menu.classList.remove('opacity-100', 'translate-y-0');
        menu.classList.add('opacity-0', '-translate-y-2');
        icon.textContent = 'menu';
        // Wait for animation to finish before hiding
        setTimeout(() => {
            menu.classList.add('hidden');
        }, 300);
    }
}

// ══════════════════════════════════════════════════════════════
// RENDERITZAT CENTRAL: Monta tota la pàgina
// ══════════════════════════════════════════════════════════════

function renderApp() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans transition-colors duration-300" id="design-root">
            <div class="layout-container flex h-full grow flex-col">
                ${renderHeader()}
                <main class="flex-1 w-full mx-auto" id="inici" tabindex="-1">
                    ${renderHero()}
                    ${renderAbout()}
                    ${renderCatalogSection()}
                    ${renderMapSection()}
                    ${renderMultimediaSection()}
                </main>
                ${renderFooter()}
            </div>
            ${renderFAB()}
        </div>
        ${renderModals()}
        <div id="toast" class="toast"></div>
    `;
}

// ══════════════════════════════════════════════════════════════
// INICIALITZACIÓ: renderApp → poblar contingut dinàmic → listeners
// ══════════════════════════════════════════════════════════════

async function init() {
    // 0. Carregar dades dinàmiques des dels JSON
    try {
        const [craftsResObj, tallersResObj, artGalleryResObj] = await Promise.all([
            fetch('./data/tipus_artesania.json'),
            fetch('./data/tallers_i_mestres.json'),
            fetch('./data/ArtGallery.json')       // JSON extern (Galeries d'Art)
        ]);

        if (!craftsResObj.ok || !tallersResObj.ok) {
            throw new Error('No s\'han pogut carregar els fitxers JSON (CORS/File protocol error)');
        }

        const craftsData = await craftsResObj.json();
        const tallersDataObj = await tallersResObj.json();
        const { tallers, mestres } = tallersDataObj;

        // Carregar i mapar ArtGallery.json (schema.org @graph)
        if (artGalleryResObj.ok) {
            try {
                const artGalleryData = await artGalleryResObj.json();
                // El JSON extern segueix l'estructura schema.org amb un @graph
                APP_DATA.artGalleries = artGalleryData['@graph'] || artGalleryData || [];
            } catch (e) {
                console.warn('[ArtGallery] Error parsejant ArtGallery.json:', e);
                APP_DATA.artGalleries = [];
            }
        }

        // Guardar només els camps sol·licitats a les variables globals per al xat de l'assistent IA
        craftsRes = craftsData.map(c => ({
            id: c.id,
            nom: c.nom,
            material: c.material,
            zona: c.zona,
            tecnica: c.tecnica,
            descripcioLlarga: c.descripcioLlarga,
            tallers_ids: c.tallers_ids,
            artesans_ids: c.artesans_ids
        }));

        tallersRes = {
            tallers: tallers.map(t => ({
                id: t.id,
                nom: t.nom,
                adreca: t.adreca,
                telefon: t.telefon,
                web: t.web
            })),
            mestres: mestres.map(m => ({
                id: m.id,
                nom: m.nom,
                dates: m.dates,
                lloc: m.lloc,
                bio: m.bio,
                craftId: m.craftId
            }))
        };

        // Reconstruir l'estructura original per a les plantilles UI
        APP_DATA.crafts = craftsData.map(craft => {
            const savedReviewsStr = localStorage.getItem('artesania_reviews_' + craft.id);
            let savedReviews = [];
            if (savedReviewsStr) {
                try { savedReviews = JSON.parse(savedReviewsStr); } catch (e) { }
            }
            // Suportar també les ressenyes de la versió anterior (retrocompatibilitat)
            const legacyReviewStr = localStorage.getItem('reviewed_' + craft.id);
            if (legacyReviewStr) {
                try {
                    const legacyReview = JSON.parse(legacyReviewStr);
                    if (!savedReviews.some(r => r.autor === legacyReview.autor && r.text === legacyReview.text)) {
                        savedReviews.push(legacyReview);
                    }
                } catch (e) { }
            }
            const craftTallers = tallers.filter(t => t.craftId === craft.id);
            return {
                ...craft,
                _originalRessenyes: [...(craft.ressenyes || [])],
                ressenyes: [...savedReviews, ...(craft.ressenyes || [])],
                tallers: craftTallers,
                numTallers: craftTallers.length,
                artesans: (craft.artesans_ids || []).map(id => mestres.find(m => m.id === id)).filter(Boolean)
            };
        });

        APP_DATA.tallers = tallers;
        APP_DATA.mestres = mestres;
    } catch (err) {
        console.error("Error carregant les dades JSON:", err);
        alert("⚠️ ATENCIÓ: No s'han pogut carregar les dades (JSON).\n\nSi has obert l'arxiu fent doble clic (file://), el navegador bloqueja la càrrega per seguretat.\n\nHas d'iniciar un servidor local, per exemple executant:\nnpx serve .");

        // Evitar que l'app peti si falla la càrrega
        APP_DATA.crafts = [];
        APP_DATA.tallers = [];
        APP_DATA.mestres = [];
    }

    // 1. Renderitzar tota l'estructura de la pàgina
    renderApp();

    // 2. Poblar contingut dinàmic dins els contenidors
    populateDynamicContent();

    // 3. Connectar event listeners
    attachFilterListeners();
    attachFavoritesToggle();
    attachGlobalListeners();

    // 4. Inicialitzar els filtres i l'estat inicial del catàleg
    applyFilters();

    // 5. Inicialitzar el mapa principal amb Leaflet
    initMainMap();

    // 5. Activar observador d'imatges per animacions fade-in
    initImageObserver();
}

function populateDynamicContent() {
    // Filtres del catàleg
    const filterZonesEl = document.getElementById('filter-zones');
    const filterTechniquesEl = document.getElementById('filter-techniques');
    const filterMaterialsEl = document.getElementById('filter-materials');
    if (filterZonesEl) filterZonesEl.innerHTML = renderFilterZones(APP_DATA.filterZones);
    if (filterTechniquesEl) filterTechniquesEl.innerHTML = renderFilterTechniques(APP_DATA.filterTechniques);
    if (filterMaterialsEl) filterMaterialsEl.innerHTML = renderFilterMaterials(APP_DATA.filterMaterials);

    // Targetes del catàleg
    const catalogGrid = document.getElementById('catalog-grid');
    if (catalogGrid) catalogGrid.innerHTML = renderCatalogCards(APP_DATA.crafts);

    // Mapa principal — filtres de comarca i material (reutilitzen les mateixes dades que els filtres del catàleg)
    const mapComarquesEl = document.getElementById('map-comarques');
    const mapMaterialsEl = document.getElementById('map-materials');
    if (mapComarquesEl) mapComarquesEl.innerHTML = renderMapComarques(APP_DATA.filterZones);
    if (mapMaterialsEl) mapMaterialsEl.innerHTML = renderMapMaterials(APP_DATA.filterMaterials);

    // Geolocalització — es pobla dinàmicament quan l'usuari activa la seva ubicació
    const geoList = document.getElementById('geo-list');
    if (geoList) geoList.innerHTML = renderGeoNearby(APP_DATA.tallers || []);

    // Multimèdia
    const multimediaGrid = document.getElementById('multimedia-grid');
    if (multimediaGrid) multimediaGrid.innerHTML = renderMultimediaGrid(APP_DATA.multimedia);

    // Xat IA
    loadChatHistory();
    const chatMessages = document.getElementById('ai-chat-messages');
    if (chatMessages) chatMessages.innerHTML = renderChatMessages(APP_DATA.chatMessages);

    // Weather modal — pre-render amb dades de fallback (seran substituïdes per dades reals d'Open-Meteo)
    const weatherBody = document.getElementById('weather-modal-body');
    const weatherTitle = document.getElementById('weather-title');
    if (weatherBody) weatherBody.innerHTML = renderWeatherModal(APP_DATA.weatherFallback);
    if (weatherTitle) weatherTitle.innerHTML = `Previsió Meteorològica - <span class="text-terracotta">${APP_DATA.weatherFallback.lloc}</span>`;

    // Inicialitzar els carrossels de sèrie de la part multimèdia
    initSerieCarousels();
}

/**
 * Inicialitza els carrossels de la secció Sèrie del bloc Multimèdia
 */
function initSerieCarousels() {
    const containers = document.querySelectorAll('[id^="serie-"][aria-roledescription="carrussel"]');

    containers.forEach(container => {
        const slides = container.querySelectorAll('.serie-slide');
        const dots = container.querySelectorAll('.serie-dot');
        if (slides.length === 0) return;

        let current = 0;
        let timer = null;

        function goTo(next) {
            if (!slides[current] || !dots[current]) return;

            // Diapositiva actual a invisible i aria-hidden true
            slides[current].classList.replace('opacity-100', 'opacity-0');
            slides[current].setAttribute('aria-hidden', 'true');
            if (dots[current]) {
                dots[current].classList.replace('bg-white', 'bg-white/30');
            }

            current = (next + slides.length) % slides.length;

            if (!slides[current] || !dots[current]) return;

            // Nova diapositiva a visible i aria-hidden false
            slides[current].classList.replace('opacity-0', 'opacity-100');
            slides[current].setAttribute('aria-hidden', 'false');
            if (dots[current]) {
                dots[current].classList.replace('bg-white/30', 'bg-white');
            }
        }

        function start() {
            if (timer) clearInterval(timer);
            timer = setInterval(() => {
                // Si el contenidor ha estat destruït o eliminat del DOM (p. ex., en re-renderitzar),
                // cancel·lem el temporitzador per evitar fuites de memòria.
                if (!document.body.contains(container)) {
                    clearInterval(timer);
                    timer = null;
                    return;
                }
                goTo(current + 1);
            }, 4000);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        // Pausa en passar el ratolí per sobre
        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);

        // Avançar manualment fent clic
        container.addEventListener('click', (e) => {
            stop();
            goTo(current + 1);
            start();
        });

        start();
    });
}

// ══════════════════════════════════════════════════════════════
// MAPES LEAFLET — Inicialització reutilitzable
// ══════════════════════════════════════════════════════════════

/**
 * Inicialitza el mapa principal de la secció #mapa.
 * Centrat a Mallorca amb zoom per defecte.
 */
function initMainMap() {
    const map = initLeafletMap('main-map');
    if (!map) return;

    // Connectar el botó "Restablir" del panell lateral al mapa
    const resetBtn = document.querySelector('#mapa .absolute button');
    if (resetBtn && resetBtn.textContent.includes('Restablir')) {
        resetBtn.addEventListener('click', () => {
            resetMapFilters();
            resetMapView('main-map');
        });
    }

    // Array per desar referències als marcadors dels tallers per al filtratge
    map._workshopMarkers = [];

    // Afegir marcadors de tots els tallers a la pàgina principal
    if (APP_DATA.tallers && APP_DATA.tallers.length > 0) {
        APP_DATA.tallers.forEach(taller => {
            if (taller.lat && taller.lng) {
                // Trobar l'artesania corresponent per obtenir el material
                const craft = APP_DATA.crafts.find(c => c.id === taller.craftId);
                const material = craft ? craft.material : '';

                // Color segons el material per a una millor estètica
                let markerColor = '#ec4913'; // terracotta per defecte
                if (craft) {
                    const matId = materialNameToId(craft.material);
                    const matConfig = APP_DATA.filterMaterials.find(m => m.id === matId);
                    if (matConfig) {
                        const colorMap = {
                            'primary': '#ec4913',      // Terracotta/Fang
                            'blue-500': '#3b82f6',     // Vidre
                            'pink-500': '#ec4899',     // Teixit
                            'green-600': '#16a34a',    // Palma
                            'slate-600': '#475569',    // Ferro
                            'amber-800': '#92400e',    // Cuir
                            'yellow-600': '#ca8a04'    // Rebosteria
                        };
                        markerColor = colorMap[matConfig.color] || '#ec4913';
                    }
                }

                const marker = addWorkshopMarker(map, {
                    lat: taller.lat,
                    lng: taller.lng,
                    nom: taller.nom,
                    adreca: taller.adreca,
                    telefon: taller.telefon,
                    material: material,
                    mapsQuery: taller.mapsQuery,
                    color: markerColor
                });

                if (marker) {
                    // Guardar informació útil per al filtratge al marcador
                    marker._tallerData = taller;
                    map._workshopMarkers.push(marker);
                }
            }
        });
    }
}

/**
 * Filtra els marcadors del mapa principal basant-se en els botons actius del panell lateral (comarques i materials).
 */
function applyMapFilters() {
    const mainMap = getMapInstance('main-map');
    if (!mainMap || !mainMap._workshopMarkers) return;

    // Obtenir els filtres de comarca actius
    const activeComarques = [];
    document.querySelectorAll('#map-comarques button').forEach(btn => {
        if (btn.classList.contains('border-primary') || btn.classList.contains('bg-primary/10')) {
            activeComarques.push(btn.dataset.comarca);
        }
    });

    // Obtenir els filtres de material actius
    const activeMaterials = [];
    document.querySelectorAll('#map-materials button').forEach(btn => {
        if (btn.classList.contains('border-primary') || btn.classList.contains('bg-primary/10')) {
            activeMaterials.push(btn.dataset.material);
        }
    });

    // Filtrar els marcadors del mapa
    let visibleCount = 0;
    const bounds = [];

    mainMap._workshopMarkers.forEach(marker => {
        const taller = marker._tallerData;
        const craft = APP_DATA.crafts.find(c => c.id === taller.craftId);

        let visible = true;

        // Filtrar per comarca (ubicació geogràfica del taller)
        if (activeComarques.length > 0) {
            const tallerComarca = taller.comarca || '';
            if (!activeComarques.includes(tallerComarca)) {
                visible = false;
            }
        }

        // Filtrar per material (materialNameToId(artesania.material))
        if (activeMaterials.length > 0) {
            const craftMaterial = craft ? materialNameToId(craft.material) : '';
            if (!activeMaterials.includes(craftMaterial)) {
                visible = false;
            }
        }

        if (visible) {
            if (!mainMap.hasLayer(marker)) {
                marker.addTo(mainMap);
            }
            bounds.push([taller.lat, taller.lng]);
            visibleCount++;
        } else {
            if (mainMap.hasLayer(marker)) {
                mainMap.removeLayer(marker);
            }
        }
    });

    // Ajustar vista del mapa per enfocar els tallers filtrats si hi ha filtres actius
    if (activeComarques.length > 0 || activeMaterials.length > 0) {
        if (bounds.length > 1) {
            mainMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        } else if (bounds.length === 1) {
            mainMap.setView(bounds[0], 12);
        }
        showToast(`${visibleCount} taller${visibleCount === 1 ? '' : 's'} trobat${visibleCount === 1 ? '' : 's'} al mapa`, 'info', 'map');
    } else {
        // Si no hi ha filtres actius, restablir la vista de Mallorca
        resetMapView('main-map');
    }
}

/**
 * Desactiva tots els filtres del panell lateral del mapa i torna a mostrar tots els marcadors.
 */
function resetMapFilters() {
    // Desactivar tots els botons del panell lateral del mapa
    document.querySelectorAll('#map-comarques button, #map-materials button').forEach(btn => {
        btn.classList.remove('bg-primary/10', 'border-primary', 'text-primary', 'shadow-[0_0_15px_rgba(236,73,19,0.3)]');
        btn.classList.add('bg-white', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
        const textSpan = Array.from(btn.querySelectorAll('span')).find(s => !s.classList.contains('material-symbols-outlined'));
        if (textSpan) {
            textSpan.classList.remove('font-bold');
            textSpan.classList.add('font-medium');
        }
    });

    // Tornar a afegir tots els marcadors al mapa
    const mainMap = getMapInstance('main-map');
    if (mainMap && mainMap._workshopMarkers) {
        mainMap._workshopMarkers.forEach(marker => {
            if (!mainMap.hasLayer(marker)) {
                marker.addTo(mainMap);
            }
        });
    }
}

/**
 * Inicialitza el mapa de la fitxa detallada dins el modal.
 * Centra el mapa a la posició dels tallers de l'artesania.
 * @param {Object} craft - Dades de l'artesania amb tallers
 */
function initCraftMap(craft) {
    if (!craft || !craft.tallers || craft.tallers.length === 0) return;

    // Petit delay per assegurar que el modal s'ha renderitzat completament
    setTimeout(() => {
        const map = initLeafletMap('craft-map-container', {
            zoom: 10,
            zoomControl: false
        });

        if (!map) return;

        // Afegir marcadors dels tallers amb coordenades reals
        const bounds = [];
        craft.tallers.forEach((taller, index) => {
            if (taller.lat && taller.lng) {
                const marker = addWorkshopMarker(map, {
                    lat: taller.lat,
                    lng: taller.lng,
                    nom: taller.nom,
                    adreca: taller.adreca,
                    telefon: taller.telefon,
                    material: craft.material,
                    mapsQuery: taller.mapsQuery,
                    color: index === 0 ? '#e2725b' : '#64748b'
                });
                bounds.push([taller.lat, taller.lng]);
                // Guardar referència del marcador per a selectWorkshopDetail
                if (marker) marker._tallerId = taller.id;
                // Obrir popup del primer taller
                if (index === 0 && marker) marker.openPopup();
            }
        });

        // Ajustar zoom per mostrar tots els marcadors
        if (bounds.length > 1) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        } else if (bounds.length === 1) {
            map.setView(bounds[0], 12);
        }
    }, 250);
}

// ══════════════════════════════════════════════════════════════
// FILTRES DEL CATÀLEG
// ══════════════════════════════════════════════════════════════

function attachFilterListeners() {
    // Funció auxiliar per alternar l'estat d'una píndola (botó de filtre)
    const togglePill = function () {
        if (this.classList.contains('filter-pill-active') || this.classList.contains('bg-primary')) {
            // Desactivar
            this.classList.remove('bg-primary', 'text-white', 'filter-pill-active');
            this.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300', 'border', 'border-slate-200', 'dark:border-slate-700');
        } else {
            // Activar
            this.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');
            this.classList.add('bg-primary', 'text-white', 'filter-pill-active');
        }
        // Reiniciar la paginació al canviar de filtre
        catalogVisibleRows = 2;
        // Aplicar filtres cada vegada que es fa clic
        applyFilters();
    };

    // Apliquem l'esdeveniment 'click' als tipus de filtres
    document.querySelectorAll('[data-filter="zone"]').forEach(pill => {
        pill.addEventListener('click', togglePill);
    });

    document.querySelectorAll('[data-filter="technique"]').forEach(pill => {
        pill.addEventListener('click', togglePill);
    });

    document.querySelectorAll('[data-filter="material"]').forEach(pill => {
        pill.addEventListener('click', togglePill);
    });
}

/**
 * Neteja totes les seleccions d'un tipus de filtre concret (zone, technique, material).
 */
function resetFilterGroup(filterType) {
    document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(pill => {
        pill.classList.remove('bg-primary', 'text-white', 'filter-pill-active');
        pill.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300', 'border', 'border-slate-200', 'dark:border-slate-700');
    });
    // Reiniciar la paginació al netejar grups de filtre
    catalogVisibleRows = 2;
    applyFilters();
}

function getActiveFilters() {
    // Funció auxiliar per obtenir els IDs de les píndoles actives d'un tipus concret
    const getActiveIds = (filterType) => {
        const activeIds = [];
        document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(pill => {
            if (pill.classList.contains('bg-primary') || pill.classList.contains('filter-pill-active')) {
                activeIds.push(pill.dataset.id);
            }
        });
        return activeIds;
    };

    // Obtenim els arrays amb els IDs actius per a cada categoria
    const zones = getActiveIds('zone');
    const techniques = getActiveIds('technique');
    const materials = getActiveIds('material');

    return { zones, techniques, materials };
}

function materialNameToId(materialName) {
    const map = {
        'Fang': 'fang',
        'Argila': 'fang',
        'Ceràmica': 'fang',
        'Vidre': 'vidre',
        'Llana': 'teixit',
        'Cotó, llana i seda': 'teixit',
        'Margalló': 'palma',
        'Acer forjat': 'ferro',
        'Cuir i pell': 'cuir',
        'Farina i sucre': 'dolcos'
    };
    return map[materialName] || materialName.toLowerCase();
}

function getCurrentGridCols() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return 2;

    // Si la pantalla és de mòbil (< 768px):
    if (window.innerWidth < 768) {
        return 1;
    }
    // Si és mida de tauleta (< 1024px):
    if (window.innerWidth < 1024) {
        return 2;
    }
    // A l'escriptori comprovem les classes de Tailwind:
    if (grid.classList.contains('lg:grid-cols-3')) {
        return 3;
    }
    if (grid.classList.contains('lg:grid-cols-4')) {
        return 4;
    }
    return 2; // Per defecte
}

function applyFilters() {
    const { zones, techniques, materials } = getActiveFilters();
    const cards = Array.from(document.querySelectorAll('#catalog-grid > div'));
    let visibleCount = 0;

    // Comprovar si el filtre de favorits està actiu
    const favToggle = document.getElementById('favorites-toggle');
    const onlyFavorites = favToggle && favToggle.checked;
    const favorites = onlyFavorites ? getFavorites() : null;

    // Comprovar si hi ha text de cerca actiu
    const searchInput = document.getElementById('catalog-search');
    const query = searchInput ? searchInput.value.trim() : "";
    const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Mapes auxiliars per cercar millor
    const zoneNames = {};
    APP_DATA.filterZones.forEach(z => { zoneNames[z.id] = z.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); });

    const techniqueNames = {};
    APP_DATA.filterTechniques.forEach(t => { techniqueNames[t.id] = t.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); });

    const matchingCards = [];

    cards.forEach(card => {
        const craftId = card.getAttribute('data-craft-id');
        const craft = APP_DATA.crafts.find(c => c.id === craftId);
        if (!craft) return;

        let visible = true;

        // Favorites filter
        if (onlyFavorites && !favorites.has(craft.id)) {
            visible = false;
        }

        // Zone filter
        if (zones.length > 0 && craft.zona && !zones.includes(craft.zona)) {
            visible = false;
        }

        // Technique filter
        if (techniques.length > 0 && craft.tecnica && !techniques.includes(craft.tecnica)) {
            visible = false;
        }

        // Material filter
        if (materials.length > 0) {
            const craftMatId = materialNameToId(craft.material);
            if (!materials.includes(craftMatId)) {
                visible = false;
            }
        }

        // Text search filter
        if (visible && normalizedQuery) {
            const searchFields = [
                craft.nom,
                craft.material,
                craft.descripcio,
                craft.descripcioLlarga,
                craft.tecnica,
                techniqueNames[craft.tecnica] || '',
                zoneNames[craft.zona] || '',
                ...(craft.tallers || []).map(t => t.nom),
                ...(craft.artesans || []).map(a => a.nom)
            ].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            if (!searchFields.includes(normalizedQuery)) {
                visible = false;
            }
        }

        if (visible) {
            matchingCards.push(card);
        } else {
            card.style.display = 'none';
        }
    });

    // Paginació dinàmica en base a les columnes i files
    const cols = getCurrentGridCols();
    const limit = cols * catalogVisibleRows;

    matchingCards.forEach((card, index) => {
        if (index < limit) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Control de visibilitat del botó "Carregar més" i "Mostrar menys"
    const loadMoreContainer = document.getElementById('catalog-load-controls');
    const loadMoreBtn = document.getElementById('load-more-crafts-btn');
    const showLessBtn = document.getElementById('show-less-crafts-btn');
    const MIN_ROWS = 2; // mínim de files (4 artesanies en 2 col·les = 4 mínim)

    if (loadMoreContainer) {
        const hasMore = matchingCards.length > limit;
        const hasExtra = catalogVisibleRows > MIN_ROWS;

        // Botó "Carregar més"
        if (loadMoreBtn) {
            if (hasMore) {
                loadMoreBtn.classList.remove('hidden');
            } else {
                loadMoreBtn.classList.add('hidden');
            }
        }

        // Botó "Mostrar menys"
        if (showLessBtn) {
            if (hasExtra) {
                showLessBtn.classList.remove('hidden');
            } else {
                showLessBtn.classList.add('hidden');
            }
        }

        // Amagar el contenidor sencer si cap botó és visible
        if (!hasMore && !hasExtra) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'flex';
        }
    }

    // Mostrar notificacions toast si hi ha filtres o cerca activa
    if (normalizedQuery) {
        showToast(`${visibleCount} resultat${visibleCount !== 1 ? 's' : ''} per "${query}"`, 'info', 'search');
    } else {
        const hasFilters = zones.length > 0 || techniques.length > 0 || materials.length > 0 || onlyFavorites;
        if (hasFilters) {
            showToast(`${visibleCount} artesani${visibleCount === 1 ? 'a' : 'es'} trobad${visibleCount === 1 ? 'a' : 'es'}`, 'info', 'filter_list');
        }
    }
}

// ══════════════════════════════════════════════════════════════
// MODALS: Obrir / Tancar
// ══════════════════════════════════════════════════════════════

function openModal(craftId) {
    // Sincronitzar primer les ressenyes del localStorage (incloses les legacy)
    refreshCraftsReviews();

    const craft = APP_DATA.crafts.find(c => c.id === craftId);
    if (!craft) return;

    currentCraft = craft;

    // Inicialitzar els límits i ordenació de ressenyes
    currentReviewsLimit = 3;
    currentReviewSort = 'recents';
    sortReviews(craft, 'recents');

    // Poblar el cos del modal
    const body = document.getElementById('craft-modal-body');
    if (body) {
        body.innerHTML = renderCraftDetail(craft);
        checkReviewStatus(craft.id);

        // Injectar les galeries d'art del JSON extern just sota del bloc Tallers+Mapa
        if (APP_DATA.artGalleries && APP_DATA.artGalleries.length > 0) {
            body.querySelector('.p-8')?.insertAdjacentHTML(
                'beforeend',
                renderArtGalleries(APP_DATA.artGalleries)
            );
        }

        // Activar l'observer de imatges per al fade-in del contingut del modal
        initImageObserver();
    }

    // Poblar galeria modal
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        const galleryTitle = document.getElementById('gallery-title');
        if (galleryTitle) {
            galleryTitle.textContent = `Galeria de ${craft.nom}`;
        }
        galleryGrid.innerHTML = renderGalleryImages(craft);
        // Activar observer per a les imatges de la galeria
        initImageObserver();
    }

    // Sincronitzar estat del botó de favorit del modal
    const isFav = getFavorites().has(craftId);
    const modalFavBtn = document.querySelector('#craft-modal-content [aria-label="Afegir a preferits"]');
    if (modalFavBtn) {
        const modalFavIcon = modalFavBtn.querySelector('.material-symbols-outlined');
        if (isFav) {
            modalFavBtn.classList.add('is-favorite', 'text-red-500', 'bg-red-50');
            modalFavBtn.classList.remove('text-slate-400', 'bg-slate-100');
            if (modalFavIcon) modalFavIcon.style.fontVariationSettings = "'FILL' 1";
        } else {
            modalFavBtn.classList.remove('is-favorite', 'text-red-500', 'bg-red-50');
            if (modalFavIcon) modalFavIcon.style.fontVariationSettings = '';
        }
    }

    // Mostrar el modal
    const modal = document.getElementById('craft-modal');
    const modalContent = document.getElementById('craft-modal-content');
    if (!modal || !modalContent) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);

    // Inicialitzar el mapa Leaflet de la fitxa
    initCraftMap(craft);
}

function closeModal() {
    if (currentDescriptionAudio) {
        currentDescriptionAudio.pause();
        currentDescriptionAudio = null;
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    const modal = document.getElementById('craft-modal');
    const modalContent = document.getElementById('craft-modal-content');
    if (!modal || !modalContent) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    // Tornar al principi del modal
    modalContent.scrollTop = 0;
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        // Destruir el mapa de la fitxa per alliberar recursos
        destroyMap('craft-map-container');
    }, 300);

    currentCraft = null;
}

function openWeatherModal(tallerId) {
    _weatherTallerId = tallerId || null;

    const modal = document.getElementById('weather-modal');
    const modalContent = document.getElementById('weather-modal-content');
    if (!modal || !modalContent) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);

    // Obtenir dades meteorològiques reals des d'Open-Meteo
    fetchAndRenderWeather();
}

function closeWeatherModal() {
    const modal = document.getElementById('weather-modal');
    const modalContent = document.getElementById('weather-modal-content');
    if (!modal || !modalContent) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}

/**
 * Obté les dades meteorològiques reals d'Open-Meteo i actualitza el modal.
 * Prioritat de coordenades: 1) Taller concret, 2) Mallorca per defecte.
 * En cas d'error, manté les dades placeholder.
 */
async function fetchAndRenderWeather() {
    const weatherBody = document.getElementById('weather-modal-body');
    const weatherTitle = document.getElementById('weather-title');
    if (!weatherBody) return;

    // Mostrar indicador de càrrega
    weatherBody.innerHTML = `
        <div class="flex items-center justify-center p-12">
            <div class="flex flex-col items-center gap-3">
                <span class="material-symbols-outlined text-terracotta text-4xl animate-spin">progress_activity</span>
                <p class="text-sm text-slate-500 font-medium">Obtenint dades meteorològiques...</p>
            </div>
        </div>
    `;

    // Cercar el taller concret per obtenir les seves coordenades
    let lat = null, lng = null, llocNom = 'Mallorca';

    if (_weatherTallerId && currentCraft) {
        const taller = currentCraft.tallers.find(t => t.id === _weatherTallerId);
        if (taller && taller.lat && taller.lng) {
            lat = taller.lat;
            lng = taller.lng;
            llocNom = taller.nom;
        }
    }

    // Invalidar cache si canvien les coordenades (diferent taller)
    WeatherService.invalidateCache();
    const weatherData = await WeatherService.fetchWeather(lat, lng);

    if (weatherData) {
        weatherData.lloc = llocNom;
        weatherBody.innerHTML = renderWeatherModal(weatherData);
        if (weatherTitle) {
            weatherTitle.innerHTML = `Previsió Meteorològica - <span class="text-terracotta">${llocNom}</span>`;
        }
    } else {
        weatherBody.innerHTML = renderWeatherModal(APP_DATA.weatherFallback);
        if (weatherTitle) {
            weatherTitle.innerHTML = `Previsió Meteorològica - <span class="text-terracotta">${APP_DATA.weatherFallback.lloc}</span>`;
        }
        showToast('No s\'han pogut obtenir les dades meteorològiques reals', 'warning', 'cloud_off');
    }
}

function openGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    const content = document.getElementById('gallery-content');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
    }, 10);

    // Inicialitzar slider
    currentGallerySlide = 0;
    setTimeout(() => {
        goToGallerySlide(0);
        initGalleryScrollListener();
    }, 50);

    // Navegació per teclat
    const onGalleryKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            slideGallery(-1);
        } else if (e.key === 'ArrowRight') {
            slideGallery(1);
        } else if (e.key === 'Escape') {
            closeGalleryModal();
        }
    };
    document.addEventListener('keydown', onGalleryKeyDown);

    // Guardar listener per poder eliminar-lo en tancar el modal
    modal._onKeyDown = onGalleryKeyDown;
}

function slideGallery(direction) {
    const wrapper = document.getElementById('gallery-slider-wrapper');
    if (!wrapper) return;
    const slides = wrapper.querySelectorAll('.gallery-slide');
    if (slides.length === 0) return;

    currentGallerySlide = (currentGallerySlide + direction + slides.length) % slides.length;
    goToGallerySlide(currentGallerySlide);
}

function goToGallerySlide(index) {
    const wrapper = document.getElementById('gallery-slider-wrapper');
    if (!wrapper) return;
    const slides = wrapper.querySelectorAll('.gallery-slide');
    if (slides.length === 0 || index < 0 || index >= slides.length) return;

    currentGallerySlide = index;

    // Aturar vídeo si sortim de la primera diapositiva (índex 0)
    if (index !== 0) {
        const video = wrapper.querySelector('video');
        if (video && !video.paused) {
            video.pause();
        }
    }

    // Scroll a la diapositiva corresponent
    const targetSlide = slides[index];
    wrapper.scrollTo({
        left: targetSlide.offsetLeft,
        behavior: 'smooth'
    });

    // Actualitzar comptador
    const counter = document.getElementById('gallery-counter');
    if (counter) {
        counter.textContent = `${currentGallerySlide + 1} / ${slides.length}`;
    }

    // Actualitzar punts actius
    const dots = document.querySelectorAll('#gallery-dots span');
    dots.forEach((dot, idx) => {
        if (idx === currentGallerySlide) {
            dot.classList.add('bg-white/80', 'scale-110');
            dot.classList.remove('bg-white/30', 'hover:bg-white/50');
        } else {
            dot.classList.remove('bg-white/80', 'scale-110');
            dot.classList.add('bg-white/30', 'hover:bg-white/50');
        }
    });
}

function initGalleryScrollListener() {
    const wrapper = document.getElementById('gallery-slider-wrapper');
    if (!wrapper) return;

    let scrollTimeout;
    wrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const width = wrapper.clientWidth;
            if (width === 0) return;
            const scrollLeft = wrapper.scrollLeft;
            const newIndex = Math.round(scrollLeft / width);

            const slides = wrapper.querySelectorAll('.gallery-slide');
            if (slides.length > 0 && newIndex !== currentGallerySlide && newIndex >= 0 && newIndex < slides.length) {
                currentGallerySlide = newIndex;

                // Aturar vídeo si sortim de la primera diapositiva (índex 0)
                if (newIndex !== 0) {
                    const video = wrapper.querySelector('video');
                    if (video && !video.paused) {
                        video.pause();
                    }
                }

                // Actualitzar comptador
                const counter = document.getElementById('gallery-counter');
                if (counter) {
                    counter.textContent = `${currentGallerySlide + 1} / ${slides.length}`;
                }

                // Actualitzar punts actius
                const dots = document.querySelectorAll('#gallery-dots span');
                dots.forEach((dot, idx) => {
                    if (idx === currentGallerySlide) {
                        dot.classList.add('bg-white/80', 'scale-110');
                        dot.classList.remove('bg-white/30', 'hover:bg-white/50');
                    } else {
                        dot.classList.remove('bg-white/80', 'scale-110');
                        dot.classList.add('bg-white/30', 'hover:bg-white/50');
                    }
                });
            }
        }, 100);
    });
}

/**
 * Obre el modal de galeria de fotos de la secció Multimèdia.
 * Llegeix les dades de fotos des de l'atribut data-fotos de l'element clicat.
 * @param {string} titol - Títol de la galeria
 * @param {HTMLElement} cardEl - L'element de la targeta clicat
 */
function openPhotoGallery(titol, cardEl) {
    const modal = document.getElementById('photo-gallery-modal');
    const content = document.getElementById('photo-gallery-content');
    const grid = document.getElementById('photo-gallery-grid');
    const titleEl = document.getElementById('photo-gallery-title');
    if (!modal || !grid) return;

    // Llegir les fotos des de l'atribut data-fotos (JSON)
    let fotos = [];
    try {
        const raw = cardEl ? cardEl.getAttribute('data-fotos') : '[]';
        fotos = raw ? JSON.parse(raw.replace(/&quot;/g, '"').replace(/&#39;/g, "'")) : [];
    } catch (e) {
        console.warn('[PhotoGallery] Error parsejant data-fotos:', e);
    }

    // Actualitzar el títol del modal
    if (titleEl) titleEl.textContent = titol || 'Galeria de fotos';

    // Poblar la graella amb les fotos
    if (fotos.length > 0) {
        grid.innerHTML = fotos.map((foto, i) => `
            <div class="relative aspect-square rounded-xl overflow-hidden group shadow-md">
                <picture>
                    ${foto.avif ? `<source srcset="${foto.avif}" type="image/avif">` : ''}
                    ${foto.webp ? `<source srcset="${foto.webp}" type="image/webp">` : ''}
                    <img
                        src="${foto.src}"
                        alt="${foto.alt || titol + ' — imatge ' + (i + 1)}"
                        loading="${i === 0 ? 'eager' : 'lazy'}"
                        class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    >
                </picture>
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl"></div>
            </div>`
        ).join('');
    } else {
        grid.innerHTML = `<p class="text-white/60 text-center col-span-full py-12">No hi ha fotos disponibles</p>`;
    }

    // Mostrar modal amb animació
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
    });

    // Tancar amb Escape
    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            closePhotoGallery();
            document.removeEventListener('keydown', onKeyDown);
        }
    };
    document.addEventListener('keydown', onKeyDown);

    // Tancar clicant el fons
    modal.onclick = (e) => {
        if (e.target === modal) closePhotoGallery();
    };
}

/**
 * Tanca el modal de galeria de fotos de la secció Multimèdia.
 */
function closePhotoGallery() {
    const modal = document.getElementById('photo-gallery-modal');
    const content = document.getElementById('photo-gallery-content');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        modal.onclick = null;
        // Buidar la graella per alliberar recursos
        const grid = document.getElementById('photo-gallery-grid');
        if (grid) grid.innerHTML = '';
    }, 300);
}

/**
 * Obre la galeria lliscant horitzontal per a una sèrie de fotos de la secció Multimèdia.
 * @param {string} titol - Títol de la sèrie
 * @param {HTMLElement} cardEl - L'element clicat amb les dades dels slides
 */
function openSeriesGallery(titol, cardEl) {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    // Llegir els slides des de l'atribut data-slides (JSON)
    let slides = [];
    try {
        const raw = cardEl ? cardEl.getAttribute('data-slides') : '[]';
        slides = raw ? JSON.parse(raw.replace(/&quot;/g, '"').replace(/&#39;/g, "'")) : [];
    } catch (e) {
        console.warn('[SeriesGallery] Error parsejant data-slides:', e);
    }

    if (slides.length === 0) return;

    // Poblar la galeria amb el disseny d'slider de sèries
    const galleryTitle = document.getElementById('gallery-title');
    if (galleryTitle) {
        galleryTitle.textContent = titol;
    }
    galleryGrid.innerHTML = renderSeriesGalleryImages(titol, slides);
    initImageObserver();

    // Obre el modal i inicialitza el moviment horitzontal
    openGalleryModal();
}

/**
 * Obre la galeria modal amb un únic element que és un vídeo.
 * @param {string} titol - Títol del vídeo
 * @param {string} videoSrc - Ruta del fitxer de vídeo
 * @param {string} posterSrc - Ruta de la imatge de poster
 */
function openVideoGallery(titol, videoSrc, posterSrc) {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    // Llista d'imatges de la terrisseria de Ca Na Mel amb els seus peus de foto
    const images = [
        { src: './media/images/ceramica/ceramica-ca-na-mel-1.jpg', desc: 'Una botiga amb història al cor de Campos' },
        { src: './media/images/ceramica/ceramica-ca-na-mel-2.jpg', desc: 'Grans peces sota el cel de Mallorca' },
        { src: './media/images/ceramica/ceramica-ca-na-mel-3.jpg', desc: 'Respiradors d\'argila, artesania que deixa passar l\'aire' },
        { src: './media/images/ceramica/ceramica-ca-na-mel-4.jpg', desc: 'Eines de cuina i detalls per a la llar, fets amb argila i tradició' },
        { src: './media/images/ceramica/ceramica-ca-na-mel-5.jpg', desc: 'Peces de ceràmica que decoren i expliquen històries' },
        { src: './media/images/ceramica/ceramica-ca-na-mel-6.jpg', desc: 'La mar capturat en fang i color' }
    ];

    // Poblar la galeria amb el vídeo natiu i la llista d'imatges
    const galleryTitle = document.getElementById('gallery-title');
    if (galleryTitle) {
        galleryTitle.textContent = titol;
    }
    galleryGrid.innerHTML = renderMixedGallery(titol, videoSrc, posterSrc, images);
    initImageObserver();

    // Obre el modal i inicialitza el moviment
    openGalleryModal();
}

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    const content = document.getElementById('gallery-content');
    if (!modal) return;

    // Restablir el títol per defecte de la galeria
    const galleryTitle = document.getElementById('gallery-title');
    if (galleryTitle) {
        galleryTitle.textContent = 'Tota la Galeria';
    }

    // Aturar qualsevol vídeo que s'estigui reproduint dins del modal
    const videos = modal.querySelectorAll('video');
    videos.forEach(v => {
        v.pause();
        v.src = '';
        v.load();
    });

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }

    if (modal._onKeyDown) {
        document.removeEventListener('keydown', modal._onKeyDown);
        modal._onKeyDown = null;
    }

    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid) galleryGrid.innerHTML = '';
    }, 300);
}

// ══════════════════════════════════════════════════════════════
// FAVORITS: localStorage + UI
// ══════════════════════════════════════════════════════════════

const FAVORITES_KEY = 'artesania_favorites';

/**
 * Retorna un Set amb els IDs de les artesanies marcades com a favorites per a l'usuari actual.
 */
function getFavorites() {
    const user = getCurrentUser();
    if (!user) return new Set();
    try {
        const stored = localStorage.getItem(FAVORITES_KEY + '_' + user.email.toLowerCase());
        return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (e) {
        return new Set();
    }
}

/**
 * Desa el Set de favorits a localStorage per a l'usuari actual.
 */
function saveFavorites(favSet) {
    const user = getCurrentUser();
    if (!user) return;
    localStorage.setItem(FAVORITES_KEY + '_' + user.email.toLowerCase(), JSON.stringify([...favSet]));
}

/**
 * Afegeix o elimina un craft dels favorits.
 * @returns {boolean} true si ara és favorit, false si s'ha eliminat.
 */
function toggleFavorite(craftId) {
    const favs = getFavorites();
    if (favs.has(craftId)) {
        favs.delete(craftId);
        saveFavorites(favs);
        return false;
    } else {
        favs.add(craftId);
        saveFavorites(favs);
        return true;
    }
}

/**
 * Actualitza visualment el cor d'una targeta del catàleg.
 */
function updateCardHeart(craftId, isFav) {
    const card = document.querySelector(`[data-craft-id="${craftId}"]`);
    if (!card) return;
    const btn = card.querySelector('button');
    const icon = btn ? btn.querySelector('.material-symbols-outlined') : null;
    if (!btn || !icon) return;

    if (isFav) {
        btn.classList.remove('text-slate-400');
        btn.classList.add('text-red-500');
        icon.style.fontVariationSettings = "'FILL' 1";
    } else {
        btn.classList.remove('text-red-500');
        btn.classList.add('text-slate-400');
        icon.style.fontVariationSettings = "'FILL' 0";
    }
}

/**
 * Toggle favorit des d'una targeta del catàleg.
 */
function toggleFavoriteCard(craftId, btn, event) {
    if (event) event.stopPropagation();

    // Bloquejar si no s'ha iniciat sessió
    if (!getCurrentUser()) {
        showToast("Has d'iniciar sessió per desar a favorits", 'warning', 'lock');
        openAuthModal();
        return;
    }

    const isFav = toggleFavorite(craftId);
    const icon = btn.querySelector('.material-symbols-outlined');
    const card = btn.closest('[data-craft-id]');
    const nameEl = card ? card.querySelector('h3') : null;
    const craftName = nameEl ? nameEl.textContent : 'Artesania';

    // Actualitzar icona
    if (isFav) {
        btn.classList.remove('text-slate-400');
        btn.classList.add('text-red-500');
        icon.style.fontVariationSettings = "'FILL' 1";
        showToast(`${craftName} afegit a favorits`, 'favorite', 'favorite');
    } else {
        btn.classList.remove('text-red-500');
        btn.classList.add('text-slate-400');
        icon.style.fontVariationSettings = "'FILL' 0";
        showToast(`${craftName} s'ha eliminat de favorits`, 'warning', 'heart_broken');
    }

    // Si el filtre de favorits està actiu, reaplicar filtres
    const favToggle = document.getElementById('favorites-toggle');
    if (favToggle && favToggle.checked) {
        applyFilters();
    }
}

/**
 * Toggle favorit des del modal de la fitxa detallada.
 */
function toggleModalFavorite(btn) {
    const icon = btn.querySelector('.material-symbols-outlined');
    if (!icon || !currentCraft) return;

    // Bloquejar si no s'ha iniciat sessió
    if (!getCurrentUser()) {
        showToast("Has d'iniciar sessió per desar a favorits", 'warning', 'lock');
        openAuthModal();
        return;
    }

    const isFav = toggleFavorite(currentCraft.id);
    const craftName = currentCraft.nom;

    if (isFav) {
        btn.classList.add('is-favorite', 'text-red-500', 'bg-red-50');
        btn.classList.remove('text-slate-400', 'bg-slate-100');
        icon.style.fontVariationSettings = "'FILL' 1";
        showToast(`${craftName} afegit a favorits`, 'favorite', 'favorite');
    } else {
        btn.classList.remove('is-favorite', 'text-red-500', 'bg-red-50');
        btn.classList.add('text-slate-400', 'bg-slate-100');
        icon.style.fontVariationSettings = "'FILL' 0";
        showToast(`${craftName} s'ha eliminat de favorits`, 'warning', 'heart_broken');
    }

    // Sincronitzar el cor de la targeta del catàleg
    updateCardHeart(currentCraft.id, isFav);

    // Si el filtre de favorits està actiu, reaplicar filtres
    const favToggle = document.getElementById('favorites-toggle');
    if (favToggle && favToggle.checked) {
        applyFilters();
    }
}

/**
 * Connecta el listener del toggle "Només favorits".
 */
function attachFavoritesToggle() {
    const favToggle = document.getElementById('favorites-toggle');
    if (favToggle) {
        favToggle.addEventListener('change', () => {
            catalogVisibleRows = 2;
            applyFilters();
        });
    }
}

// ══════════════════════════════════════════════════════════════
// GRID: Canvi de Columnes
// ══════════════════════════════════════════════════════════════

function setGridCols(cols, btnElement) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    grid.classList.remove('md:grid-cols-2', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4');
    if (cols === 2) {
        grid.classList.add('md:grid-cols-2', 'lg:grid-cols-2');
    } else if (cols === 3) {
        grid.classList.add('md:grid-cols-2', 'lg:grid-cols-3');
    } else if (cols === 4) {
        grid.classList.add('md:grid-cols-2', 'lg:grid-cols-4');
    }

    if (btnElement) {
        document.querySelectorAll('.grid-col-btn').forEach(btn => {
            btn.classList.remove('bg-white', 'dark:bg-slate-700', 'shadow-sm', 'text-slate-800', 'dark:text-slate-200');
            btn.classList.add('text-slate-400', 'hover:text-slate-600', 'dark:hover:text-slate-300');
        });
        btnElement.classList.remove('text-slate-400', 'hover:text-slate-600', 'dark:hover:text-slate-300');
        btnElement.classList.add('bg-white', 'dark:bg-slate-700', 'shadow-sm', 'text-slate-800', 'dark:text-slate-200');
    }

    applyFilters();
    showToast(`Vista canviada a ${cols} columnes`, 'info', 'view_module');
}

// ══════════════════════════════════════════════════════════════
// GEOLOCALITZACIÓ (Confirmació → Activació → Desactivació)
// ══════════════════════════════════════════════════════════════

let geoActive = false;

function toggleGeoConfirm() {
    const confirmPanel = document.getElementById('geo-confirm');
    const geoPopup = document.getElementById('geo-popup');
    const geoIcon = document.getElementById('geo-icon');
    if (!confirmPanel) return;

    // If geo is already active, toggle the workshop list
    if (geoActive) {
        if (geoPopup && !geoPopup.classList.contains('hidden')) {
            // Hide the popup
            geoPopup.classList.remove('opacity-100', 'translate-y-0');
            geoPopup.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => geoPopup.classList.add('hidden'), 300);
        } else if (geoPopup) {
            // Show the popup
            geoPopup.classList.remove('hidden');
            setTimeout(() => {
                geoPopup.classList.remove('opacity-0', 'translate-y-2');
                geoPopup.classList.add('opacity-100', 'translate-y-0');
            }, 10);
        }
        return;
    }

    // Show confirmation dialog
    if (confirmPanel.classList.contains('hidden')) {
        confirmPanel.classList.remove('hidden');
        setTimeout(() => {
            confirmPanel.classList.remove('opacity-0', 'translate-y-2');
            confirmPanel.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    } else {
        cancelGeolocation();
    }
}

function confirmGeolocation() {
    const confirmPanel = document.getElementById('geo-confirm');
    const geoPopup = document.getElementById('geo-popup');
    const geoIcon = document.getElementById('geo-icon');

    // Hide confirmation panel immediately
    if (confirmPanel) {
        confirmPanel.classList.remove('opacity-100', 'translate-y-0');
        confirmPanel.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => confirmPanel.classList.add('hidden'), 300);
    }

    // Verificar suport de geolocalització
    if (!GeoService.isSupported()) {
        showToast('El teu navegador no suporta geolocalització', 'error', 'location_disabled');
        return;
    }

    // Activar l'API nativa de geolocalització del navegador
    // Això mostrarà el diàleg natiu del navegador per demanar permisos
    GeoService.requestPermission()
        .then((coords) => {
            // Permís concedit — ubicació obtinguda correctament
            geoActive = true;

            // Show workshop list
            if (geoPopup) {
                setTimeout(() => {
                    geoPopup.classList.remove('hidden');
                    setTimeout(() => {
                        geoPopup.classList.remove('opacity-0', 'translate-y-2');
                        geoPopup.classList.add('opacity-100', 'translate-y-0');
                    }, 10);
                }, 350);
            }

            // Update icon
            if (geoIcon) {
                geoIcon.classList.add('text-blue-600', 'animate-pulse');
            }

            // Afegir marcador de la ubicació de l'usuari al mapa principal
            const mainMap = getMapInstance('main-map');
            if (mainMap) {
                addUserLocationMarker(mainMap, coords.latitude, coords.longitude);
            }

            // Iniciar vigilància contínua de posició
            GeoService.startWatching();

            // Calcular i mostrar els 3 tallers més propers (passant la precisió per a l'avís)
            updateNearbyWorkshops(coords.latitude, coords.longitude, coords.accuracy);

            showToast(`Ubicació compartida (precisió: ${Math.round(coords.accuracy)}m)`, 'success', 'my_location');
        })
        .catch((error) => {
            // Permís denegat o error
            showToast(error.message, 'error', 'location_disabled');
        });
}

function cancelGeolocation() {
    const confirmPanel = document.getElementById('geo-confirm');
    if (!confirmPanel) return;

    confirmPanel.classList.remove('opacity-100', 'translate-y-0');
    confirmPanel.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => confirmPanel.classList.add('hidden'), 300);
}

function stopGeolocation() {
    const geoPopup = document.getElementById('geo-popup');
    const geoIcon = document.getElementById('geo-icon');

    geoActive = false;

    // Aturar la vigilància de geolocalització i netejar coordenades
    GeoService.stopWatching();

    // Eliminar marcador d'ubicació del mapa principal
    const mainMap = getMapInstance('main-map');
    if (mainMap && mainMap._userMarker) {
        mainMap.removeLayer(mainMap._userMarker);
        mainMap._userMarker = null;
    }

    // Hide workshop list
    if (geoPopup) {
        geoPopup.classList.remove('opacity-100', 'translate-y-0');
        geoPopup.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => geoPopup.classList.add('hidden'), 300);
    }

    // Reset icon
    if (geoIcon) {
        geoIcon.classList.remove('text-blue-600', 'animate-pulse');
    }

    showToast('Ubicació desactivada', 'warning', 'location_off');
}

/**
 * Comparteix el contingut de l'artesania actual usant la Web Share API nativa.
 * Si el navegador no suporta navigator.share (majoritàriament escriptori),
 * copia l'URL al portapapers com a alternativa.
 */
async function shareCraft() {
    if (!currentCraft) return;

    const craftName = currentCraft.nom;
    const craftDesc = currentCraft.descripcio || '';
    const shareUrl = `${window.location.origin}${window.location.pathname}#cataleg`;

    const shareData = {
        title: `${craftName} — Artesania Mallorquina`,
        text: `Descobreix l'artesania tradicional mallorquina: ${craftName}. ${craftDesc}`,
        url: shareUrl
    };

    // Intentar la Web Share API nativa (mòbil i alguns navegadors d'escriptori moderns)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
            showToast('Contingut compartit correctament', 'success', 'share');
        } catch (err) {
            // L'usuari ha cancel·lat o hi ha hagut un error
            if (err.name !== 'AbortError') {
                // Fallback al portapapers si falla
                await _copyToClipboard(shareUrl, craftName);
            }
        }
    } else if (navigator.share) {
        // navigator.share existeix però sense canShare (versions antigues)
        try {
            await navigator.share({ title: shareData.title, url: shareUrl });
            showToast('Contingut compartit correctament', 'success', 'share');
        } catch (err) {
            if (err.name !== 'AbortError') {
                await _copyToClipboard(shareUrl, craftName);
            }
        }
    } else {
        // Escriptori sense suport de Web Share API — copiar al portapapers
        await _copyToClipboard(shareUrl, craftName);
    }
}

/**
 * Copia l'URL al portapapers i mostra un toast de confirmació.
 */
async function _copyToClipboard(url, craftName) {
    try {
        await navigator.clipboard.writeText(url);
        showToast(`Enllaç de "${craftName}" copiat al portapapers`, 'success', 'content_copy');
    } catch (err) {
        // Últim recurs: selecció manual (navegadors molt antics)
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Enllaç copiat al portapapers`, 'info', 'content_copy');
    }
}

/**
 * Calcula la distància en km entre dos punts (fórmula de Haversine).
 */
function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Calcula les distàncies a tots els tallers, ordena per proximitat
 * i actualitza la llista mostrant només els 3 més propers.
 * @param {number} userLat - Latitud de l'usuari
 * @param {number} userLng - Longitud de l'usuari
 * @param {number} [accuracy] - Precisió GPS en metres (opcional)
 */
function updateNearbyWorkshops(userLat, userLng, accuracy) {
    const geoList = document.getElementById('geo-list');
    if (!geoList || !APP_DATA.tallers) return;

    // Mostrar estat "Calculant..."
    geoList.innerHTML = renderGeoCalculating();

    // Petit delay per donar feedback visual
    setTimeout(() => {
        // Filtrar tallers que tinguin coordenades i calcular distàncies
        const tallersAmbDist = APP_DATA.tallers
            .filter(t => t.lat != null && t.lng != null)
            .map(t => ({
                ...t,
                distanciaKm: haversineKm(userLat, userLng, t.lat, t.lng)
            }))
            .sort((a, b) => a.distanciaKm - b.distanciaKm)
            .slice(0, 3); // Només els 3 més propers

        let html = renderGeoNearby(tallersAmbDist);

        // Avís de baixa precisió GPS (habitual a l'ordinador, on s'usa IP en lloc de GPS)
        if (accuracy && accuracy > 5000) {
            html += `
            <div class="mt-2 flex items-start gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-2 py-1.5">
                <span class="material-symbols-outlined text-amber-500 text-[14px] mt-0.5 flex-shrink-0">info</span>
                <p class="text-[10px] text-amber-700 dark:text-amber-400 leading-tight">
                    Precisió GPS baixa (${Math.round(accuracy / 1000).toFixed(1)} km). Les distàncies poden ser aproximades. En mòbil la precisió és molt millor.
                </p>
            </div>`;
        }

        geoList.innerHTML = html;
    }, 600);
}

function toggleAIChat() {
    const chatPanel = document.getElementById('ai-chat-panel');
    if (!chatPanel) return;

    if (chatPanel.classList.contains('hidden')) {
        chatPanel.classList.remove('hidden');
        setTimeout(() => {
            chatPanel.classList.remove('opacity-0', 'translate-y-4');
            chatPanel.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    } else {
        chatPanel.classList.remove('opacity-100', 'translate-y-0');
        chatPanel.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
            chatPanel.classList.add('hidden');
        }, 300);
    }
}

// ══════════════════════════════════════════════════════════════
// CERCA I ORDENACIÓ DEL CATÀLEG
// ══════════════════════════════════════════════════════════════

let _searchDebounce = null;

/**
 * Cerca per text dins el catàleg. Filtra per nom, material, descripció i zona.
 * @param {string} query - Text de cerca
 */
function handleSearch(query) {
    catalogVisibleRows = 2; // Reseteja el nombre de files visibles en cercar
    applyFilters();
}

/**
 * Ordena les targetes del catàleg segons el criteri seleccionat.
 * @param {string} criteria - Clau d'ordenació
 */
function handleSort(criteria) {
    const catalogGrid = document.getElementById('catalog-grid');
    if (!catalogGrid) return;

    // Crear una còpia ordenada
    const sorted = [...APP_DATA.crafts];

    switch (criteria) {
        case 'az':
            sorted.sort((a, b) => a.nom.localeCompare(b.nom, 'ca'));
            break;
        case 'za':
            sorted.sort((a, b) => b.nom.localeCompare(a.nom, 'ca'));
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'comments':
            sorted.sort((a, b) => b.numComentaris - a.numComentaris);
            break;
        case 'workshops':
            sorted.sort((a, b) => b.numTallers - a.numTallers);
            break;
        case 'relevance':
            sorted.sort((a, b) => {
                const scoreB = b.rating * Math.log(b.numComentaris + 1);
                const scoreA = a.rating * Math.log(a.numComentaris + 1);
                return scoreB - scoreA;
            });
            break;
        default:
    }

    // Re-renderitzar les targetes amb el nou ordre
    catalogGrid.innerHTML = renderCatalogCards(sorted);

    // Activar observer de imatges per al fade-in de les targetes reordenades
    initImageObserver();

    // Re-aplicar la cerca o els filtres i la paginació
    const searchInput = document.getElementById('catalog-search');
    if (searchInput && searchInput.value.trim()) {
        handleSearch(searchInput.value.trim());
    } else {
        applyFilters();
    }

    const labels = { az: 'A-Z', za: 'Z-A', rating: 'Valoració', comments: 'Comentaris', workshops: 'Tallers', relevance: 'Rellevància' };
    showToast(`Ordenat per: ${labels[criteria] || criteria}`, 'info', 'sort');
}

// ══════════════════════════════════════════════════════════════
// FITXA DETALLADA: Interacció Mapa-Llista de Tallers
// ══════════════════════════════════════════════════════════════

function selectWorkshopDetail(id) {
    // Reset list items
    document.querySelectorAll('.workshop-item').forEach(item => {
        item.classList.remove('bg-terracotta-light', 'dark:bg-slate-800/80', 'border-terracotta', 'border-2', 'opacity-100');
        item.classList.add('bg-white', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'border', 'opacity-80');
        const title = item.querySelector('.ws-title');
        if (title) {
            title.classList.remove('text-terracotta');
            title.classList.add('text-slate-900', 'dark:text-slate-100');
        }
    });

    // Set active item
    const activeItem = document.getElementById('ws-' + id);
    if (activeItem) {
        activeItem.classList.remove('bg-white', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'border', 'opacity-80');
        activeItem.classList.add('bg-terracotta-light', 'dark:bg-slate-800/80', 'border-terracotta', 'border-2', 'opacity-100');
        const title = activeItem.querySelector('.ws-title');
        if (title) {
            title.classList.add('text-terracotta');
            title.classList.remove('text-slate-900', 'dark:text-slate-100');
        }
    }

    // Centrar el mapa Leaflet al taller seleccionat i obrir el seu popup
    const craftMap = getMapInstance('craft-map-container');
    if (craftMap && currentCraft) {
        const taller = currentCraft.tallers.find(t => t.id === id);
        if (taller && taller.lat && taller.lng) {
            craftMap.setView([taller.lat, taller.lng], 13, { animate: true });
            // Obrir popup del marcador corresponent
            craftMap.eachLayer(layer => {
                if (layer._tallerId === id && layer.openPopup) {
                    layer.openPopup();
                }
            });
        }
    }
}

// ══════════════════════════════════════════════════════════════
// DOMContentLoaded: Inicialitzar tot
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Inicialitzar la SPA
    init();
});

/**
 * Connecta els event listeners globals de l'aplicació un cop l'estructura HTML ha estat injectada al DOM.
 */
function attachGlobalListeners() {
    // Event listeners per tancar modals clicant fora
    const modal = document.getElementById('craft-modal');
    const weatherModal = document.getElementById('weather-modal');
    const galleryModal = document.getElementById('gallery-modal');
    const authModal = document.getElementById('auth-modal');

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    if (weatherModal) {
        weatherModal.addEventListener('click', (e) => {
            if (e.target === weatherModal) closeWeatherModal();
        });
    }
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) closeGalleryModal();
        });
    }
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeAuthModal();
        });
    }

    // Map filter buttons toggle (comarques + materials)
    document.querySelectorAll('#map-comarques button, #map-materials button').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.classList.contains('border-primary') || this.classList.contains('bg-primary/10')) {
                // Deactivate
                this.classList.remove('bg-primary/10', 'border-primary', 'text-primary', 'shadow-[0_0_15px_rgba(236,73,19,0.3)]');
                this.classList.add('bg-white', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
                const textSpan = Array.from(this.querySelectorAll('span')).find(s => !s.classList.contains('material-symbols-outlined'));
                if (textSpan) { textSpan.classList.remove('font-bold'); textSpan.classList.add('font-medium'); }
            } else {
                // Activate
                this.classList.remove('bg-white', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
                this.classList.add('bg-primary/10', 'border-primary', 'text-primary');
                // Add glow for comarca buttons (no icon)
                if (!this.querySelector('.material-symbols-outlined')) {
                    this.classList.add('shadow-[0_0_15px_rgba(236,73,19,0.3)]');
                }
                const textSpan = Array.from(this.querySelectorAll('span')).find(s => !s.classList.contains('material-symbols-outlined'));
                if (textSpan) { textSpan.classList.remove('font-medium'); textSpan.classList.add('font-bold'); }
            }
            applyMapFilters();
        });
    });

    // "Carregar més artesanies" — Incrementa de 2 en 2 files
    const loadMoreBtn = document.getElementById('load-more-crafts-btn');
    const showLessBtn = document.getElementById('show-less-crafts-btn');
    const MIN_CATALOG_ROWS = 2; // mínim: 2 files (= 4 cards en 2 col·les)

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            if (catalogVisibleRows * getCurrentGridCols() >= APP_DATA.crafts.length) {
                showToast("No hi ha més artesanies per carregar", 'warning', 'inventory_2');
            } else {
                catalogVisibleRows += 2;
                applyFilters();
                showToast("S'han carregat més artesanies", 'info', 'grid_view');
            }
        });
    }

    if (showLessBtn) {
        showLessBtn.addEventListener('click', () => {
            if (catalogVisibleRows > MIN_CATALOG_ROWS) {
                catalogVisibleRows = Math.max(MIN_CATALOG_ROWS, catalogVisibleRows - 2);
                applyFilters();
                // Fer scroll suau cap al principi del catàleg
                const catalogSection = document.getElementById('cataleg');
                if (catalogSection) {
                    catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                showToast("S'han amagat algunes artesanies", 'info', 'expand_less');
            }
        });
    }

    // Cerca per text amb debounce
    const searchInput = document.getElementById('catalog-search');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(_searchDebounce);
            _searchDebounce = setTimeout(() => {
                handleSearch(e.target.value.trim());
            }, 300);
        });
        searchInput.addEventListener('input', () => {
            clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
        });
    }

    // Ordenació dinàmica
    const sortSelect = document.getElementById('catalog-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            handleSort(e.target.value);
        });
    }

    // Botó netejar cerca
    const clearBtn = document.getElementById('clear-search-btn');
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        handleSearch('');
        clearBtn.style.display = 'none';
    });

    // Cerca per veu (Web Speech API)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceBtn = document.getElementById('voice-search-btn');

    if (voiceBtn && searchInput) {
        if (!SpeechRecognition) {
            voiceBtn.style.opacity = '0.5';
            voiceBtn.title = 'Cerca per veu no suportada en aquest navegador';
            voiceBtn.addEventListener('click', () => {
                showToast('La cerca per veu no és compatible amb aquest navegador', 'error', 'mic_off');
            });
        } else {
            const recognition = new SpeechRecognition();
            recognition.lang = 'ca-ES'; // Suport plenament en català!
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            let isListening = false;

            recognition.onstart = () => {
                isListening = true;
                voiceBtn.classList.add('text-primary', 'animate-pulse');
                const icon = voiceBtn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'settings_voice';
                showToast('Escoltant... Parla ara', 'info', 'mic');
            };

            recognition.onend = () => {
                isListening = false;
                voiceBtn.classList.remove('text-primary', 'animate-pulse');
                const icon = voiceBtn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'mic';
            };

            recognition.onerror = (e) => {
                console.error("Speech recognition error", e);
                if (e.error === 'not-allowed') {
                    showToast('Permís de micròfon denegat', 'error', 'mic_off');
                } else {
                    showToast('No s\'ha detectat cap veu o hi ha hagut un error', 'error', 'mic_off');
                }
            };

            recognition.onresult = (event) => {
                const rawTranscript = event.results[0][0].transcript;

                // Processament i correcció de transcripcions comunes incorrectes en català
                let transcript = rawTranscript.trim();

                const corrections = {
                    'clar': 'pla',
                    'raigué': 'raiguer',
                    'regué': 'raiguer',
                    'raider': 'raiguer',
                    'si horells': 'siurells',
                    'si horeix': 'siurells',
                    'ciurells': 'siurells',
                    's\'hi horeix': 'siurells',
                    's\'horeix': 'siurells',
                    'floreix': 'siurells',
                    'john': 'migjorn',
                    'és part': 'espart',
                    'es part': 'espart',
                    'despart': "d'espart",
                    'bufet': 'bufat',
                    'buffet': 'bufat',
                    'moradatge': 'modelatge',
                    'drenat': 'trenat',
                    'tronat': 'trenat',
                    'entrenat': 'trenat',
                    'yata': 'llata',
                    'llengos': 'llengües',
                    'dinca': 'd\'inca',
                    'pay': 'pell',
                    'reposteria': 'rebosteria',
                    'guinebets': 'ganivets',
                    'vinevats': 'ganivets',
                    'nevades': 'navalles',
                    'a ser': 'acer'
                };

                Object.keys(corrections).forEach(wrong => {
                    const right = corrections[wrong];
                    const escapedWrong = wrong.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    const regex = new RegExp(`\\b${escapedWrong}\\b`, 'gi');
                    transcript = transcript.replace(regex, right);
                });

                searchInput.value = transcript;
                handleSearch(transcript);
                if (clearBtn) {
                    clearBtn.style.display = transcript.length > 0 ? 'flex' : 'none';
                }
            };

            voiceBtn.addEventListener('click', () => {
                if (isListening) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
        }
    }
}

// ══════════════════════════════════════════════════════════════
// GROQ API INTEGRATION & LOCAL STORAGE
// ══════════════════════════════════════════════════════════════

function saveChatHistory() {
    try {
        const dataToSave = {
            timestamp: Date.now(),
            messages: APP_DATA.chatMessages.filter(m => !m.html || !m.html.includes('Error:')) // No guardem els errors
        };
        localStorage.setItem('artesania_chat_history', JSON.stringify(dataToSave));
    } catch (e) {
        console.warn("Could not save chat history to localStorage", e);
    }
}

function loadChatHistory() {
    try {
        const saved = localStorage.getItem('artesania_chat_history');
        if (saved) {
            const data = JSON.parse(saved);
            const ONE_HOUR = 15 * 60 * 1000; // 15 minuts
            if (Date.now() - data.timestamp < ONE_HOUR) {
                APP_DATA.chatMessages = data.messages;
            } else {
                localStorage.removeItem('artesania_chat_history');
            }
        }
    } catch (e) {
        console.warn("Could not load chat history from localStorage", e);
    }
}

async function handleChatSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    // Afegir missatge d'usuari
    APP_DATA.chatMessages.push({ role: 'user', text: text });
    saveChatHistory(); // Guardar historial amb el missatge de l'usuari
    const chatMessagesEl = document.getElementById('ai-chat-messages');
    chatMessagesEl.innerHTML = renderChatMessages(APP_DATA.chatMessages);
    input.value = '';

    // Auto-scroll al final
    setTimeout(() => chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight, 10);

    // Mostrar indicador de carregament
    const loadingId = 'loading-' + Date.now();
    chatMessagesEl.insertAdjacentHTML('beforeend', `
        <div id="${loadingId}" class="flex items-start gap-2 mt-2 mb-2 shrink-0">
            <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                <span class="material-symbols-outlined text-[16px] text-slate-600 dark:text-slate-400" style="font-variation-settings: 'FILL' 1">smart_toy</span>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm flex gap-1 items-center">
                <span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                <span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 0.1s"></span>
                <span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 0.2s"></span>
            </div>
        </div>
    `);
    setTimeout(() => chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight, 10);

    try {
        const token = APP_DATA.groqToken;
        if (!token || token === 'EL_TEU_TOKEN_AQUI') {
            throw new Error("Si us plau, configura el teu token de Groq (APP_DATA.groqToken) a js/data.js");
        }

        // Preparar històrial de conversa
        const messages = APP_DATA.chatMessages
            .filter(m => !m.html || !m.html.includes('Error:'))
            .map(m => {
                const role = m.role === 'assistant' ? 'assistant' : 'user';
                // Eliminació bàsica de HTML si no hi ha text
                const contentText = m.text || (m.html ? m.html.replace(/<[^>]+>/g, '').trim() : '');
                return { role: role, content: contentText };
            });

        // Afegir message del sistema
        messages.unshift({
            role: "system",
            content: `Ets l'assistent virtual del catàleg d'artesania de Mallorca. Respon sempre en català de forma concisa i amable i MOLT IMPORTANT només a preguntes directament relacionades amb artesania mallorquina, sense excepció ni analogies amb altres coses. Evita l'ús de taules i emojis, sí pots separar info en paràgrafs ben formats i formatejats, pots incloure llistes simples i tipats com negreta. Intenta accedir ${JSON.stringify(craftsRes)} i ${JSON.stringify(tallersRes)} per buscar informació, si trobes aquí no cerquis a Internet. Si no trobes informació, no inventis, pots intentar buscar a Internet.`
        });

        const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: messages
            })
        });

        const data = await response.json();

        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        if (!response.ok || data.error) {
            throw new Error((data.error && data.error.message) || "Error en l'API de Groq");
        }

        const replyText = data.choices[0].message.content;
        let formattedHtml = replyText.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        APP_DATA.chatMessages.push({ role: 'assistant', html: `<p class="text-sm text-slate-700 dark:text-slate-300">${formattedHtml}</p>`, text: replyText });
        saveChatHistory(); // Guardar historial amb la resposta de Groq
        chatMessagesEl.innerHTML = renderChatMessages(APP_DATA.chatMessages);
        setTimeout(() => chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight, 10);

    } catch (err) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        APP_DATA.chatMessages.push({ role: 'assistant', html: `<p class="text-sm text-red-600 dark:text-red-400"><strong>Error:</strong> ${err.message}</p>` });
        chatMessagesEl.innerHTML = renderChatMessages(APP_DATA.chatMessages);
        setTimeout(() => chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight, 10);
    }
}

// ══════════════════════════════════════════════════════════════
// RESSENYES & AUTENTICACIÓ
// ══════════════════════════════════════════════════════════════

let currentReviewRating = 0;
let currentReviewPhotos = [];
let currentReviewsLimit = 3;
let currentReviewSort = 'recents';

// Auxiliar per parsejar dates en català (ex: "12 d'octubre de 2023", "1 de juny de 2024")
function parseCatalanDate(dateStr) {
    if (!dateStr) return new Date(0);
    const str = dateStr.toLowerCase();

    // Exemple: "12 d'octubre de 2023", "21 de maig del 2026", "21 de maig 2026", etc.
    const parts = str.match(/(\d+)\s+(?:d'|de\s+)?([a-zç]+)(?:\s+(?:de|del)?\s+(\d+))?/);
    if (!parts) {
        const parsed = Date.parse(dateStr);
        return isNaN(parsed) ? new Date(0) : new Date(parsed);
    }

    const day = parseInt(parts[1], 10);
    const monthName = parts[2];
    const year = parts[3] ? parseInt(parts[3], 10) : new Date().getFullYear();

    const months = {
        'gener': 0, 'febrer': 1, 'març': 2, 'abril': 3, 'maig': 4, 'juny': 5,
        'juliol': 6, 'agost': 7, 'setembre': 8, 'octubre': 9, 'novembre': 10, 'desembre': 11
    };

    const month = months[monthName] !== undefined ? months[monthName] : 0;
    return new Date(year, month, day);
}

// Ordenar les ressenyes en memòria segons el tipus de filtre / ordenació triat
function sortReviews(craft, sortType) {
    if (!craft || !craft.ressenyes) return;

    craft.ressenyes.sort((a, b) => {
        if (sortType === 'recents') {
            return parseCatalanDate(b.data) - parseCatalanDate(a.data);
        } else if (sortType === 'antigues') {
            return parseCatalanDate(a.data) - parseCatalanDate(b.data);
        } else if (sortType === 'millor') {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            return parseCatalanDate(b.data) - parseCatalanDate(a.data);
        } else if (sortType === 'pitjor') {
            if (a.rating !== b.rating) {
                return a.rating - b.rating;
            }
            return parseCatalanDate(b.data) - parseCatalanDate(a.data);
        }
        return 0;
    });
}

// Canviar l'ordenació i actualitzar la llista del DOM
function handleReviewSortChange(sortType, craftId) {
    currentReviewSort = sortType;
    currentReviewsLimit = 3; // Reiniciar límit en canviar d'ordenació

    const craft = APP_DATA.crafts.find(c => c.id === craftId);
    if (!craft) return;

    sortReviews(craft, sortType);
    updateReviewsListUI(craft);
}

// Carregar més ressenyes incrementant el límit visible
function handleLoadMoreReviews(craftId) {
    const craft = APP_DATA.crafts.find(c => c.id === craftId);
    if (!craft) return;

    currentReviewsLimit += 3;
    updateReviewsListUI(craft);
}

// Actualitzar de manera eficient la subsecció de ressenyes sense refer tot el modal
function updateReviewsListUI(craft) {
    const container = document.getElementById('reviews-list-container');
    const loadMoreBtn = document.getElementById('load-more-reviews-btn');

    if (container) {
        container.innerHTML = renderReviewsList(craft.ressenyes.slice(0, currentReviewsLimit));
        initImageObserver();
    }

    if (loadMoreBtn) {
        if (craft.ressenyes.length <= currentReviewsLimit) {
            loadMoreBtn.classList.add('hidden');
        } else {
            loadMoreBtn.classList.remove('hidden');
        }
    }
}

function setReviewRating(rating) {
    currentReviewRating = rating;
    const starsContainer = document.getElementById('review-stars');
    if (!starsContainer) return;

    document.getElementById('review-rating').value = rating;

    const stars = starsContainer.querySelectorAll('span');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('text-yellow-400');
            star.style.fontVariationSettings = "'FILL' 1";
        } else {
            star.classList.remove('text-yellow-400');
            star.style.fontVariationSettings = "";
        }
    });
}

function handlePhotoUpload(input) {
    if (!input.files || input.files.length === 0) return;

    const previewContainer = document.getElementById('review-photos-preview');
    if (!previewContainer) return;

    // Màxim 3 fotos per no saturar el localStorage
    const files = Array.from(input.files).slice(0, 3 - currentReviewPhotos.length);

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Comprimir imatge amb Canvas perquè càpiga al localStorage
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Qualitat JPEG al 60%
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                currentReviewPhotos.push(dataUrl);

                // Mostrar preview
                const previewEl = document.createElement('div');
                previewEl.className = 'w-16 h-16 rounded-lg bg-cover bg-center border border-slate-200 dark:border-slate-700 shadow-sm';
                previewEl.style.backgroundImage = `url(${dataUrl})`;
                previewContainer.appendChild(previewEl);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    input.value = ''; // Reset per poder triar mateixos arxius si cal
}

function handleReviewSubmit(event, craftId) {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
        showToast("Has d'iniciar sessió per publicar una ressenya", 'warning', 'lock');
        openAuthModal();
        return;
    }

    const reviewKey = 'artesania_reviews_' + craftId;
    let savedReviews = [];
    const savedReviewsStr = localStorage.getItem(reviewKey);
    if (savedReviewsStr) {
        try { savedReviews = JSON.parse(savedReviewsStr); } catch (e) { }
    }

    // Check if this user already reviewed this craft
    const alreadyReviewed = savedReviews.some(r => r.email && r.email.toLowerCase() === user.email.toLowerCase());
    if (alreadyReviewed) {
        showToast("Ja has deixat una ressenya per aquesta artesania", 'warning', 'error');
        return;
    }

    if (currentReviewRating === 0) {
        showToast("Si us plau, selecciona una puntuació", 'warning', 'star');
        return;
    }

    const nameInput = document.getElementById('review-name').value;
    const commentInput = document.getElementById('review-comment').value;

    const newReview = {
        email: user.email,
        autor: nameInput,
        data: new Date().toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        rating: currentReviewRating,
        text: commentInput,
        imatges: currentReviewPhotos
    };

    savedReviews.unshift(newReview);

    // Save to local storage
    try {
        localStorage.setItem(reviewKey, JSON.stringify(savedReviews));
    } catch (e) {
        try {
            newReview.imatges = [];
            localStorage.setItem(reviewKey, JSON.stringify(savedReviews));
            showToast("Memòria plena: s'ha guardat sense imatges", 'warning', 'sd_card_alert');
        } catch (e2) {
            showToast("Error: no s'ha pogut guardar la ressenya (memòria plena)", 'error', 'sd_card_alert');
            return;
        }
    }

    // Update in-memory APP_DATA using the _originalRessenyes (JSON originals, never user-submitted)
    const craftIndex = APP_DATA.crafts.findIndex(c => c.id === craftId);
    if (craftIndex !== -1) {
        // Always read back from localStorage so all users' reviews are present
        let latestReviews = [];
        try {
            const latest = localStorage.getItem(reviewKey);
            if (latest) latestReviews = JSON.parse(latest);
        } catch (e) { latestReviews = savedReviews; }
        const originalRessenyes = APP_DATA.crafts[craftIndex]._originalRessenyes || [];
        APP_DATA.crafts[craftIndex].ressenyes = [...latestReviews, ...originalRessenyes];

        // Ordenar la llista actualitzada abans de tornar-la a renderitzar
        sortReviews(APP_DATA.crafts[craftIndex], currentReviewSort);
    }

    // Refresh modal to show new review
    const modalBody = document.getElementById('craft-modal-body');
    if (modalBody && APP_DATA.crafts[craftIndex]) {
        modalBody.innerHTML = renderCraftDetail(APP_DATA.crafts[craftIndex]);
        checkReviewStatus(craftId);

        // Reinjectar galeries d'art i activar observer
        if (APP_DATA.artGalleries && APP_DATA.artGalleries.length > 0) {
            modalBody.querySelector('.p-8')?.insertAdjacentHTML(
                'beforeend',
                renderArtGalleries(APP_DATA.artGalleries)
            );
        }
        initImageObserver();
    }

    showToast("Ressenya publicada amb èxit!", 'success', 'check_circle');
}

function checkReviewStatus(craftId) {
    const formContainer = document.getElementById('review-form-container');
    if (!formContainer) return;

    const user = getCurrentUser();
    if (!user) return; // template renders invitation card

    const reviewKey = 'artesania_reviews_' + craftId;
    let savedReviews = [];
    const savedReviewsStr = localStorage.getItem(reviewKey);
    if (savedReviewsStr) {
        try { savedReviews = JSON.parse(savedReviewsStr); } catch (e) { }
    }

    const userReview = savedReviews.find(r => r.email && r.email.toLowerCase() === user.email.toLowerCase());
    if (userReview) {
        formContainer.innerHTML = `
            <div class="bg-terracotta-light/30 dark:bg-terracotta/10 border border-terracotta/20 rounded-lg p-6 text-center shadow-sm">
                <span class="material-symbols-outlined text-terracotta text-5xl mb-3">verified</span>
                <h5 class="font-display font-bold text-xl text-slate-800 dark:text-slate-200">Gràcies per la teva ressenya!</h5>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">Ja has compartit la teva experiència per a aquesta artesania. La teva opinió ajuda a mantenir vius aquests oficis.</p>
            </div>
        `;
    } else {
        currentReviewRating = 0;
        currentReviewPhotos = [];
    }
}

// ── Gestió de Sessió i Comptes ────────────────────────────────
function getCurrentUser() {
    try {
        const stored = localStorage.getItem('artesania_current_user');
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

function registerUser(email, nickname, password) {
    let users = [];
    try {
        const stored = localStorage.getItem('artesania_registered_users');
        users = stored ? JSON.parse(stored) : [];
    } catch (e) { }

    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
        return { success: false, message: "Aquest correu ja està registrat." };
    }

    const newUser = { email: email.toLowerCase(), nickname, password };
    users.push(newUser);
    localStorage.setItem('artesania_registered_users', JSON.stringify(users));
    localStorage.setItem('artesania_current_user', JSON.stringify(newUser));
    return { success: true };
}

function loginUser(email, password) {
    let users = [];
    try {
        const stored = localStorage.getItem('artesania_registered_users');
        users = stored ? JSON.parse(stored) : [];
    } catch (e) { }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
        return { success: false, message: "Correu o contrasenya incorrectes." };
    }

    localStorage.setItem('artesania_current_user', JSON.stringify(user));
    return { success: true };
}

/**
 * Sincronitza les ressenyes de tots els crafts en memòria (APP_DATA.crafts)
 * amb el localStorage. Això garanteix que en canviar de compte no es perdin
 * ressenyes publicades per altres usuaris durant la mateixa sessió.
 */
function refreshCraftsReviews() {
    if (!APP_DATA.crafts) return;
    APP_DATA.crafts.forEach(craft => {
        const reviewKey = 'artesania_reviews_' + craft.id;
        let savedReviews = [];
        try {
            const str = localStorage.getItem(reviewKey);
            if (str) savedReviews = JSON.parse(str);
        } catch (e) { }

        // Suportar també les ressenyes de la versió anterior (retrocompatibilitat)
        const legacyReviewStr = localStorage.getItem('reviewed_' + craft.id);
        if (legacyReviewStr) {
            try {
                const legacyReview = JSON.parse(legacyReviewStr);
                if (!savedReviews.some(r => r.autor === legacyReview.autor && r.text === legacyReview.text)) {
                    savedReviews.push(legacyReview);
                }
            } catch (e) { }
        }

        const originals = craft._originalRessenyes || [];
        craft.ressenyes = [...savedReviews, ...originals];
    });
}

function logoutUser() {
    const activeCraftId = currentCraft ? currentCraft.id : null;

    localStorage.removeItem('artesania_current_user');
    showToast("Sessió tancada correctament", 'warning', 'logout');

    // Sincronitzar les ressenyes en memòria amb el localStorage abans de re-renderitzar
    refreshCraftsReviews();

    // Re-renderitzar per netejar la interfície i favorits de la UI actual
    renderApp();
    populateDynamicContent();
    attachFilterListeners();
    attachFavoritesToggle();
    attachGlobalListeners();
    applyFilters();
    initMainMap();
    initImageObserver();

    if (activeCraftId) {
        openModal(activeCraftId);
    }
}

// ── Modals d'Autenticació UI ──────────────────────────────────
function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    const content = document.getElementById('auth-modal-content');
    if (!modal) return;

    switchAuthTab('login');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
    }, 10);
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    const content = document.getElementById('auth-modal-content');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}

function switchAuthTab(tab) {
    const loginTab = document.getElementById('tab-btn-login');
    const registerTab = document.getElementById('tab-btn-register');
    const loginForm = document.getElementById('auth-form-login');
    const registerForm = document.getElementById('auth-form-register');

    if (!loginTab || !registerTab || !loginForm || !registerForm) return;

    if (tab === 'login') {
        loginTab.classList.add('border-b-2', 'border-primary', 'text-primary');
        loginTab.classList.remove('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'dark:text-slate-400', 'dark:hover:text-slate-350');

        registerTab.classList.remove('border-b-2', 'border-primary', 'text-primary');
        registerTab.classList.add('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'dark:text-slate-400', 'dark:hover:text-slate-350');
        registerTab.classList.remove('font-bold');
        registerTab.classList.add('font-semibold');

        loginTab.classList.add('font-bold');
        loginTab.classList.remove('font-semibold');

        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        registerTab.classList.add('border-b-2', 'border-primary', 'text-primary');
        registerTab.classList.remove('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'dark:text-slate-400', 'dark:hover:text-slate-350');

        loginTab.classList.remove('border-b-2', 'border-primary', 'text-primary');
        loginTab.classList.add('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'dark:text-slate-400', 'dark:hover:text-slate-350');
        loginTab.classList.remove('font-bold');
        loginTab.classList.add('font-semibold');

        registerTab.classList.add('font-bold');
        registerTab.classList.remove('font-semibold');

        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }

    // Clear error messages
    const loginError = document.getElementById('login-error-msg');
    const registerError = document.getElementById('register-error-msg');
    if (loginError) loginError.classList.add('hidden');
    if (registerError) registerError.classList.add('hidden');
}

function handleAuthLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error-msg');

    const res = loginUser(email, password);
    if (res.success) {
        const nickname = getCurrentUser().nickname;
        showToast(`Benvingut de nou, ${nickname}!`, 'success', 'sentiment_very_satisfied');
        closeAuthModal();

        const activeCraftId = currentCraft ? currentCraft.id : null;

        // Sincronitzar les ressenyes en memòria amb el localStorage
        refreshCraftsReviews();

        // Re-renderitzar
        renderApp();
        populateDynamicContent();
        attachFilterListeners();
        attachFavoritesToggle();
        attachGlobalListeners();
        applyFilters();
        initMainMap();
        initImageObserver();

        if (activeCraftId) {
            openModal(activeCraftId);
        }
    } else {
        if (errorMsg) {
            errorMsg.textContent = res.message;
            errorMsg.classList.remove('hidden');
        }
    }
}

function handleAuthRegister(event) {
    event.preventDefault();
    const nickname = document.getElementById('register-nick').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorMsg = document.getElementById('register-error-msg');

    const res = registerUser(email, nickname, password);
    if (res.success) {
        showToast(`Compte creat! Benvingut, ${nickname}!`, 'success', 'how_to_reg');
        closeAuthModal();

        const activeCraftId = currentCraft ? currentCraft.id : null;

        // Sincronitzar les ressenyes en memòria amb el localStorage
        refreshCraftsReviews();

        // Re-renderitzar
        renderApp();
        populateDynamicContent();
        attachFilterListeners();
        attachFavoritesToggle();
        attachGlobalListeners();
        applyFilters();
        initMainMap();
        initImageObserver();

        if (activeCraftId) {
            openModal(activeCraftId);
        }
    } else {
        if (errorMsg) {
            errorMsg.textContent = res.message;
            errorMsg.classList.remove('hidden');
        }
    }
}

// ══════════════════════════════════════════════════════════════
// MULTIMÈDIA — Àudio Descripció (Arxius Locals MP3)
// ══════════════════════════════════════════════════════════════

/**
 * Activa o atura la reproducció de l'àudio descriptiu des de la carpeta media/audio.
 * @param {HTMLElement} btn - El botó que ha disparat l'esdeveniment
 */
function toggleSpeakDescription(btn) {
    if (!currentCraft || !currentCraft.id) return;

    // Si ja està reproduint, el pausem i restablim el botó
    if (currentDescriptionAudio && !currentDescriptionAudio.paused) {
        currentDescriptionAudio.pause();
        currentDescriptionAudio = null;
        resetSpeakButton(btn);
        return;
    }

    const audioPath = `./media/audio/${currentCraft.id}_desc.mp3`;
    currentDescriptionAudio = new Audio(audioPath);

    // Actualització visual del botó en començar a reproduir
    currentDescriptionAudio.onplay = () => {
        btn.innerHTML = `<span class="material-symbols-outlined animate-pulse">volume_off</span> Aturar lectura`;
        btn.classList.remove('bg-terracotta', 'hover:bg-terracotta/90');
        btn.classList.add('bg-red-600', 'hover:bg-red-700');
    };

    const handleEnd = () => {
        resetSpeakButton(btn);
        currentDescriptionAudio = null;
    };

    currentDescriptionAudio.onended = handleEnd;

    currentDescriptionAudio.onerror = () => {
        showToast("No s'ha pogut carregar l'arxiu d'àudio descripció.", "warning", "volume_off");
        resetSpeakButton(btn);
        currentDescriptionAudio = null;
    };

    currentDescriptionAudio.play().catch(err => {
        console.error("Error reproduint l'àudio:", err);
        showToast("Error en iniciar la reproducció de l'àudio.", "warning", "volume_off");
        resetSpeakButton(btn);
        currentDescriptionAudio = null;
    });
}

/**
 * Restableix l'estat visual original del botó de reproducció.
 * @param {HTMLElement} btn - El botó a restablir
 */
function resetSpeakButton(btn) {
    if (!btn) return;
    btn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Escoltar descripció`;
    btn.classList.remove('bg-red-600', 'hover:bg-red-700');
    btn.classList.add('bg-terracotta', 'hover:bg-terracotta/90');
}
