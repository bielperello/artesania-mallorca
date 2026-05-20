// templates.js — Funcions de renderitzat per a l'SPA d'Artesania Mallorquina
// Cada funció rep dades i retorna un string HTML

// ══════════════════════════════════════════════════════════════
// SECCIONS DE PÀGINA (Estructura principal)
// ══════════════════════════════════════════════════════════════
function renderHeader() {
    const navLinkClass = "text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-lg font-medium leading-normal truncate";

    const navItems = [
        { href: '#inici', label: 'Inici', icon: 'home' },
        { href: '#sobre-nosaltres', label: 'Sobre nosaltres', icon: 'info' },
        { href: '#cataleg', label: 'Catàleg', icon: 'category' },
        { href: '#mapa', label: 'Mapa', icon: 'map' },
        { href: '#multimedia', label: 'Multimèdia', icon: 'perm_media' }
    ];

    const desktopNavHtml = navItems.map(item =>
        `<a class="${navLinkClass}" href="${item.href}">${item.label}</a>`
    ).join('\n                    ');

    const mobileNavHtml = navItems.filter(item => item.label !== 'Catàleg').map(item =>
        `<a onclick="toggleMobileMenu()" class="text-lg font-bold text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-3" href="${item.href}">
                    <span class="material-symbols-outlined">${item.icon}</span> ${item.label}
                </a>`
    ).join('\n                ');

    return `
    <header class="sticky top-0 z-50 border-b border-solid border-slate-200 dark:border-slate-800 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur">
        <div class="flex items-center justify-between px-4 md:px-10 py-4">
            <!-- Branding -->
            <a href="#inici" aria-label="Anar a l'inici d'Artesania Mallorquina" class="flex items-center gap-3 text-primary hover:opacity-90 transition-opacity">
                <img src="./media/images/logo.png" alt="Logo Artesania Mallorquina" class="h-10 w-10 rounded-lg object-cover shadow-sm"/>
                <span class="text-slate-900 dark:text-slate-100 text-4xl font-serif font-bold leading-tight tracking-[-0.015em]">
                    Artesania Mallorquina
                </span>
            </a>

            <!-- Navegació i accions -->
            <div class="flex items-center gap-4 md:gap-8">
                <nav class="hidden lg:flex items-center gap-9" aria-label="Navegació principal">
                    ${desktopNavHtml}
                </nav>

                <a class="hidden sm:flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary hover:bg-primary/80 transition-colors text-white text-lg font-bold leading-normal tracking-[0.015em]" href="#cataleg">
                    <span class="truncate">Explora el catàleg</span>
                </a>

                <button onclick="toggleMobileMenu()" id="mobile-menu-btn" class="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Obrir menú de navegació">
                    <span class="material-symbols-outlined" id="mobile-menu-icon">menu</span>
                </button>
            </div>
        </div>

        <!-- Menú mòbil (amagat per defecte) -->
        <div id="mobile-menu" class="hidden lg:hidden absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300 opacity-0 transform -translate-y-2">
            <nav class="flex flex-col p-6 gap-6">
                ${mobileNavHtml}
                
                <div class="h-px w-full bg-slate-200 dark:bg-slate-800 my-2"></div>
                
                <a onclick="toggleMobileMenu()" class="flex items-center justify-center rounded-lg h-12 bg-primary hover:bg-primary/80 transition-colors text-white text-base font-bold sm:hidden" href="#cataleg">
                    Explora el catàleg
                </a>
            </nav>
        </div>
    </header>`;
}

function renderHero() {
    return `
    <section class="@container mb-16 px-10 py-8 lg:px-20 max-w-[1400px] mx-auto">
        <div class="flex min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-center px-8 pb-12 shadow-lg relative overflow-hidden" style='background-image: url("./media/images/hero-01.jpg");'>
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            <div class="relative z-10 flex flex-col gap-4 text-left max-w-2xl mt-12">
                <span class="text-primary font-bold uppercase tracking-wider text-sm">Patrimoni Mediterrani</span>
                <h1 class="text-white text-5xl font-serif font-black leading-tight tracking-[-0.033em]">Catàleg Interactiu d'Artesania Mallorquina</h1>
                <h2 class="text-slate-200 text-lg font-normal leading-relaxed">Descobreix les arts tradicionals de la Mediterrània. Un viatge a través de generacions d'artesans que preserven l'essència de l'illa.</h2>
            </div>
        </div>
    </section>`;
}

function renderAbout() {
    return `
    <section class="mb-24 px-10 lg:px-20 max-w-[1200px] mx-auto" id="sobre-nosaltres">
        <div class="flex flex-col lg:flex-row gap-16 items-center">
            
            <div class="w-full lg:w-1/2 relative">
                <img src="./media/images/logo.jpeg" alt="" aria-hidden="true" role="presentation" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[60%] lg:w-[85%] max-w-[600px] h-auto object-contain opacity-[0.06] dark:opacity-5 pointer-events-none select-none"/>
                <div class="relative z-10">
                    <span class="text-primary font-bold uppercase tracking-wider text-xs mb-4 block">Sobre Nosaltres</span>
                    <h2 class="text-slate-900 dark:text-slate-100 text-4xl font-serif font-bold leading-tight mb-6">Preservar la memòria de les nostres mans.</h2>
                    <div class="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed font-light text-lg">
                        <p>L'artesania a les Illes Balears no és només una manera de crear objectes; és el llegat silenciós de centenars d'anys d'adaptació al medi, de diàleg amb la terra, l'argila, la fusta i el mar.</p>
                        <p>La nostra missió és documentar, protegir i difondre el treball dels mestres artesans que encara avui mantenen vives tècniques ancestrals com el siurell, el bufat de vidre o la llatra.</p>
                        <p>Aquest espai neix per connectar el passat amb les noves generacions, valorant la lentitud, el detall i la bellesa de l'imperfet en un món cada cop més accelerat.</p>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-1/2 relative">
                <figure class="relative z-10">
                    <div class="aspect-[4/5] overflow-hidden rounded-lg shadow-xl mb-3">
                        <img alt="Artesana de Siurells de Ca Mado Bet." class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="./media/images/about-01.webp"/>
                    </div>
                    <figcaption class="text-sm text-slate-500 dark:text-slate-400 italic text-right px-2">
                        Artesana de Siurells de Ca Mado Bet al seu taller
                    </figcaption>
                </figure>    
            </div>
            
        </div>
    </section>`;
}

function renderCatalogSection() {
    return `
    <section class="mb-20 px-10 py-8 lg:px-20 max-w-[1400px] mx-auto" id="cataleg">
        <div class="flex justify-between items-end mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 class="text-slate-900 dark:text-slate-100 text-3xl font-serif font-bold leading-tight tracking-[-0.015em]">Explora el Catàleg</h2>
        </div>
        <div class="flex flex-col lg:flex-row gap-10">
            <aside class="w-full lg:w-1/4 flex flex-col gap-0 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-max">
                <div class="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span class="material-symbols-outlined text-primary">filter_list</span>
                    <h3 class="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">Filtres</h3>
                </div>
                <!-- Zona Geogràfica -->
                <div>
                    <details class="group [&_summary::-webkit-details-marker]:hidden" close>
                        <summary class="cursor-pointer list-none flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider select-none py-2">
                            <div class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">explore</span> Zona Geogràfica</div>
                            <span class="material-symbols-outlined group-open:-scale-y-100 transition-transform">expand_more</span>
                        </summary>
                        <div id="filter-zones" class="flex flex-wrap gap-2 pb-4 group-open:animate-fade-in"></div>
                    </details>
                </div>
                <!-- Tècnica -->
                <div class="border-t border-slate-100 dark:border-slate-800">
                    <details class="group [&_summary::-webkit-details-marker]:hidden" close>
                        <summary class="cursor-pointer list-none flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider select-none py-2">
                            <div class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">construction</span> Tècnica</div>
                            <span class="material-symbols-outlined group-open:-scale-y-100 transition-transform">expand_more</span>
                        </summary>
                        <div id="filter-techniques" class="flex flex-wrap gap-2 pb-4 group-open:animate-fade-in"></div>
                    </details>
                </div>
                <!-- Material -->
                <div class="border-t border-slate-100 dark:border-slate-800">
                    <details class="group [&_summary::-webkit-details-marker]:hidden" close>
                        <summary class="cursor-pointer list-none flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider select-none py-2">
                            <div class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">category</span> Material</div>
                            <span class="material-symbols-outlined group-open:-scale-y-100 transition-transform">expand_more</span>
                        </summary>
                        <div id="filter-materials" class="flex flex-wrap gap-2 pb-4 group-open:animate-fade-in"></div>
                    </details>
                </div>
                <!-- Favorits toggle -->
                <div class="border-t border-slate-100 dark:border-slate-800 pt-4">
                    <label class="flex items-center justify-between cursor-pointer">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-red-500 text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
                            <span class="text-slate-700 dark:text-slate-300 text-sm font-medium">Només favorits</span>
                        </div>
                        <div class="relative">
                            <input id="favorites-toggle" class="sr-only peer" type="checkbox"/>
                            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                        </div>
                    </label>
                </div>
            </aside>
            <div class="w-full lg:w-3/4 flex flex-col gap-6">
                <div class="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div class="relative flex-1 w-full">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input id="catalog-search" class="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary dark:text-white placeholder-slate-400 transition-all" placeholder="Cerca artesans, materials, tècniques..." type="text"/>
                        <button id="clear-search-btn" class="absolute right-11 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1" title="Esborrar cerca" style="display: none;">
                            <span class="material-symbols-outlined">clear</span>
                        </button>
                        <button id="voice-search-btn" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1" title="Cerca per veu">
                            <span class="material-symbols-outlined">mic</span>
                        </button>
                    </div>
                    <div class="flex gap-4 items-center w-full md:w-auto">
                        <div class="w-full md:w-48 relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none text-sm">sort</span>
                            <label for="catalog-sort" class="sr-only">Ordena catàleg</label>
                            <select id="catalog-sort" class="w-full pl-9 pr-8 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-200 appearance-none cursor-pointer">
                                <option value="relevance">Més rellevants</option>
                                <option value="az">Alfabètic (A-Z)</option>
                                <option value="za">Alfabètic (Z-A)</option>
                                <option selected value="rating">Valoració</option>
                                <option value="comments">Més comentaris</option>
                                <option value="workshops">Tallers disponibles</option>
                            </select>
                            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">expand_more</span>
                        </div>
                        <div class="hidden md:flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-lg border border-slate-100 dark:border-slate-700">
                            <button onclick="setGridCols(2, this)" class="grid-col-btn p-1.5 rounded bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-200 transition-colors" title="2 columnes"><span class="material-symbols-outlined text-[18px]">grid_view</span></button>
                            <button onclick="setGridCols(3, this)" class="grid-col-btn p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" title="3 columnes"><span class="material-symbols-outlined text-[18px]">view_module</span></button>
                            <button onclick="setGridCols(4, this)" class="grid-col-btn p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" title="4 columnes"><span class="material-symbols-outlined text-[18px]">view_comfy</span></button>
                        </div>
                    </div>
                </div>
                <div id="catalog-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 transition-all duration-500">
                    <!-- JS renderCatalogCards() -->
                </div>
                <div class="flex justify-center mt-8">
                    <button class="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-bold transition-colors">Carregar més artesanies</button>
                </div>
            </div>
        </div>
    </section>`;
}

function renderMapSection() {
    return `
    <section class="mb-20" id="mapa">
        <div class="relative w-full h-[80vh] min-h-[600px] bg-slate-100 dark:bg-slate-800 overflow-hidden group">
            <!-- Mapa interactiu Leaflet -->
            <div id="main-map" class="leaflet-map-container absolute inset-0 z-0"></div>
            <!-- Panell lateral del mapa -->
            <div class="absolute top-6 left-6 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-sm w-full max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-serif font-bold text-xl text-slate-900 dark:text-slate-100">Mapa d'Artesans</h3>
                    <div class="flex items-center gap-2">
                        <button class="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors font-medium">
                            <span class="material-symbols-outlined text-[16px]">zoom_out_map</span> Restablir
                        </button>
                    </div>
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-5">Explora l'artesania autèntica per illes i comarques.</p>
                <div class="space-y-6">
                    <div>
                        <details class="group [&_summary::-webkit-details-marker]:hidden" close>
                            <summary class="cursor-pointer list-none flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider select-none">
                                <div class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">explore</span> Comarques de Mallorca</div>
                                <span class="material-symbols-outlined group-open:-scale-y-100 transition-transform">expand_more</span>
                            </summary>
                            <div id="map-comarques" class="grid grid-cols-2 gap-2 group-open:animate-fade-in"><!-- JS --></div>
                        </details>
                    </div>
                    <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <details class="group [&_summary::-webkit-details-marker]:hidden" close>
                            <summary class="cursor-pointer list-none flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider select-none">
                                <div class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">category</span> Materials</div>
                                <span class="material-symbols-outlined group-open:-scale-y-100 transition-transform">expand_more</span>
                            </summary>
                            <div id="map-materials" class="grid grid-cols-2 gap-2 group-open:animate-fade-in"><!-- JS --></div>
                        </details>
                    </div>
                </div>
            </div>

            <!-- Popup confirmació geolocalització -->
            <div id="geo-confirm" class="absolute bottom-[70px] right-6 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-80 hidden opacity-0 transition-all duration-300 transform translate-y-2">
                <div class="flex items-center gap-3 mb-3">
                    <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-blue-500 text-xl">my_location</span>
                    </div>
                    <div>
                        <h4 class="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">Compartir ubicació</h4>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Vols compartir la teva ubicació per veure els tallers més propers?</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="confirmGeolocation()" class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">check</span> Sí, compartir
                    </button>
                    <button onclick="cancelGeolocation()" class="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors">
                        Cancel·lar
                    </button>
                </div>
            </div>

            <!-- Popup tallers propers -->
            <div id="geo-popup" class="absolute bottom-[70px] right-6 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-80 hidden opacity-0 transition-all duration-300 transform translate-y-2">
                <div class="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 class="font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1 text-sm">
                        <span class="material-symbols-outlined text-blue-500 text-[18px]">near_me</span> Tallers Més Propers
                    </h4>
                    <div class="flex items-center gap-1">
                        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span class="text-[10px] text-green-600 dark:text-green-400 font-medium">Ubicació activa</span>
                    </div>
                </div>
                <div id="geo-list" class="space-y-3"><!-- JS --></div>
                <button onclick="stopGeolocation()" class="mt-3 w-full px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 border border-red-200 dark:border-red-800">
                    <span class="material-symbols-outlined text-[14px]">location_off</span> Deixar de compartir ubicació
                </button>
            </div>

            <!-- Botó geolocalització -->
            <div class="absolute bottom-6 right-6 flex flex-col gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-xl p-1.5 z-30 border border-slate-200 dark:border-slate-700">
                <button onclick="toggleGeoConfirm()" class="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg dark:text-blue-400 font-bold transition-all" title="Geolocalitza'm"><span class="material-symbols-outlined text-[20px]" id="geo-icon">my_location</span></button>
            </div>
        </div>
    </section>`;
}

function renderMultimediaSection() {
    return `
    <section class="mb-20 px-10 lg:px-20 max-w-[1600px] mx-auto w-full" id="multimedia">
        <div class="flex justify-between items-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 class="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Multimèdia Inmersiva i Visual</h2>
        </div>
        <div id="multimedia-grid" class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] w-full bg-slate-900 rounded-2xl overflow-hidden p-4 relative">
            <!-- JS renderMultimediaGrid() -->
        </div>
    </section>`;
}

function renderFooter() {
    return `
    <footer class="bg-slate-900 text-slate-400 py-12 px-10 border-t border-slate-800 mt-auto">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-3 text-white">
                <img src="./media/images/logo.jpeg" alt="Logo" class="h-9 w-9 rounded-lg object-cover opacity-90"/>
                <span class="font-serif font-bold text-lg">Artesania Mallorquina</span>
            </div>
            <div class="flex gap-6">
                <a class="hover:text-white transition-colors" href="#">Política de Privacitat</a>
                <a class="hover:text-white transition-colors" href="#">Termes del Servei</a>
                <a class="hover:text-white transition-colors" href="#">Contacte</a>
            </div>
            <p class="text-sm">© 2026 Catàleg d'Artesania Mallorquina. Tots els drets reservats.</p>
        </div>
    </footer>`;
}

function renderFAB() {
    return `
    <button aria-label="Obrir Assistent d'IA" onclick="toggleAIChat()" class="fixed bottom-8 right-8 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30 group">
        <span class="material-symbols-outlined text-3xl">auto_awesome</span>
        <span class="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform"></span>
    </button>`;
}

function renderModals() {
    return `
    <!-- Fitxa Detallada -->
    <div id="craft-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-slate-900/50 backdrop-blur-sm opacity-0 transition-opacity duration-300 p-4 font-sans">
        <div id="craft-modal-content" class="bg-background-light dark:bg-background-dark w-full max-w-[1200px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col relative transform scale-95 transition-transform duration-300">
            <header class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-8 py-4 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur z-50 flex-row">
                <div class="flex items-center gap-4 text-slate-900 dark:text-slate-100">
                    <span class="material-symbols-outlined text-primary">category</span>
                    <h2 class="text-xl font-bold leading-tight tracking-tight font-display">Fitxa d'Artesania</h2>
                </div>
                <div class="flex items-center gap-2 mr-2">
                    <button aria-label="Afegir a preferits" onclick="toggleModalFavorite(this)" class="flex items-center justify-center rounded-full size-10 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 transition-all group cursor-pointer" title="Afegir a preferits">
                        <span class="material-symbols-outlined group-hover:text-red-400 transition-colors">favorite</span>
                    </button>
                    <button aria-label="Compartir" class="flex items-center justify-center rounded-full size-10 bg-sand/30 hover:bg-sand/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors" title="Compartir">
                        <span class="material-symbols-outlined">share</span>
                    </button>
                </div>
                <button onclick="closeModal()" id="close-modal" class="flex items-center justify-center rounded-full size-10 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </header>
            <div id="craft-modal-body"><!-- JS renderCraftDetail() --></div>
        </div>
    </div>

    <!-- Weather Modal -->
    <div id="weather-modal" class="fixed inset-0 z-[200] hidden items-center justify-center bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 p-4 font-sans">
        <div id="weather-modal-content" class="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col relative transform scale-95 transition-transform duration-300">
            <header class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-terracotta text-2xl">light_mode</span>
                    <h2 id="weather-title" class="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif">Previsió Meteorològica</h2>
                </div>
                <button onclick="closeWeatherModal()" class="flex items-center justify-center rounded-full flex-shrink-0 w-10 h-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </header>
            <div id="weather-modal-body"><!-- JS renderWeatherModal() --></div>
        </div>
    </div>

    <!-- Gallery Modal -->
    <div id="gallery-modal" class="fixed inset-0 z-[300] hidden items-center justify-center bg-black/95 backdrop-blur-md opacity-0 transition-opacity duration-300 p-4 sm:p-8">
        <button onclick="closeGalleryModal()" class="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-all z-50">
            <span class="material-symbols-outlined text-3xl">close</span>
        </button>
        <div id="gallery-content" class="w-full max-w-5xl max-h-full flex flex-col transform scale-95 transition-transform duration-300 mt-10">
            <h3 class="text-2xl font-serif font-bold text-white mb-6 text-center">Tota la Galeria</h3>
            <div id="gallery-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 hide-scrollbars pb-8">
                <!-- JS renderGalleryImages() -->
            </div>
        </div>
    </div>

    <!-- AI Chat Panel -->
    <div id="ai-chat-panel" class="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col z-[90] hidden opacity-0 transition-opacity duration-300 transform translate-y-4">
        <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 shrink-0">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-900/40 dark:to-purple-900/40 flex items-center justify-center border border-orange-200 dark:border-orange-800/50">
                    <span class="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">smart_toy</span>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-slate-100">Assistent IA</h4>
                    <p class="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1 font-medium"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> En línia</p>
                </div>
            </div>
            <button onclick="toggleAIChat()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><span class="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <div id="ai-chat-messages" class="flex-1 min-h-0 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900 pb-4">
            <!-- JS renderChatMessages() -->
        </div>
        <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 shrink-0">
            <form class="relative flex items-center" onsubmit="handleChatSubmit(event)">
                <input id="chat-input" type="text" placeholder="Fes la teva consulta..." class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-terracotta pr-10">
                <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-terracotta hover:bg-terracotta/10 transition-colors">
                    <span class="material-symbols-outlined text-[18px]" style="transform: rotate(-45deg); padding-left: 2px;">send</span>
                </button>
            </form>
        </div>
    </div>`;
}// ── Utilitats ────────────────────────────────────────────────

function renderStars(rating, size = 'text-sm') {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.3;
    const empty = 5 - full - (half ? 1 : 0);
    let html = '';
    for (let i = 0; i < full; i++) html += `<span class="material-symbols-outlined text-amber-400 ${size}" style="font-variation-settings: 'FILL' 1;">star</span>`;
    if (half) html += `<span class="material-symbols-outlined text-amber-400 ${size}" style="font-variation-settings: 'FILL' 1;">star_half</span>`;
    for (let i = 0; i < empty; i++) html += `<span class="material-symbols-outlined text-slate-300 dark:text-slate-600 ${size}">star</span>`;
    return html;
}

// ── Filtres del Catàleg ──────────────────────────────────────

function renderFilterZones(zones) {
    const pills = zones.map(z => {
        if (z.active) {
            return `<span class="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full cursor-pointer hover:bg-primary/90 transition-colors" data-filter="zone" data-id="${z.id}">${z.label}</span>`;
        }
        return `<span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700" data-filter="zone" data-id="${z.id}">${z.label}</span>`;
    }).join('');
    return pills + `<button type="button" onclick="resetFilterGroup('zone')" class="px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full border border-red-200 dark:border-red-900 transition-colors flex items-center gap-1 cursor-pointer" title="Netejar filtre de zona"><span class="material-symbols-outlined text-[14px]">restart_alt</span> Netejar</button>`;
}

function renderFilterTechniques(techniques) {
    const pills = techniques.map(t => {
        if (t.active) {
            return `<span class="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full cursor-pointer hover:bg-primary/90 transition-colors" data-filter="technique" data-id="${t.id}">${t.label}</span>`;
        }
        return `<span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700" data-filter="technique" data-id="${t.id}">${t.label}</span>`;
    }).join('');
    return pills + `<button type="button" onclick="resetFilterGroup('technique')" class="px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full border border-red-200 dark:border-red-900 transition-colors flex items-center gap-1 cursor-pointer" title="Netejar filtre de tècnica"><span class="material-symbols-outlined text-[14px]">restart_alt</span> Netejar</button>`;
}

function renderFilterMaterials(materials) {
    const pills = materials.map(m => {
        if (m.active) {
            return `<span class="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full cursor-pointer hover:bg-primary/90 transition-colors" data-filter="material" data-id="${m.id}">${m.label}</span>`;
        }
        return `<span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700" data-filter="material" data-id="${m.id}">${m.label}</span>`;
    }).join('');
    return pills + `<button type="button" onclick="resetFilterGroup('material')" class="px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full border border-red-200 dark:border-red-900 transition-colors flex items-center gap-1 cursor-pointer" title="Netejar filtre de material"><span class="material-symbols-outlined text-[14px]">restart_alt</span> Netejar</button>`;
}

// ── Targetes del Catàleg ─────────────────────────────────────

function renderCatalogCards(crafts) {
    const favorites = getFavorites();
    return crafts.map(c => {
        const isFav = favorites.has(c.id);
        return `
        <div class="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow relative" data-craft-id="${c.id}">
            <button onclick="toggleFavoriteCard('${c.id}', this, event)" class="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center ${isFav ? 'text-red-500' : 'text-slate-400'} hover:text-red-500 transition-colors shadow-sm">
                <span class="material-symbols-outlined text-sm font-bold" style="font-variation-settings: 'FILL' ${isFav ? 1 : 0};">favorite</span>
            </button>
            <div class="overflow-hidden aspect-[4/3] relative">
                <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img alt="${c.nom}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 img-optimized" src="${c.imatge}" loading="lazy" decoding="async" onerror="handleImageError(this)"/>
                <span class="absolute bottom-4 left-4 z-20 bg-primary text-white text-xs font-bold px-2 py-1 rounded">${c.material}</span>
            </div>
            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">${c.nom}</h3>
                    <div class="flex items-center text-amber-500 gap-1">
                        <span class="material-symbols-outlined text-sm" style='font-variation-settings: "FILL" 1;'>star</span>
                        <span class="text-sm font-bold text-slate-700 dark:text-slate-300">${c.rating} <span class="text-slate-500 dark:text-slate-400 font-normal">(${c.numRatings})</span></span>
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
        </div>`;
    }).join('');
}

// ── Mapa: Comarques i Materials ──────────────────────────────

function renderMapComarques(comarques) {
    return comarques.map(c => {
        if (c.active) {
            return `<button data-comarca="${c.id}" class="flex flex-col items-start gap-1 p-3 bg-primary/10 border border-primary rounded-xl text-sm text-primary transition-all text-left shadow-[0_0_15px_rgba(236,73,19,0.3)]"><span class="font-bold">${c.label}</span></button>`;
        }
        return `<button data-comarca="${c.id}" class="flex flex-col items-start gap-1 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-left"><span class="font-medium">${c.label}</span></button>`;
    }).join('');
}

function renderMapMaterials(materials) {
    return materials.map(m => {
        if (m.active) {
            return `<button data-material="${m.id}" class="flex items-center gap-2 p-2.5 bg-primary/10 border border-primary text-primary rounded-xl text-sm font-medium transition-colors text-left"><span class="material-symbols-outlined text-[20px] bg-white dark:bg-slate-900 rounded-md p-1">${m.icon}</span>${m.label}</button>`;
        }
        return `<button data-material="${m.id}" class="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:border-${m.color} hover:text-${m.color} transition-colors text-left"><span class="material-symbols-outlined text-[20px] bg-slate-50 dark:bg-slate-900 rounded-md p-1">${m.icon}</span>${m.label}</button>`;
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

function renderGeoNearby(tallers) {
    if (!tallers || tallers.length === 0) {
        return `<p class="text-xs text-slate-500 dark:text-slate-400 text-center py-2">Activa la ubicació per veure tallers propers</p>`;
    }
    return tallers.map(t => `
        <div class="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div>
                <p class="font-bold text-sm text-slate-900 dark:text-slate-100">${t.nom}</p>
                <p class="text-[10px] text-slate-500">${t.adreca || t.zona || ''}</p>
                <div class="flex items-center gap-1 mt-1 font-bold text-blue-600 text-[10px]">
                    <span class="material-symbols-outlined text-[12px]">directions_car</span> ${t.distancia || 'Calculant...'}
                </div>
            </div>
            <a href="https://maps.google.com/?q=${t.mapsQuery || encodeURIComponent(t.nom)}" target="_blank" class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 p-1.5 rounded-md hover:bg-blue-100 transition-colors">
                <span class="material-symbols-outlined text-[16px]">directions</span>
            </a>
        </div>
    `).join('');
}

// ── Multimèdia ───────────────────────────────────────────────

function renderMultimediaGrid(items) {
    let html = '<div class="grain-overlay z-10"></div>';

    items.forEach((item, i) => {
        if (item.tipus === 'video-hero') {
            html += `
            <div class="col-span-1 md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer shadow-2xl z-20" onclick="showToast('Reproduint vídeo: ${item.titol}', 'info', 'play_circle')">
                <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
                <img alt="${item.titol}" class="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 img-optimized" src="${item.img}" loading="lazy" decoding="async" onerror="handleImageError(this)"/>
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
            <div class="col-span-1 md:col-span-1 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer shadow-lg z-20 flex-1 flex flex-col" onclick="showToast('Obrint galeria: ${item.titol}', 'info', 'photo_library')">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <img alt="${item.titol}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 img-optimized" src="${item.img}" loading="lazy" decoding="async" onerror="handleImageError(this)"/>
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
            <div class="col-span-1 md:col-span-1 md:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer shadow-lg z-20" onclick="showToast('Sèrie: ${item.titol} — pròximament', 'info', 'subscriptions')">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 z-10"></div>
                <img alt="${item.titol}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 img-optimized" src="${item.img}" loading="lazy" decoding="async" onerror="handleImageError(this)"/>
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
                <img alt="${item.titol}" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700 img-optimized" src="${item.img}" loading="lazy" decoding="async" onerror="handleImageError(this)"/>
                <div class="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/80 z-10"></div>
                <div class="relative z-20 h-full p-6 flex flex-col items-center justify-center text-center">
                    <span class="text-primary text-xs font-bold uppercase tracking-widest mb-4">Sons de l'ofici</span>
                    <button onclick="showToast('Reproduint àudio: ${item.titol}', 'info', 'headphones')" class="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-900 hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4 relative">
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
                <button onclick="openWeatherModal('${t.id}'); event.stopPropagation();" class="text-xs font-medium text-terracotta hover:underline">Veure previsió</button>
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
        <div class="flex flex-col min-w-[300px] w-[300px] bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 snap-center cursor-pointer group/artisan hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-500">
            <div class="w-24 h-24 rounded-full bg-cover bg-center mb-4 border-4 border-slate-100 dark:border-slate-700 self-center group-hover/artisan:border-primary/40 group-hover/artisan:scale-110 group-hover/artisan:shadow-lg transition-all duration-500" style='background-image: url("${a.foto}");'></div>
            <h4 class="font-display font-bold text-xl text-slate-900 dark:text-slate-100 text-center mb-1 group-hover/artisan:text-primary transition-colors duration-300">${a.nom}</h4>
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
                <button onclick="toggleSpeakDescription(this)" class="flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-lg font-medium hover:bg-terracotta/90 transition-colors">
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
                <!-- Mapa interactiu Leaflet per als tallers de la fitxa -->
                <div id="craft-map-container" class="leaflet-map-container"></div>
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
                        <div id="review-form-container">
                            <h4 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 font-display">Escriu una valoració</h4>
                            <form id="review-form" onsubmit="handleReviewSubmit(event, '${craft.id}')" class="flex flex-col gap-4">
                                <div><label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="review-name">Nom i Llinatges</label><input class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-terracotta focus:ring-terracotta" id="review-name" placeholder="Escriu el teu nom" type="text" required/></div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Puntuació</label>
                                    <div id="review-stars" class="flex gap-1 text-slate-300 dark:text-slate-600 text-2xl cursor-pointer">
                                        <span class="material-symbols-outlined hover:text-yellow-400 transition-colors" onclick="setReviewRating(1)">star</span>
                                        <span class="material-symbols-outlined hover:text-yellow-400 transition-colors" onclick="setReviewRating(2)">star</span>
                                        <span class="material-symbols-outlined hover:text-yellow-400 transition-colors" onclick="setReviewRating(3)">star</span>
                                        <span class="material-symbols-outlined hover:text-yellow-400 transition-colors" onclick="setReviewRating(4)">star</span>
                                        <span class="material-symbols-outlined hover:text-yellow-400 transition-colors" onclick="setReviewRating(5)">star</span>
                                    </div>
                                    <input type="hidden" id="review-rating" value="0" required>
                                </div>
                                <div><label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="review-comment">Comentari (opcional)</label><textarea class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-terracotta focus:ring-terracotta" id="review-comment" placeholder="Comparteix la teva experiència..." rows="4"></textarea></div>
                                <label class="cursor-pointer flex items-center justify-center gap-2 w-full py-2 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-terracotta hover:text-terracotta transition-colors bg-slate-50 dark:bg-slate-700/50">
                                    <span class="material-symbols-outlined">add_photo_alternate</span> Adjuntar imatges
                                    <input type="file" id="review-photos-input" multiple accept="image/*" class="hidden" onchange="handlePhotoUpload(this)">
                                </label>
                                <div id="review-photos-preview" class="flex gap-2 flex-wrap empty:hidden"></div>
                                <button class="mt-2 bg-terracotta text-white py-2 px-4 rounded-lg font-medium hover:bg-terracotta/90 transition-colors" type="submit">Publicar ressenya</button>
                            </form>
                        </div>
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
            <p class="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">Font: Open-Meteo API • Dades actualitzades en temps real</p>
        </div>
    </div>`;
}

// ── Galeria Modal ────────────────────────────────────────────

function renderGalleryImages(craft) {
    if (!craft) return '';

    // Imatges de la galeria
    let html = `
        <div class="sm:col-span-2 md:col-span-3 mb-2">
            <h4 class="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><span class="material-symbols-outlined text-sm">photo_library</span> Imatges (${craft.galeria.length + 1})</h4>
        </div>`;

    html += craft.galeria.map(g => `
        <div class="relative group/gal rounded-xl overflow-hidden shadow-lg border border-white/10 cursor-pointer">
            <img src="${g.imatge}" class="w-full h-64 object-cover group-hover/gal:scale-110 transition-transform duration-700 img-optimized" alt="${g.titol}" loading="lazy" decoding="async" onerror="handleImageError(this)">
            <div class="absolute inset-0 bg-black/0 group-hover/gal:bg-black/30 transition-colors duration-300 flex items-end">
                <div class="p-3 w-full translate-y-full group-hover/gal:translate-y-0 transition-transform duration-300">
                    <p class="text-white text-sm font-bold drop-shadow-lg">${g.titol}</p>
                    <p class="text-white/70 text-xs">${g.subtitol}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Imatge principal
    html += `
        <div class="relative group/gal rounded-xl overflow-hidden shadow-lg border border-white/10 cursor-pointer sm:col-span-2 md:col-span-3 aspect-[21/9]">
            <img src="${craft.imatge}" class="w-full h-full object-cover group-hover/gal:scale-105 transition-transform duration-700 img-optimized" alt="${craft.nom}" loading="lazy" decoding="async" onerror="handleImageError(this)">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div class="p-6"><p class="text-white text-lg font-serif font-bold">${craft.nom}</p></div>
            </div>
        </div>`;

    // Secció Vídeo placeholder
    html += `
        <div class="sm:col-span-2 md:col-span-3 mt-4 mb-2">
            <h4 class="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><span class="material-symbols-outlined text-sm">videocam</span> Vídeo</h4>
        </div>
        <div class="sm:col-span-2 md:col-span-3 relative rounded-xl overflow-hidden bg-slate-800 border border-white/10 aspect-video cursor-pointer group/vid" onclick="showToast('Reproducció de vídeo pròximament disponible', 'info', 'videocam')">
            <img src="${craft.videoThumb || craft.imatge}" class="w-full h-full object-cover opacity-60 group-hover/vid:opacity-80 group-hover/vid:scale-105 transition-all duration-500 img-optimized" alt="Vídeo" loading="lazy" decoding="async" onerror="handleImageError(this)">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover/vid:scale-110 group-hover/vid:bg-primary/40 transition-all duration-300">
                    <span class="material-symbols-outlined text-white text-4xl ml-1">play_arrow</span>
                </div>
            </div>
            <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p class="text-white font-bold text-sm">Procés artesanal: ${craft.nom}</p>
                <p class="text-white/60 text-xs">Durada: 2:23</p>
            </div>
        </div>`;

    // Secció Àudio placeholder
    html += `
        <div class="sm:col-span-2 md:col-span-3 mt-4 mb-2">
            <h4 class="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><span class="material-symbols-outlined text-sm">headphones</span> Àudio</h4>
        </div>
        <div class="sm:col-span-2 md:col-span-3 bg-slate-800/80 border border-white/10 rounded-xl p-5 flex items-center gap-4 cursor-pointer group/aud hover:bg-slate-700/80 transition-colors" onclick="showToast('Reproducció d\'àudio pròximament disponible', 'info', 'headphones')">
            <button class="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center shrink-0 group-hover/aud:bg-primary/30 transition-colors border border-white/20">
                <span class="material-symbols-outlined text-white text-2xl">play_arrow</span>
            </button>
            <div class="flex-1">
                <p class="text-white font-bold text-sm">Sons de l'ofici: ${craft.nom}</p>
                <p class="text-white/50 text-xs mb-2">Durada: 4:15</p>
                <div class="w-full bg-white/10 rounded-full h-1.5">
                    <div class="bg-primary h-1.5 rounded-full w-0 group-hover/aud:w-1/4 transition-all duration-1000"></div>
                </div>
            </div>
            <span class="text-white/40 text-xs font-mono">0:00 / 4:15</span>
        </div>`;

    return html;
}

// ── Xat IA ───────────────────────────────────────────────────

function renderChatMessages(messages) {
    return messages.map(msg => {
        if (msg.role === 'user') {
            return `
            <div class="flex items-start gap-2 flex-row-reverse shrink-0">
                <div class="w-8 h-8 rounded-full bg-terracotta shrink-0 flex items-center justify-center"><span class="material-symbols-outlined text-[16px] text-white">person</span></div>
                <div class="bg-terracotta text-white p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] overflow-x-auto break-words"><p class="text-sm font-medium">${msg.text}</p></div>
            </div>`;
        }
        const content = msg.html || `<p class="text-sm text-slate-700 dark:text-slate-300">${msg.text}</p>`;
        return `
        <div class="flex items-start gap-2 shrink-0">
            <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center"><span class="material-symbols-outlined text-[16px] text-slate-600 dark:text-slate-400" style="font-variation-settings: 'FILL' 1">smart_toy</span></div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm max-w-[85%] overflow-x-auto break-words">${content}</div>
        </div>`;
    }).join('');
}
