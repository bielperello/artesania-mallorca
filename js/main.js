// main.js — Orquestrador de l'SPA d'Artesania Mallorquina

// ── Variable global per a l'artesania activa ─────────────────
let currentCraft = null;
let toastTimeout = null;

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
// INICIALITZACIÓ: Poblar tots els contenidors amb dades
// ══════════════════════════════════════════════════════════════

function init() {
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

    // Mapa principal
    const mapComarquesEl = document.getElementById('map-comarques');
    const mapMaterialsEl = document.getElementById('map-materials');
    const mapMarkersEl = document.getElementById('map-markers');
    if (mapComarquesEl) mapComarquesEl.innerHTML = renderMapComarques(APP_DATA.mapComarques);
    if (mapMaterialsEl) mapMaterialsEl.innerHTML = renderMapMaterials(APP_DATA.mapMaterials);
    if (mapMarkersEl) mapMarkersEl.innerHTML = renderMapMarkers(APP_DATA.mapMarkers);

    // Geolocalització
    const geoList = document.getElementById('geo-list');
    if (geoList) geoList.innerHTML = renderGeoNearby(APP_DATA.geoNearby);

    // Multimèdia
    const multimediaGrid = document.getElementById('multimedia-grid');
    if (multimediaGrid) multimediaGrid.innerHTML = renderMultimediaGrid(APP_DATA.multimedia);

    // Xat IA
    const chatMessages = document.getElementById('ai-chat-messages');
    if (chatMessages) chatMessages.innerHTML = renderChatMessages(APP_DATA.chatMessages);

    // Weather modal (pre-render)
    const weatherBody = document.getElementById('weather-modal-body');
    const weatherTitle = document.getElementById('weather-title');
    if (weatherBody) weatherBody.innerHTML = renderWeatherModal(APP_DATA.weather);
    if (weatherTitle) weatherTitle.innerHTML = `Previsió Meteorològica - <span class="text-terracotta">${APP_DATA.weather.lloc}</span>`;

    // Attach filter listeners
    attachFilterListeners();
}

// ══════════════════════════════════════════════════════════════
// FILTRES DEL CATÀLEG
// ══════════════════════════════════════════════════════════════

function attachFilterListeners() {
    // Zona checkboxes
    document.querySelectorAll('[data-filter="zone"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    // Tècnica checkboxes
    document.querySelectorAll('[data-filter="technique"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    // Material pills
    document.querySelectorAll('[data-filter="material"]').forEach(pill => {
        pill.addEventListener('click', function() {
            if (this.classList.contains('filter-pill-active') || this.classList.contains('bg-primary')) {
                this.classList.remove('bg-primary', 'text-white', 'filter-pill-active');
                this.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300', 'border', 'border-slate-200', 'dark:border-slate-700');
            } else {
                this.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');
                this.classList.add('bg-primary', 'text-white', 'filter-pill-active');
            }
            applyFilters();
        });
    });
}

function getActiveFilters() {
    const zones = [];
    document.querySelectorAll('[data-filter="zone"]:checked').forEach(cb => zones.push(cb.dataset.id));
    
    const techniques = [];
    document.querySelectorAll('[data-filter="technique"]:checked').forEach(cb => techniques.push(cb.dataset.id));
    
    const materials = [];
    document.querySelectorAll('[data-filter="material"]').forEach(pill => {
        if (pill.classList.contains('bg-primary') || pill.classList.contains('filter-pill-active')) {
            materials.push(pill.dataset.id);
        }
    });
    
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

        // Zone filter: show if craft zone matches any checked zone (or none checked = show all)
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
    if (body) body.innerHTML = renderCraftDetail(craft);
    
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
    }, 300);
    
    currentCraft = null;
}

function openWeatherModal() {
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

    if (icon.classList.contains('fill-current') && icon.classList.contains('text-red-500')) {
        icon.classList.remove('fill-current', 'text-red-500', 'scale-110');
        btn.classList.add('text-terracotta');
        btn.classList.remove('text-red-500');
        showToast(`${craftName} s'ha eliminat de favorits`, 'warning', 'heart_broken');
    } else {
        icon.classList.add('fill-current', 'text-red-500', 'scale-110');
        btn.classList.remove('text-terracotta');
        btn.classList.add('text-red-500');
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

    geoActive = true;

    // Hide confirmation
    if (confirmPanel) {
        confirmPanel.classList.remove('opacity-100', 'translate-y-0');
        confirmPanel.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => confirmPanel.classList.add('hidden'), 300);
    }

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

    showToast('Ubicació compartida — Mostrant tallers propers', 'success', 'my_location');
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

    // Reset markers
    document.querySelectorAll('[id^="mk-label-"]').forEach(el => {
        el.classList.remove('opacity-100');
        el.classList.add('opacity-0');
    });
    document.querySelectorAll('[id^="mk-pulse-"]').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id^="mk-icon-"]').forEach(el => {
        el.classList.remove('text-5xl', 'text-terracotta', 'scale-110');
        el.classList.add('text-4xl', 'text-slate-700', 'dark:text-slate-300', 'opacity-60');
    });

    // Set active marker
    const activeMarkerWrap = document.getElementById('mk-' + id);
    if (activeMarkerWrap) {
        activeMarkerWrap.classList.remove('opacity-60');

        const label = document.getElementById('mk-label-' + id);
        if (label) { label.classList.remove('opacity-0'); label.classList.add('opacity-100'); }

        const pulse = document.getElementById('mk-pulse-' + id);
        if (pulse) pulse.classList.remove('hidden');

        const icon = document.getElementById('mk-icon-' + id);
        if (icon) {
            icon.classList.remove('text-4xl', 'text-slate-700', 'dark:text-slate-300', 'opacity-60');
            icon.classList.add('text-5xl', 'text-terracotta', 'scale-110');
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
        btn.addEventListener('click', function() {
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
});
