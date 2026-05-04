// map.js — Mòdul reutilitzable per a mapes Leaflet + OpenStreetMap
// Gestiona la inicialització i configuració de tots els mapes de l'SPA

// ══════════════════════════════════════════════════════════════
// CONFIGURACIÓ PER DEFECTE — Centrat a l'illa de Mallorca
// ══════════════════════════════════════════════════════════════

const MAP_CONFIG = {
    /** Centre geogràfic aproximat de Mallorca */
    CENTER: [39.6, 2.7],

    /** Zoom per defecte que mostra tota l'illa */
    ZOOM: 10,

    /** Zoom mínim permès (per no perdre l'illa de vista) */
    MIN_ZOOM: 9,

    /** Zoom màxim permès (nivell de carrer) */
    MAX_ZOOM: 18,

    /** URL de les tiles d'OpenStreetMap */
    TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    /** Atribució requerida per OpenStreetMap */
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};


// ══════════════════════════════════════════════════════════════
// REGISTRE DE MAPES — Per gestionar múltiples instàncies
// ══════════════════════════════════════════════════════════════

/** Emmagatzema totes les instàncies de mapes creades, indexades per containerId */
const _mapInstances = {};


// ══════════════════════════════════════════════════════════════
// FUNCIÓ PRINCIPAL — Inicialitzar un mapa Leaflet reutilitzable
// ══════════════════════════════════════════════════════════════

/**
 * Inicialitza un mapa Leaflet dins un contenidor HTML.
 * Si el contenidor ja té un mapa, el destrueix primer per evitar errors.
 *
 * @param {string} containerId - ID de l'element HTML on renderitzar el mapa
 * @param {Object} [options={}] - Opcions de configuració
 * @param {number[]} [options.center] - Coordenades [lat, lng] del centre
 * @param {number} [options.zoom] - Nivell de zoom inicial
 * @param {number} [options.minZoom] - Zoom mínim permès
 * @param {number} [options.maxZoom] - Zoom màxim permès
 * @param {boolean} [options.scrollWheelZoom=true] - Permetre zoom amb roda del ratolí
 * @param {boolean} [options.dragging=true] - Permetre arrossegar el mapa
 * @param {Array} [options.markers] - Array de marcadors a afegir
 * @returns {L.Map|null} La instància del mapa o null si falla
 */
function initLeafletMap(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`[Map] Contenidor #${containerId} no trobat.`);
        return null;
    }

    // Si ja existeix un mapa en aquest contenidor, destruir-lo primer
    destroyMap(containerId);

    // Fusionar opcions amb valors per defecte
    const config = {
        center: options.center || MAP_CONFIG.CENTER,
        zoom: options.zoom || MAP_CONFIG.ZOOM,
        minZoom: options.minZoom !== undefined ? options.minZoom : MAP_CONFIG.MIN_ZOOM,
        maxZoom: options.maxZoom || MAP_CONFIG.MAX_ZOOM,
        scrollWheelZoom: options.scrollWheelZoom !== undefined ? options.scrollWheelZoom : true,
        dragging: options.dragging !== undefined ? options.dragging : true,
        zoomControl: options.zoomControl !== undefined ? options.zoomControl : false
    };

    // Crear la instància del mapa
    const map = L.map(containerId, {
        center: config.center,
        zoom: config.zoom,
        minZoom: config.minZoom,
        maxZoom: config.maxZoom,
        scrollWheelZoom: config.scrollWheelZoom,
        dragging: config.dragging,
        zoomControl: config.zoomControl
    });

    L.control.zoom({ position: 'topright', 
        zoomInTitle: 'Apropar',
        zoomOutTitle: 'Allunyar'
    }).addTo(map);
    

    // Afegir la capa de tiles d'OpenStreetMap
    L.tileLayer(MAP_CONFIG.TILE_URL, {
        attribution: MAP_CONFIG.ATTRIBUTION,
        maxZoom: config.maxZoom
    }).addTo(map);

    // Registrar la instància
    _mapInstances[containerId] = map;

    // Afegir marcadors si se n'han proporcionat
    if (options.markers && Array.isArray(options.markers)) {
        options.markers.forEach(markerData => {
            addWorkshopMarker(map, markerData);
        });
    }

    return map;
}


// ══════════════════════════════════════════════════════════════
// MARCADORS — Afegir i gestionar marcadors al mapa
// ══════════════════════════════════════════════════════════════

/**
 * Afegeix un marcador de taller al mapa amb un popup personalitzat.
 *
 * @param {L.Map} map - Instància del mapa Leaflet
 * @param {Object} data - Dades del marcador
 * @param {number} data.lat - Latitud del taller
 * @param {number} data.lng - Longitud del taller
 * @param {string} data.nom - Nom del taller
 * @param {string} [data.adreca] - Adreça del taller
 * @param {string} [data.telefon] - Telèfon de contacte
 * @param {string} [data.material] - Tipus de material/artesania
 * @param {string} [data.color='#ec4913'] - Color del marcador
 * @returns {L.Marker} El marcador creat
 */
function addWorkshopMarker(map, data) {
    if (!map || !data.lat || !data.lng) return null;

    // Crear icona personalitzada amb el color del taller
    const markerColor = data.color || '#ec4913';
    const markerIcon = L.divIcon({
        className: 'leaflet-workshop-marker',
        html: `
            <div class="workshop-pin" style="--marker-color: ${markerColor}">
                <span class="material-symbols-outlined">location_on</span>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });

    // Crear el marcador
    const marker = L.marker([data.lat, data.lng], { icon: markerIcon }).addTo(map);

    // Crear popup amb la informació del taller
    if (data.nom) {
        const popupContent = _buildPopupContent(data);
        marker.bindPopup(popupContent, {
            maxWidth: 260,
            className: 'workshop-popup'
        });
    }

    return marker;
}


/**
 * Afegeix un marcador especial per a la ubicació de l'usuari.
 *
 * @param {L.Map} map - Instància del mapa Leaflet
 * @param {number} lat - Latitud de l'usuari
 * @param {number} lng - Longitud de l'usuari
 * @returns {L.Marker} El marcador de l'usuari
 */
function addUserLocationMarker(map, lat, lng) {
    if (!map) return null;

    // Eliminar marcador anterior si existeix
    if (map._userMarker) {
        map.removeLayer(map._userMarker);
    }

    const userIcon = L.divIcon({
        className: 'leaflet-user-marker',
        html: `
            <div class="user-location-pin">
                <div class="user-location-pulse"></div>
                <div class="user-location-dot"></div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    const marker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    marker.bindPopup('<strong>La teva ubicació</strong>', {
        className: 'user-popup'
    });

    map._userMarker = marker;
    return marker;
}


// ══════════════════════════════════════════════════════════════
// GESTIÓ D'INSTÀNCIES — Obtenir, destruir, restablir mapes
// ══════════════════════════════════════════════════════════════

/**
 * Obté una instància de mapa pel seu containerId.
 * @param {string} containerId
 * @returns {L.Map|null}
 */
function getMapInstance(containerId) {
    return _mapInstances[containerId] || null;
}

/**
 * Destrueix un mapa i allibera els seus recursos.
 * @param {string} containerId
 */
function destroyMap(containerId) {
    if (_mapInstances[containerId]) {
        _mapInstances[containerId].remove();
        delete _mapInstances[containerId];
    }
}

/**
 * Restableix la vista d'un mapa al centre i zoom per defecte.
 * @param {string} containerId
 */
function resetMapView(containerId) {
    const map = _mapInstances[containerId];
    if (map) {
        map.setView(MAP_CONFIG.CENTER, MAP_CONFIG.ZOOM, { animate: true });
    }
}

/**
 * Invalida la mida d'un mapa (necessari quan el contenidor canvia de mida,
 * per exemple quan es mostra un modal).
 * @param {string} containerId
 */
function invalidateMapSize(containerId) {
    const map = _mapInstances[containerId];
    if (map) {
        setTimeout(() => map.invalidateSize(), 100);
    }
}


// ══════════════════════════════════════════════════════════════
// UTILITATS PRIVADES
// ══════════════════════════════════════════════════════════════

/**
 * Construeix el contingut HTML del popup d'un marcador de taller.
 * @param {Object} data - Dades del taller
 * @returns {string} HTML del popup
 */
function _buildPopupContent(data) {
    let html = `<div class="popup-workshop-content">`;
    html += `<h4 class="popup-title">${data.nom}</h4>`;

    if (data.material) {
        html += `<span class="popup-badge">${data.material}</span>`;
    }
    if (data.adreca) {
        html += `<p class="popup-address"><span class="material-symbols-outlined popup-icon">location_on</span>${data.adreca}</p>`;
    }
    if (data.telefon) {
        html += `<p class="popup-phone"><span class="material-symbols-outlined popup-icon">phone</span>${data.telefon}</p>`;
    }
    if (data.mapsQuery) {
        html += `<a class="popup-directions" href="https://maps.google.com/?q=${data.mapsQuery}" target="_blank" rel="noopener noreferrer">
            <span class="material-symbols-outlined popup-icon">directions</span>Com arribar-hi
        </a>`;
    }

    html += `</div>`;
    return html;
}
