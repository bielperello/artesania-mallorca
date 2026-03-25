// templates.js — Funcions de renderitzat per a l'SPA d'Artesania Mallorquina
// Cada funció rep dades i retorna un string HTML

// ── Utilitats ────────────────────────────────────────────────

function renderStars(rating, size = 'text-sm') {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.3;
    const empty = 5 - full - (half ? 1 : 0);
    let html = '';
    for (let i = 0; i < full; i++) html += `<span class="material-symbols-outlined fill-current ${size}">star</span>`;
    if (half) html += `<span class="material-symbols-outlined ${size}">star_half</span>`;
    for (let i = 0; i < empty; i++) html += `<span class="material-symbols-outlined text-slate-300 dark:text-slate-600 ${size}">star</span>`;
    return html;
}

// ── Filtres del Catàleg ──────────────────────────────────────

function renderFilterZones(zones) {
    return zones.map(z => `
        <label class="flex items-center gap-3 cursor-pointer">
            <input class="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" type="checkbox" ${z.checked ? 'checked' : ''} data-filter="zone" data-id="${z.id}"/>
            <span class="text-slate-600 dark:text-slate-400 text-sm">${z.label}</span>
        </label>
    `).join('');
}

function renderFilterTechniques(techniques) {
    return techniques.map(t => `
        <label class="flex items-center gap-3 cursor-pointer">
            <input class="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" type="checkbox" ${t.checked ? 'checked' : ''} data-filter="technique" data-id="${t.id}"/>
            <span class="text-slate-600 dark:text-slate-400 text-sm">${t.label}</span>
        </label>
    `).join('');
}

function renderFilterMaterials(materials) {
    return materials.map(m => {
        if (m.active) {
            return `<span class="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full cursor-pointer hover:bg-primary/90 transition-colors" data-filter="material" data-id="${m.id}">${m.label}</span>`;
        }
        return `<span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700" data-filter="material" data-id="${m.id}">${m.label}</span>`;
    }).join('');
}

// ── Targetes del Catàleg ─────────────────────────────────────

function renderCatalogCards(crafts) {
    return crafts.map(c => `
        <div class="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow relative">
            <button onclick="toggleFavoriteCard(this, event)" class="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center ${c.favorit ? 'text-red-500' : 'text-slate-400'} hover:text-red-500 transition-colors shadow-sm">
                <span class="material-symbols-outlined text-sm font-bold ${c.favorit ? 'fill-current text-red-500' : ''}">favorite</span>
            </button>
            <div class="overflow-hidden aspect-[4/3] relative">
                <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img alt="${c.nom}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${c.imatge}"/>
                <span class="absolute bottom-4 left-4 z-20 bg-primary text-white text-xs font-bold px-2 py-1 rounded">${c.material}</span>
            </div>
            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">${c.nom}</h3>
                    <div class="flex items-center text-amber-500 gap-1">
                        <span class="material-symbols-outlined text-sm" style='font-variation-settings: "FILL" 1;'>star</span>
                        <span class="text-sm font-bold text-slate-700 dark:text-slate-300">${c.rating} <span class="text-slate-500 dark:text-slate-400 font-normal">(${c.numComentaris})</span></span>
                    </div>
                </div>
                <p class="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">${c.descripcio}</p>
                <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div class="flex gap-4">
                        <div class="flex items-center gap-1 text-slate-500 text-xs" title="Comentaris">
                            <span class="material-symbols-outlined text-sm">chat_bubble</span>
                            <span>${c.numComentaris}</span>
                        </div>
                        <div class="flex items-center gap-1 text-slate-500 text-xs" title="Tallers disponibles">
                            <span class="material-symbols-outlined text-sm">handyman</span>
                            <span>${c.numTallers} tallers</span>
                        </div>
                    </div>
                    <button onclick="openModal('${c.id}')" class="text-primary hover:text-primary/80 text-sm font-bold transition-colors">Veure detalls</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ── Mapa: Comarques i Materials ──────────────────────────────

function renderMapComarques(comarques) {
    return comarques.map(c => {
        if (c.active) {
            return `<button class="flex flex-col items-start gap-1 p-3 bg-primary/10 border border-primary rounded-xl text-sm text-primary transition-all text-left shadow-[0_0_15px_rgba(236,73,19,0.3)]"><span class="font-bold">${c.label}</span></button>`;
        }
        return `<button class="flex flex-col items-start gap-1 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-left"><span class="font-medium">${c.label}</span></button>`;
    }).join('');
}

function renderMapMaterials(materials) {
    return materials.map(m => {
        if (m.active) {
            return `<button class="flex items-center gap-2 p-2.5 bg-primary/10 border border-primary text-primary rounded-xl text-sm font-medium transition-colors text-left"><span class="material-symbols-outlined text-[20px] bg-white dark:bg-slate-900 rounded-md p-1">${m.icon}</span>${m.label}</button>`;
        }
        return `<button class="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:border-${m.color} hover:text-${m.color} transition-colors text-left"><span class="material-symbols-outlined text-[20px] bg-slate-50 dark:bg-slate-900 rounded-md p-1">${m.icon}</span>${m.label}</button>`;
    }).join('');
}

// ── Mapa: Marcadors ──────────────────────────────────────────

function renderMapMarkers(markers) {
    return markers.map(m => {
        const sizeClass = m.size === 'large' ? 'w-12 h-12' : 'w-10 h-10';
        const iconSize = m.size === 'large' ? 'text-xl' : 'text-lg';
        const scaleClass = m.size === 'large' ? 'scale-110 group-hover/marker:scale-125' : 'group-hover/marker:scale-110';
        const opacityClass = m.faded ? 'opacity-50' : '';

        let tooltipHTML = '';
        if (m.tooltip) {
            const t = m.tooltip;
            const badgeBg = t.badgeColor === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-primary/10 text-primary';
            const matColor = t.materialColor;
            const borderColor = t.badgeColor === 'blue' ? 'border-blue-200 dark:border-blue-900' : 'border-primary/30 dark:border-primary/30';
            const btnBg = t.badgeColor === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-primary hover:bg-primary/90';
            const iconBg = t.badgeColor === 'blue' ? 'bg-blue-500/10' : 'bg-primary/10';

            tooltipHTML = `
            <div class="map-tooltip absolute left-1/2 -translate-x-1/2 bottom-full mb-4 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border ${borderColor} overflow-visible z-30">
                <div class="p-5 bg-white dark:bg-slate-900 rounded-2xl">
                    <div class="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <h4 class="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">${t.nom}</h4>
                        <span class="${badgeBg} text-[10px] font-bold px-2 py-0.5 rounded uppercase">${t.badgeText}</span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-slate-500 text-[18px]">location_on</span></div>
                            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${t.lloc} <span class="text-slate-400 font-normal">(${t.comarca})</span></span>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-slate-500 text-[18px]">call</span></div>
                            <span class="text-sm text-slate-600 dark:text-slate-400">${t.telefon}</span>
                        </div>
                        <div class="flex items-center gap-3 pt-1">
                            <div class="w-8 h-8 rounded-full ${iconBg} flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-${matColor} text-[18px]">category</span></div>
                            <span class="text-sm font-bold text-${matColor}">${t.material}</span>
                        </div>
                        <a class="mt-4 w-full flex items-center justify-center gap-2 ${btnBg} text-white font-bold py-2 px-4 rounded-xl transition-colors" href="https://maps.google.com/?q=${t.mapsQuery}" target="_blank">
                            <span class="material-symbols-outlined text-sm">directions</span> Com arribar-hi
                        </a>
                    </div>
                </div>
                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 rotate-45 border-r border-b ${borderColor} z-[-1]"></div>
            </div>`;
        }

        const bgColor = m.color === 'blue-500' ? 'bg-blue-500' : 'bg-primary';
        const pulseClass = m.size === 'large' ? 'pulse-marker' : '';
        const textColor = m.color === 'blue-500' ? 'text-blue-500' : 'text-primary';

        return `
        <div class="absolute top-[${m.top}] left-[${m.left}] z-10 group/marker cursor-pointer transition-all duration-1000 ease-in-out ${pulseClass} ${textColor}">
            <div class="${sizeClass} ${bgColor} rounded-full border-2 border-white flex items-center justify-center shadow-xl transform ${scaleClass} transition-transform relative z-20 ${opacityClass}">
                <span class="material-symbols-outlined text-white ${iconSize}">${m.icon}</span>
            </div>
            ${tooltipHTML}
        </div>`;
    }).join('');
}

// ── Geolocalització: Tallers Propers ─────────────────────────

function renderGeoNearby(nearby) {
    return nearby.map(n => `
        <div class="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div>
                <p class="font-bold text-sm text-slate-900 dark:text-slate-100">${n.nom}</p>
                <p class="text-[10px] text-slate-500">${n.zona} (${n.material})</p>
                <div class="flex items-center gap-1 mt-1 font-bold text-blue-600 text-[10px]">
                    <span class="material-symbols-outlined text-[12px]">directions_car</span> ${n.distancia}
                </div>
            </div>
            <button class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 p-1.5 rounded-md hover:bg-blue-100 transition-colors">
                <span class="material-symbols-outlined text-[16px]">directions</span>
            </button>
        </div>
    `).join('');
}

// ── Multimèdia ───────────────────────────────────────────────

function renderMultimediaGrid(items) {
    let html = '<div class="grain-overlay z-10"></div>';

    items.forEach((item, i) => {
        if (item.tipus === 'video-hero') {
            html += `
            <div class="col-span-1 md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer shadow-2xl z-20">
                <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
                <img alt="${item.titol}" class="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700" src="${item.img}"/>
                <div class="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300 border border-white/30">
                        <span class="material-symbols-outlined text-white text-6xl drop-shadow-lg">play_arrow</span>
                    </div>
                </div>
                <div class="absolute bottom-8 left-8 right-8 z-20">
                    <span class="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">${item.tag}</span>
                    <h3 class="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md leading-tight group-hover:-translate-y-2 transition-transform duration-500">${item.titol}</h3>
                </div>
            </div>`;
        } else if (item.tipus === 'galeria') {
            html += `
            <div class="col-span-1 md:col-span-1 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer shadow-lg z-20 flex-1 flex flex-col">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <img alt="${item.titol}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src="${item.img}"/>
                <div class="absolute inset-0 z-20 p-6 flex flex-col justify-end opacity-90 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="material-symbols-outlined text-white text-xl">photo_library</span>
                        <span class="text-white text-xs font-bold uppercase tracking-wider">Galeria</span>
                    </div>
                    <h4 class="text-2xl font-serif font-bold text-white">${item.titol}</h4>
                </div>
            </div>`;
        } else if (item.tipus === 'serie') {
            html += `
            <div class="col-span-1 md:col-span-1 md:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer shadow-lg z-20">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 z-10"></div>
                <img alt="${item.titol}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src="${item.img}"/>
                <div class="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 border border-white/10">
                    <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span class="text-white text-xs font-bold uppercase">Sèrie</span>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 class="text-2xl font-serif font-bold text-white mb-2">${item.titol}</h4>
                    <p class="text-slate-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">${item.subtitol || ''}</p>
                    <div class="flex gap-1 mb-2">
                        <div class="h-1 flex-1 bg-white rounded-full"></div>
                        <div class="h-1 flex-1 bg-white/30 rounded-full"></div>
                        <div class="h-1 flex-1 bg-white/30 rounded-full"></div>
                        <div class="h-1 flex-1 bg-white/30 rounded-full"></div>
                    </div>
                </div>
            </div>`;
        } else if (item.tipus === 'audio') {
            html += `
            <div class="col-span-1 md:col-span-1 md:row-span-1 relative rounded-xl overflow-hidden group shadow-lg z-20 bg-slate-800">
                <img alt="${item.titol}" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" src="${item.img}"/>
                <div class="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/80 z-10"></div>
                <div class="relative z-20 h-full p-6 flex flex-col items-center justify-center text-center">
                    <span class="text-primary text-xs font-bold uppercase tracking-widest mb-4">Sons de l'ofici</span>
                    <button class="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-900 hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4 relative">
                        <span class="absolute inset-0 rounded-full border border-white animate-ping opacity-20"></span>
                        <span class="material-symbols-outlined text-4xl ml-1">play_arrow</span>
                    </button>
                    <h4 class="text-xl font-serif font-bold text-white mb-1">${item.titol}</h4>
                    <p class="text-slate-400 text-sm">${item.durada || ''}</p>
                    <div class="w-full flex items-center gap-1 h-8 mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <div class="w-1 bg-primary rounded-full h-2 animate-[pulse_1s_ease-in-out_infinite]"></div>
                        <div class="w-1 bg-primary rounded-full h-5 animate-[pulse_1.2s_ease-in-out_infinite_0.1s]"></div>
                        <div class="w-1 bg-primary rounded-full h-3 animate-[pulse_0.8s_ease-in-out_infinite_0.2s]"></div>
                        <div class="w-1 bg-primary rounded-full h-8 animate-[pulse_1.5s_ease-in-out_infinite_0.3s]"></div>
                        <div class="w-1 bg-primary rounded-full h-4 animate-[pulse_1.1s_ease-in-out_infinite_0.4s]"></div>
                        <div class="w-1 bg-primary rounded-full h-6 animate-[pulse_0.9s_ease-in-out_infinite_0.5s]"></div>
                        <div class="w-1 bg-primary rounded-full h-2 animate-[pulse_1.3s_ease-in-out_infinite_0.6s]"></div>
                    </div>
                </div>
            </div>`;
        }
    });
    return html;
}

// ── Fitxa Detallada (Modal) ──────────────────────────────────

function renderCraftDetail(craft) {
    if (!craft) return '';

    // Tallers
    const tallersHTML = craft.tallers.map((t, i) => {
        const isFirst = i === 0;
        const bgClass = isFirst ? 'bg-terracotta-light dark:bg-slate-800/80' : 'bg-white dark:bg-slate-800';
        const borderClass = isFirst ? 'border-2 border-terracotta shadow-md' : 'border border-slate-200 dark:border-slate-700 shadow-sm hover:border-terracotta/50';
        const opacityClass = isFirst ? '' : 'opacity-80 hover:opacity-100';
        const titleColor = isFirst ? 'text-terracotta dark:text-terracotta' : 'text-slate-900 dark:text-slate-100';
        const iconColor = isFirst ? 'text-terracotta' : 'text-slate-400';
        const weatherBg = isFirst ? 'bg-white/50 dark:bg-slate-700/50' : 'bg-slate-50 dark:bg-slate-700/50';
        const btnClass = isFirst
            ? 'bg-terracotta hover:bg-terracotta/90 text-white'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200';
        const contactLine = t.web
            ? `<div class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px] ${iconColor}">language</span><a class="text-terracotta hover:underline" href="#">${t.web}</a></div>`
            : `<div class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px] ${iconColor}">mail</span><a class="text-terracotta hover:underline" href="#">${t.email}</a></div>`;

        return `
        <div id="ws-${t.id}" onclick="selectWorkshopDetail('${t.id}')" class="${bgClass} p-4 rounded-xl ${borderClass} cursor-pointer flex flex-col transition-colors workshop-item ${opacityClass}">
            <h4 class="font-bold text-lg ${titleColor} mb-2 ws-title">${t.nom}</h4>
            <div class="flex items-center gap-3 mb-3 ${weatherBg} w-fit px-2 py-1 rounded-md">
                <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm ${iconColor}">sunny</span>
                    <span class="text-xs font-bold text-slate-800 dark:text-slate-100">${t.temp}</span>
                </div>
                <div class="w-px h-3 bg-slate-300 dark:bg-slate-600"></div>
                <button onclick="openWeatherModal(); event.stopPropagation();" class="text-xs font-medium text-terracotta hover:underline">Veure previsió</button>
            </div>
            <div class="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300 mb-4">
                <div class="flex items-start gap-2"><span class="material-symbols-outlined text-[18px] ${iconColor} mt-0.5">location_on</span><span>${t.adreca}</span></div>
                <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px] ${iconColor}">phone</span><span>${t.telefon}</span></div>
                ${contactLine}
            </div>
            <button class="mt-auto flex items-center justify-center gap-2 w-full ${btnClass} py-2 rounded-lg text-sm font-medium transition-colors">
                <span class="material-symbols-outlined text-[18px]">directions</span> Com arribar-hi
            </button>
        </div>`;
    }).join('');

    // Marcadors del mapa intern
    const markersHTML = craft.tallers.map((t, i) => {
        const isFirst = i === 0;
        const pulseHidden = isFirst ? '' : 'hidden';
        const iconSize = isFirst ? 'text-5xl text-terracotta scale-110' : 'text-4xl text-slate-700 dark:text-slate-300 opacity-60';
        const labelOpacity = isFirst ? 'opacity-100' : 'opacity-0 group-hover:opacity-100';
        const labelBg = isFirst ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100';
        const zIndex = isFirst ? 'z-20' : 'z-10';

        return `
        <div id="mk-${t.id}" onclick="selectWorkshopDetail('${t.id}')" class="absolute top-[${t.mapPosition.top}] left-[${t.mapPosition.left}] group ${zIndex} transition-all duration-500 cursor-pointer">
            <div class="relative flex items-center justify-center">
                <div id="mk-pulse-${t.id}" class="absolute w-12 h-12 bg-terracotta rounded-full animate-[pulse-ring_2s_cubic-bezier(0.215,0.61,0.355,1)_infinite] pointer-events-none ${pulseHidden}"></div>
                <span id="mk-icon-${t.id}" class="material-symbols-outlined ${iconSize} drop-shadow-md relative z-10 transition-all">location_on</span>
                <div id="mk-label-${t.id}" class="absolute -top-12 left-1/2 -translate-x-1/2 ${labelBg} px-3 py-1 rounded shadow-lg text-sm font-bold whitespace-nowrap ${labelOpacity} pointer-events-none transition-opacity">${t.nom}</div>
            </div>
        </div>`;
    }).join('');

    // Galeria
    const galeriaHTML = craft.galeria.map(g => `
        <div class="flex flex-col gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 shadow-sm">
            <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg" style='background-image: url("${g.imatge}");'></div>
            <div class="px-2 pb-1">
                <p class="text-slate-900 dark:text-slate-100 text-sm font-bold">${g.titol}</p>
                <p class="text-slate-500 dark:text-slate-400 text-xs">${g.subtitol}</p>
            </div>
        </div>
    `).join('');

    // Artesans
    const artesansHTML = craft.artesans.map(a => `
        <div class="flex flex-col min-w-[300px] w-[300px] bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 snap-center">
            <div class="w-24 h-24 rounded-full bg-cover bg-center mb-4 border-4 border-slate-100 dark:border-slate-700 self-center" style='background-image: url("${a.foto}");'></div>
            <h4 class="font-display font-bold text-xl text-slate-900 dark:text-slate-100 text-center mb-1">${a.nom}</h4>
            <div class="flex justify-center items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                <span>${a.dates}</span><span>•</span><span>${a.lloc}</span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 text-center flex-1">${a.bio}</p>
        </div>
    `).join('');

    // Ressenyes
    const ressenyesHTML = craft.ressenyes.map(r => {
        const imatgesHTML = r.imatges.length ? `<div class="flex gap-2">${r.imatges.map(img => `<div class="w-20 h-20 rounded-lg bg-cover bg-center border border-slate-200 dark:border-slate-700" style='background-image: url("${img}");'></div>`).join('')}</div>` : '';
        return `
        <div class="border-b border-slate-200 dark:border-slate-800 pb-6">
            <div class="flex items-start justify-between mb-2">
                <div>
                    <h5 class="font-bold text-slate-900 dark:text-slate-100">${r.autor}</h5>
                    <p class="text-sm text-slate-500 dark:text-slate-400">${r.data}</p>
                </div>
                <div class="flex text-yellow-400 text-sm">${renderStars(r.rating)}</div>
            </div>
            <p class="text-slate-700 dark:text-slate-300 ${r.imatges.length ? 'mb-4' : ''}">${r.text}</p>
            ${imatgesHTML}
        </div>`;
    }).join('');

    return `
    <div class="p-8 flex flex-col gap-8">
        <div class="flex flex-col gap-4">
            <div class="flex items-end gap-4 flex-wrap">
                <h1 class="text-slate-900 dark:text-slate-100 text-5xl font-black leading-tight tracking-tight font-display">${craft.nom.split(' ')[0]}</h1>
                <div class="flex items-center gap-2 mb-2">
                    <div class="flex text-yellow-400 text-xl">${renderStars(craft.rating, 'text-xl')}</div>
                    <span class="text-slate-600 dark:text-slate-400 text-lg font-medium">${craft.rating} (${craft.numRatings} valoracions)</span>
                </div>
            </div>
            <p class="text-primary text-xl font-medium leading-normal">${craft.subtitol}</p>
            <div class="flex gap-4 mt-2">
                <button class="flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-lg font-medium hover:bg-terracotta/90 transition-colors">
                    <span class="material-symbols-outlined">volume_up</span> Escoltar descripció
                </button>
            </div>
            <p class="text-slate-700 dark:text-slate-300 text-lg font-normal leading-relaxed mt-4 max-w-4xl">${craft.descripcioLlarga}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="relative flex items-center justify-center bg-slate-800 bg-cover bg-center aspect-video rounded-xl overflow-hidden shadow-lg group" style='background-image: url("${craft.videoThumb}");'>
                <button class="flex shrink-0 items-center justify-center rounded-full size-16 bg-black/50 text-white backdrop-blur-sm group-hover:bg-primary/80 transition-all z-10">
                    <span class="material-symbols-outlined text-3xl">play_arrow</span>
                </button>
                <div class="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div class="flex h-4 items-center justify-center w-full mb-1">
                        <div class="h-1 flex-1 rounded-full bg-white relative"><div class="absolute -left-1 -top-1.5 size-4 rounded-full bg-white shadow-sm"></div></div>
                        <div class="h-1 flex-1 rounded-full bg-white/30"></div>
                    </div>
                    <div class="flex items-center justify-between text-white text-xs font-medium"><span>0:37</span><span>2:23</span></div>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                ${galeriaHTML}
                <div onclick="openGalleryModal()" class="flex flex-col gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 shadow-sm justify-center items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <span class="material-symbols-outlined text-4xl text-primary mb-2">photo_library</span>
                    <p class="text-primary text-sm font-bold">Veure Tota la Galeria</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div class="lg:col-span-1 flex flex-col gap-6">
                <div class="flex items-center justify-between"><h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">Tallers i Botigues</h3></div>
                <div class="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2">${tallersHTML}</div>
            </div>
            <div class="lg:col-span-2 relative min-h-[400px] bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out scale-100" style="background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80'); opacity: 0.9; filter: contrast(1.1) brightness(0.95);"></div>
                <div class="absolute inset-0 bg-blue-50/40 dark:bg-slate-900/40 backdrop-blur-[1px]"></div>
                ${markersHTML}
                <div class="absolute top-4 left-4 z-30">
                    <button class="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-800 dark:text-slate-200 px-4 py-2 rounded-full font-medium shadow-md hover:bg-white dark:hover:bg-slate-700 hover:text-terracotta transition-all text-sm border border-slate-200 dark:border-slate-700">
                        <span class="material-symbols-outlined text-lg">zoom_out_map</span> Restablir vista
                    </button>
                </div>
                <div class="absolute bottom-4 right-4 flex flex-col gap-2 bg-white dark:bg-slate-800 rounded-lg shadow-md p-1 z-30">
                    <button class="p-2 text-slate-600 dark:text-slate-300 hover:text-terracotta transition-colors"><span class="material-symbols-outlined">add</span></button>
                    <div class="h-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                    <button class="p-2 text-slate-600 dark:text-slate-300 hover:text-terracotta transition-colors"><span class="material-symbols-outlined">remove</span></button>
                </div>
            </div>
        </div>

        <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 font-display">Mestres Artesans Reconeguts</h3>
            <div class="flex overflow-x-auto pb-6 -mx-8 px-8 gap-6 snap-x hide-scrollbars">${artesansHTML}</div>
        </div>

        <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 font-display">Ressenyes i Comentaris</h3>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div class="lg:col-span-1">
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h4 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 font-display">Escriu una valoració</h4>
                        <form class="flex flex-col gap-4">
                            <div><label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="name">Nom i Llinatges</label><input class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-terracotta focus:ring-terracotta" id="name" placeholder="Escriu el teu nom" type="text"/></div>
                            <div><label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Puntuació</label><div class="flex gap-1 text-slate-300 dark:text-slate-600 text-2xl cursor-pointer"><span class="material-symbols-outlined hover:text-yellow-400">star</span><span class="material-symbols-outlined hover:text-yellow-400">star</span><span class="material-symbols-outlined hover:text-yellow-400">star</span><span class="material-symbols-outlined hover:text-yellow-400">star</span><span class="material-symbols-outlined hover:text-yellow-400">star</span></div></div>
                            <div><label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="comment">Comentari (opcional)</label><textarea class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-terracotta focus:ring-terracotta" id="comment" placeholder="Comparteix la teva experiència..." rows="4"></textarea></div>
                            <button class="flex items-center justify-center gap-2 w-full py-2 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-terracotta hover:text-terracotta transition-colors bg-slate-50 dark:bg-slate-700/50" type="button"><span class="material-symbols-outlined">add_photo_alternate</span> Adjuntar imatges</button>
                            <button class="mt-2 bg-terracotta text-white py-2 px-4 rounded-lg font-medium hover:bg-terracotta/90 transition-colors" type="submit">Publicar ressenya</button>
                        </form>
                    </div>
                </div>
                <div class="lg:col-span-2 flex flex-col gap-6">
                    <div class="flex items-center justify-between">
                        <h4 class="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">${craft.numRatings} Valoracions</h4>
                        <select class="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm focus:border-terracotta focus:ring-terracotta text-sm"><option>Més recents</option><option>Més antigues</option><option>Millor valoració</option><option>Pitjor valoració</option></select>
                    </div>
                    <div class="flex flex-col gap-6">${ressenyesHTML}</div>
                    <button class="text-terracotta font-medium hover:underline self-center mt-4">Carregar més ressenyes</button>
                </div>
            </div>
        </div>
    </div>`;
}

// ── Weather Modal ────────────────────────────────────────────

function renderWeatherModal(weather) {
    const horesHTML = weather.hores.map(h => {
        const borderClass = h.highlight ? 'border-2 border-slate-100 dark:border-slate-700 shadow-sm border-blue-100 dark:border-blue-900 shadow-blue-100/50 bg-white dark:bg-slate-900' : 'border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50';
        return `
        <div class="flex flex-col items-center justify-center min-w-[80px] p-4 rounded-xl ${borderClass}">
            <span class="text-xs text-slate-500 font-bold mb-2">${h.hora}</span>
            <span class="material-symbols-outlined text-${h.iconColor} text-3xl mb-2" style="font-variation-settings: 'FILL' 1;">${h.icon}</span>
            <span class="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">${h.temp}</span>
            <span class="text-[10px] text-blue-500 font-bold">${h.pluja}</span>
        </div>`;
    }).join('');

    const diesHTML = weather.dies.map(d => {
        const bgClass = d.highlight ? 'bg-orange-50/50 dark:bg-slate-800' : 'bg-white dark:bg-slate-900';
        return `
        <div class="flex items-center justify-between p-3 rounded-lg ${bgClass} shadow-sm border border-slate-100 dark:border-slate-700">
            <span class="w-24 font-bold text-slate-900 dark:text-slate-100 text-sm">${d.dia}</span>
            <div class="flex-1 flex items-center gap-2">
                <span class="material-symbols-outlined text-${d.iconColor} text-lg" style="font-variation-settings: 'FILL' 1;">${d.icon}</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">${d.desc}</span>
            </div>
            <div class="flex items-center gap-6">
                <span class="text-blue-500 text-xs font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">water_drop</span> ${d.pluja}</span>
                <div class="w-16 flex justify-end gap-2 text-sm"><span class="font-bold text-slate-900 dark:text-slate-100">${d.max}</span><span class="text-slate-400">${d.min}</span></div>
            </div>
        </div>`;
    }).join('');

    return `
    <div class="p-6 flex flex-col gap-8">
        <div class="relative w-full h-48 rounded-2xl overflow-hidden flex items-end p-6 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1543884879-66c878b2d187?auto=format&fit=crop&w=1000&q=80');">
            <div class="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>
            <div class="relative z-10 text-white w-full flex justify-between items-end">
                <div>
                    <p class="text-[10px] font-bold tracking-wider mb-1 uppercase text-white/80">Ara mateix</p>
                    <h3 class="text-6xl font-serif font-bold leading-none mb-2">${weather.actual.temp}</h3>
                    <p class="text-base font-medium text-white/90">${weather.actual.desc}</p>
                </div>
                <span class="material-symbols-outlined text-6xl text-yellow-300" style="font-variation-settings: 'FILL' 1;">light_mode</span>
            </div>
        </div>
        <div class="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700">
            <button class="text-blue-600 font-bold text-xs tracking-wider uppercase pb-3 border-b-2 border-blue-600">Pròximes hores</button>
            <button class="text-slate-400 font-bold text-xs tracking-wider uppercase pb-3 hover:text-slate-600 transition-colors">Pròxims 7 dies</button>
        </div>
        <div>
            <h4 class="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">Evolució per hores</h4>
            <div class="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbars">${horesHTML}</div>
        </div>
        <div>
            <h4 class="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">Pròxims 7 dies</h4>
            <div class="flex flex-col gap-2">${diesHTML}</div>
        </div>
        <div class="w-full text-center pt-2 pb-2">
            <p class="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">Dades actualitzades fa 5 minuts • Font: Servei Meteorològic</p>
        </div>
    </div>`;
}

// ── Galeria Modal ────────────────────────────────────────────

function renderGalleryImages(craft) {
    if (!craft) return '';
    return craft.galeria.map((g, i) => {
        const extraClass = i === craft.galeria.length - 1 ? 'sm:col-span-2 md:col-span-3 aspect-[21/9]' : '';
        return `<img src="${g.imatge}" class="w-full h-64 object-cover rounded-xl shadow-lg border border-white/10 hover:scale-105 transition-transform duration-500 cursor-pointer ${extraClass}" alt="${g.titol}">`;
    }).join('') + `<img src="${craft.imatge}" class="w-full h-64 object-cover rounded-xl shadow-lg border border-white/10 hover:scale-105 transition-transform duration-500 cursor-pointer sm:col-span-2 md:col-span-3 aspect-[21/9]" alt="${craft.nom}">`;
}

// ── Xat IA ───────────────────────────────────────────────────

function renderChatMessages(messages) {
    return messages.map(msg => {
        if (msg.role === 'user') {
            return `
            <div class="flex items-start gap-2 flex-row-reverse">
                <div class="w-8 h-8 rounded-full bg-terracotta shrink-0 flex items-center justify-center"><span class="material-symbols-outlined text-[16px] text-white">person</span></div>
                <div class="bg-terracotta text-white p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%]"><p class="text-sm font-medium">${msg.text}</p></div>
            </div>`;
        }
        const content = msg.html || `<p class="text-sm text-slate-700 dark:text-slate-300">${msg.text}</p>`;
        return `
        <div class="flex items-start gap-2">
            <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center"><span class="material-symbols-outlined text-[16px] text-slate-600 dark:text-slate-400" style="font-variation-settings: 'FILL' 1">smart_toy</span></div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm max-w-[85%]">${content}</div>
        </div>`;
    }).join('');
}
