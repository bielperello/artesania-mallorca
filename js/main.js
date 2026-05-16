// main.js — Orquestrador de l'SPA d'Artesania Mallorquina

// ── Variables globals ────────────────────────────────────────
let currentCraft = null;
let toastTimeout = null;
let _weatherTallerId = null;

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
        const [craftsRes, tallersRes] = await Promise.all([
            fetch('./data/tipus_artesania.json'),
            fetch('./data/tallers_i_mestres.json')
        ]);
        
        if (!craftsRes.ok || !tallersRes.ok) {
            throw new Error('No s\'han pogut carregar els fitxers JSON (CORS/File protocol error)');
        }
        
        const craftsData = await craftsRes.json();
        const { tallers, mestres } = await tallersRes.json();

        // Reconstruir l'estructura original per a les plantilles UI
        APP_DATA.crafts = craftsData.map(craft => {
            const savedReviewStr = localStorage.getItem('reviewed_' + craft.id);
            let savedReviews = [];
            if (savedReviewStr) {
                try { savedReviews.push(JSON.parse(savedReviewStr)); } catch(e){}
            }
            return {
                ...craft,
                ressenyes: [...savedReviews, ...(craft.ressenyes || [])],
                tallers: (craft.tallers_ids || []).map(id => tallers.find(t => t.id === id)).filter(Boolean),
                artesans: (craft.artesans_ids || []).map(id => mestres.find(m => m.id === id)).filter(Boolean)
            };
        });
        
        APP_DATA.tallers = tallers;
        APP_DATA.mestres = mestres;
    } catch(err) {
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

    // 4. Inicialitzar el mapa principal amb Leaflet
    initMainMap();
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

    // Mapa principal — filtres de comarca i material
    const mapComarquesEl = document.getElementById('map-comarques');
    const mapMaterialsEl = document.getElementById('map-materials');
    if (mapComarquesEl) mapComarquesEl.innerHTML = renderMapComarques(APP_DATA.mapComarques);
    if (mapMaterialsEl) mapMaterialsEl.innerHTML = renderMapMaterials(APP_DATA.mapMaterials);

    // Geolocalització
    const geoList = document.getElementById('geo-list');
    if (geoList) geoList.innerHTML = renderGeoNearby(APP_DATA.geoNearby);

    // Multimèdia
    const multimediaGrid = document.getElementById('multimedia-grid');
    if (multimediaGrid) multimediaGrid.innerHTML = renderMultimediaGrid(APP_DATA.multimedia);

    // Xat IA
    loadChatHistory();
    const chatMessages = document.getElementById('ai-chat-messages');
    if (chatMessages) chatMessages.innerHTML = renderChatMessages(APP_DATA.chatMessages);

    // Weather modal — pre-render amb dades placeholder (seran substituïdes per dades reals)
    const weatherBody = document.getElementById('weather-modal-body');
    const weatherTitle = document.getElementById('weather-title');
    if (weatherBody) weatherBody.innerHTML = renderWeatherModal(APP_DATA.weather);
    if (weatherTitle) weatherTitle.innerHTML = `Previsió Meteorològica - <span class="text-terracotta">${APP_DATA.weather.lloc}</span>`;
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
        resetBtn.addEventListener('click', () => resetMapView('main-map'));
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
    const map = { 'Fang': 'fang', 'Vidre': 'vidre', 'Llana': 'llana', 'Espart': 'espart', 'Fusta': 'fusta', 'Ceràmica': 'ceramica', 'Pedra': 'pedra', 'Palma': 'palma' };
    return map[materialName] || materialName.toLowerCase();
}

function applyFilters() {
    const { zones, techniques, materials } = getActiveFilters();
    const cards = document.querySelectorAll('#catalog-grid > div');
    let visibleCount = 0;

    APP_DATA.crafts.forEach((craft, i) => {
        const card = cards[i];
        if (!card) return;

        let visible = true;

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

        if (visible) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show toast with filter result
    if (zones.length > 0 || techniques.length > 0 || materials.length > 0) {
        showToast(`${visibleCount} artesani${visibleCount === 1 ? 'a' : 'es'} trobad${visibleCount === 1 ? 'a' : 'es'}`, 'info', 'filter_list');
    }
}

// ══════════════════════════════════════════════════════════════
// MODALS: Obrir / Tancar
// ══════════════════════════════════════════════════════════════

function openModal(craftId) {
    const craft = APP_DATA.crafts.find(c => c.id === craftId);
    if (!craft) return;

    currentCraft = craft;

    // Poblar el cos del modal
    const body = document.getElementById('craft-modal-body');
    if (body) {
        body.innerHTML = renderCraftDetail(craft);
        checkReviewStatus(craft.id);
    }

    // Poblar galeria modal
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) galleryGrid.innerHTML = renderGalleryImages(craft);

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
    const modal = document.getElementById('craft-modal');
    const modalContent = document.getElementById('craft-modal-content');
    if (!modal || !modalContent) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
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
        weatherBody.innerHTML = renderWeatherModal(APP_DATA.weather);
        if (weatherTitle) {
            weatherTitle.innerHTML = `Previsió Meteorològica - <span class="text-terracotta">${APP_DATA.weather.lloc}</span>`;
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
}

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    const content = document.getElementById('gallery-content');
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

// ══════════════════════════════════════════════════════════════
// INTERACCIÓ: Favorits amb Toast
// ══════════════════════════════════════════════════════════════

function toggleFavoriteCard(btn, event) {
    if (event) event.stopPropagation();
    const icon = btn.querySelector('.material-symbols-outlined');
    const card = btn.closest('[data-craft-id]') || btn.closest('.group');

    // Find the craft name from card
    const nameEl = card ? card.querySelector('h3') : null;
    const craftName = nameEl ? nameEl.textContent : 'Artesania';

    if (icon.classList.contains('fill-current') && icon.classList.contains('text-red-500')) {
        icon.classList.remove('fill-current', 'text-red-500');
        btn.classList.remove('text-red-500');
        btn.classList.add('text-slate-400');
        showToast(`${craftName} s'ha eliminat de favorits`, 'warning', 'heart_broken');
    } else {
        icon.classList.add('fill-current', 'text-red-500');
        btn.classList.remove('text-slate-400');
        btn.classList.add('text-red-500');
        showToast(`${craftName} afegit a favorits`, 'favorite', 'favorite');
    }
}

function toggleModalFavorite(btn) {
    const icon = btn.querySelector('.material-symbols-outlined');
    if (!icon) return;

    const craftName = currentCraft ? currentCraft.nom : 'Artesania';
    const isActive = btn.classList.contains('is-favorite');

    if (isActive) {
        btn.classList.remove('is-favorite', 'text-red-500', 'bg-red-50');
        btn.classList.add('text-slate-400', 'bg-slate-100');
        icon.style.fontVariationSettings = '';
        showToast(`${craftName} s'ha eliminat de favorits`, 'warning', 'heart_broken');
    } else {
        btn.classList.add('is-favorite', 'text-red-500', 'bg-red-50');
        btn.classList.remove('text-slate-400', 'bg-slate-100');
        icon.style.fontVariationSettings = "'FILL' 1";
        showToast(`${craftName} afegit a favorits`, 'favorite', 'favorite');
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
    const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const catalogGrid = document.getElementById('catalog-grid');
    if (!catalogGrid) return;

    // Mapa de zones id → nom complet per cercar-hi
    const zoneNames = {};
    APP_DATA.filterZones.forEach(z => { zoneNames[z.id] = z.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); });

    let visibleCount = 0;
    const cards = catalogGrid.children;

    APP_DATA.crafts.forEach((craft, i) => {
        const card = cards[i];
        if (!card) return;

        if (!normalizedQuery) {
            card.style.display = '';
            visibleCount++;
            return;
        }

        const searchFields = [
            craft.nom,
            craft.material,
            craft.descripcio,
            craft.descripcioLlarga,
            craft.tecnica,
            zoneNames[craft.zona] || '',
            ...craft.tallers.map(t => t.nom),
            ...craft.artesans.map(a => a.nom)
        ].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (searchFields.includes(normalizedQuery)) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (normalizedQuery) {
        showToast(`${visibleCount} resultat${visibleCount !== 1 ? 's' : ''} per "${query}"`, 'info', 'search');
    }
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
        default:
            // Ordre original (per rating desc com a rellevància per defecte)
            sorted.sort((a, b) => b.rating - a.rating);
            break;
    }

    // Re-renderitzar les targetes amb el nou ordre
    catalogGrid.innerHTML = renderCatalogCards(sorted);

    // Re-aplicar la cerca si hi ha text
    const searchInput = document.getElementById('catalog-search');
    if (searchInput && searchInput.value.trim()) {
        handleSearch(searchInput.value.trim());
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

    // Event listeners per tancar modals clicant fora
    const modal = document.getElementById('craft-modal');
    const weatherModal = document.getElementById('weather-modal');
    const galleryModal = document.getElementById('gallery-modal');

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
        });
    });

    // "Carregar més artesanies" — placeholder toast
    const loadMoreBtn = document.querySelector('#cataleg .flex.justify-center button');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            showToast('No hi ha més artesanies per carregar per ara', 'info', 'inventory_2');
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
    }

    // Ordenació dinàmica
    const sortSelect = document.getElementById('catalog-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            handleSort(e.target.value);
        });
    }
});

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
            content: "Ets l'assistent virtual del catàleg d'artesania de Mallorca. Respon sempre en català de forma concisa i amable i MOLT IMPORTANT només a preguntes directament relacionades amb artesania mallorquina, sense excepció ni analogies amb altres coses. Evita l'ús de taules i emojis, sí pots separar info en paràgrafs ben formats i formatejats."
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
// RESSENYES
// ══════════════════════════════════════════════════════════════

let currentReviewRating = 0;
let currentReviewPhotos = [];

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
        reader.onload = function(e) {
            // Comprimir imatge amb Canvas perquè càpiga al localStorage
            const img = new Image();
            img.onload = function() {
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
    
    if (localStorage.getItem('reviewed_' + craftId)) {
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
        autor: nameInput,
        data: new Date().toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        rating: currentReviewRating,
        text: commentInput,
        imatges: currentReviewPhotos
    };
    
    // Add to current APP_DATA
    const craftIndex = APP_DATA.crafts.findIndex(c => c.id === craftId);
    if (craftIndex !== -1) {
        APP_DATA.crafts[craftIndex].ressenyes.unshift(newReview);
    }
    
    // Save to local storage to persist state for this user
    try {
        localStorage.setItem('reviewed_' + craftId, JSON.stringify(newReview));
    } catch (e) {
        // En cas que les imatges encara siguin massa grans
        newReview.imatges = [];
        localStorage.setItem('reviewed_' + craftId, JSON.stringify(newReview));
        showToast("Memòria plena: s'ha guardat sense imatges", 'warning', 'sd_card_alert');
    }
    
    // Refresh modal to show new review
    const modalBody = document.getElementById('craft-modal-body');
    if (modalBody && APP_DATA.crafts[craftIndex]) {
        modalBody.innerHTML = renderCraftDetail(APP_DATA.crafts[craftIndex]);
        checkReviewStatus(craftId);
    }
    
    showToast("Ressenya publicada amb èxit!", 'success', 'check_circle');
}

function checkReviewStatus(craftId) {
    const formContainer = document.getElementById('review-form-container');
    if (!formContainer) return;
    
    const savedReviewStr = localStorage.getItem('reviewed_' + craftId);
    if (savedReviewStr) {
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
