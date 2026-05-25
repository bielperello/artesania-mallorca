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

    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    let authBtnHtml = '';
    let mobileAuthHtml = '';

    if (user) {
        const initial = user.nickname ? user.nickname.charAt(0).toUpperCase() : 'U';
        authBtnHtml = `
                <div class="relative group">
                    <button class="flex items-center justify-center rounded-full size-10 bg-primary text-white text-base font-bold shadow-md hover:scale-105 transition-transform cursor-pointer" id="header-user-btn" aria-label="Perfil d'usuari: ${user.nickname}" title="${user.nickname}">
                        ${initial}
                    </button>
                    <!-- Dropdown Menu -->
                    <div class="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 py-2 hidden group-hover:block transition-all z-[60] origin-top-right before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                        <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Sessió iniciada</p>
                            <p class="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">${user.nickname}</p>
                        </div>
                        <button onclick="logoutUser()" class="w-full text-left px-4 py-2 text-sm text-red-650 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 font-semibold cursor-pointer">
                            <span class="material-symbols-outlined text-[18px]">logout</span> Tancar sessió
                        </button>
                    </div>
                </div>`;

        mobileAuthHtml = `
                <div class="flex flex-col gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
                    <p class="text-xs text-slate-500 dark:text-slate-400 px-2">Sessió com a <strong class="text-slate-800 dark:text-slate-250 font-bold">${user.nickname}</strong></p>
                    <button onclick="toggleMobileMenu(); logoutUser();" class="flex items-center gap-3 px-2 py-2 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer w-full text-left">
                        <span class="material-symbols-outlined text-[18px]">logout</span> Tancar sessió
                    </button>
                </div>`;
    } else {
        authBtnHtml = `
                <button onclick="openAuthModal()" class="flex items-center justify-center rounded-lg size-10 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" aria-label="Iniciar sessió" title="Iniciar sessió">
                    <span class="material-symbols-outlined">person</span>
                </button>`;

        mobileAuthHtml = `
                <button onclick="toggleMobileMenu(); openAuthModal();" class="flex items-center justify-center gap-2 rounded-lg h-12 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer w-full">
                    <span class="material-symbols-outlined">person</span> Iniciar sessió / Registrar-se
                </button>`;
    }

    return `
    <header class="sticky top-0 z-50 border-b border-solid border-slate-200 dark:border-slate-800 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur">
        <div class="flex items-center justify-between px-4 md:px-10 py-1">
            <!-- Branding -->
            <a href="#inici" aria-label="Anar a l'inici d'Artesania Mallorquina" class="flex items-center gap-3 text-primary hover:opacity-90 transition-opacity">
                ${createResponsiveImage({ src: './media/images/logo/logo.jpg', alt: 'Logo Artesania Mallorquina', sizes: 'avatar', lazy: false, srcset: { avif: './media/images/logo/logo.avif', webp: './media/images/logo/logo.webp' }, className: 'h-14 w-14 rounded-lg object-cover shadow-sm' })}
                <span class="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-serif font-bold leading-tight tracking-[-0.015em]">
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

                ${authBtnHtml}

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
                
                <a onclick="toggleMobileMenu()" class="flex items-center justify-center rounded-lg h-12 bg-primary hover:bg-primary/80 transition-colors text-white text-base font-bold sm:hidden mb-2" href="#cataleg">
                    Explora el catàleg
                </a>

                ${mobileAuthHtml}
            </nav>
        </div>
    </header>`;
}

function renderHero() {
    return `
    <section class="@container mb-16 px-10 py-8 lg:px-20 max-w-[1400px] mx-auto">
        <div class="flex min-h-[400px] flex-col gap-6 rounded-xl items-start justify-center px-8 pb-12 shadow-lg relative overflow-hidden">
            ${createResponsiveImage({ src: './media/images/hero/hero-01.jpg', alt: '', sizes: 'hero', lazy: false, srcset: { avif: './media/images/hero/hero-01.avif', webp: './media/images/hero/hero-01.webp' }, className: 'absolute inset-0 w-full h-full object-cover z-0' })}
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-[1]"></div>
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
                <img src="./media/images/logo.png" alt="" aria-hidden="true" role="presentation" loading="lazy" decoding="async" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[60%] lg:w-[85%] max-w-[600px] h-auto object-contain opacity-[0.06] dark:opacity-5 pointer-events-none select-none"/>
                <div class="relative z-10">
                    <span class="text-primary font-bold uppercase tracking-wider text-xs mb-4 block">Sobre Nosaltres</span>
                    <h2 class="text-slate-900 dark:text-slate-100 text-4xl font-serif font-bold leading-tight mb-6">Preservar la memòria de les nostres mans.</h2>
                    <div class="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed font-light text-lg">
                        <p>L'artesania a les Illes Balears no és només una manera de crear objectes; és el llegat silenciós de centenars d'anys d'adaptació al medi, de diàleg amb la terra, l'argila, la fusta i la mar.</p>
                        <p>La nostra missió és documentar, protegir i difondre el treball dels mestres artesans que encara avui mantenen vives tècniques ancestrals com el siurell, el bufat de vidre o la llatra.</p>
                        <p>Aquest espai neix per connectar el passat amb les noves generacions, valorant la lentitud, el detall i la bellesa de l'imperfet en un món cada cop més accelerat.</p>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-1/2 relative">
                <figure class="relative z-10">
                    <div class="aspect-[4/5] overflow-hidden rounded-lg shadow-xl mb-3">
                        ${createResponsiveImage({ src: './media/images/about/about-01.jpg', alt: 'Artesana de Siurells de Ca Mado Bet al seu taller', sizes: 'card', lazy: true, srcset: { avif: './media/images/about/about-01.avif', webp: './media/images/about/about-01.webp' }, className: 'w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700' })}
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
                <div class="flex justify-center mt-8 gap-3" id="catalog-load-controls">
                    <button id="load-more-crafts-btn" class="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-bold transition-colors flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">expand_more</span>Carregar més artesanies
                    </button>
                    <button id="show-less-crafts-btn" class="hidden px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold transition-colors flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">expand_less</span>Mostrar menys
                    </button>
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
            <h2 class="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Multimèdia Immersiva i Visual</h2>
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
                ${createResponsiveImage({ src: './media/images/logo/logo.jpg', alt: 'Logo Artesania Mallorquina', sizes: 'avatar', lazy: false, srcset: { avif: './media/images/logo/logo.avif', webp: './media/images/logo/logo.webp' }, className: 'h-9 w-9 rounded-lg object-cover opacity-90' })}
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
                    <button aria-label="Compartir" onclick="shareCraft()" class="flex items-center justify-center rounded-full size-10 bg-sand/30 hover:bg-sand/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors" title="Compartir">
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

    <!-- Photo Gallery Modal (Galeria de fotos de la secció Multimèdia) -->
    <div id="photo-gallery-modal" class="fixed inset-0 z-[350] hidden items-center justify-center bg-black/90 backdrop-blur-md opacity-0 transition-opacity duration-300 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="photo-gallery-title">
        <div id="photo-gallery-content" class="w-full max-w-5xl max-h-[92vh] flex flex-col transform scale-95 transition-transform duration-300">
            <!-- Capçalera -->
            <div class="flex items-center justify-between mb-5">
                <h2 id="photo-gallery-title" class="text-2xl font-serif font-bold text-white">Galeria</h2>
                <button onclick="closePhotoGallery()" aria-label="Tancar galeria de fotos" class="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-all">
                    <span class="material-symbols-outlined text-2xl">close</span>
                </button>
            </div>
            <!-- Graella de fotos (adaptable per a més imatges) -->
            <div id="photo-gallery-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto pr-1 pb-4" style="max-height: calc(92vh - 80px);">
                <!-- JS openPhotoGallery() -->
            </div>
        </div>
    </div>

    <!-- Gallery Modal (fitxa artesania) -->
    <div id="gallery-modal" class="fixed inset-0 z-[300] hidden items-center justify-center bg-black/95 backdrop-blur-md opacity-0 transition-opacity duration-300 p-4 sm:p-8">
        <button onclick="closeGalleryModal()" class="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-all z-50 flex items-center justify-center cursor-pointer">
            <span class="material-symbols-outlined text-3xl">close</span>
        </button>
        <div id="gallery-content" class="w-full max-w-4xl max-h-full flex flex-col transform scale-95 transition-transform duration-300 mt-2 relative select-none">
            <h3 id="gallery-title" class="text-2xl font-serif font-bold text-white mb-6 text-center">Tota la Galeria</h3>
            <div id="gallery-grid" class="w-full flex flex-col relative">
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
    </div>
    
    <!-- Auth Modal (Login / Registre) -->
    <div id="auth-modal" class="fixed inset-0 z-[400] hidden items-center justify-center bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 p-4 font-sans">
        <div id="auth-modal-content" class="bg-white dark:bg-slate-900 w-full max-w-md overflow-hidden rounded-2xl shadow-2xl flex flex-col relative transform scale-95 transition-transform duration-300 border border-slate-100 dark:border-slate-800">
            <!-- Modal Header -->
            <header class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary text-2xl font-bold">lock</span>
                    <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif">Compte d'Usuari</h2>
                </div>
                <button onclick="closeAuthModal()" class="flex items-center justify-center rounded-full flex-shrink-0 w-10 h-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer border border-transparent">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </header>
            
            <!-- Tabs -->
            <div class="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <button onclick="switchAuthTab('login')" id="tab-btn-login" class="flex-1 py-3 text-sm font-bold border-b-2 border-primary text-primary transition-colors cursor-pointer">Iniciar Sessió</button>
                <button onclick="switchAuthTab('register')" id="tab-btn-register" class="flex-1 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350 transition-colors cursor-pointer">Crear Compte</button>
            </div>
            
            <!-- Body -->
            <div class="p-6">
                <!-- Login Form -->
                <form id="auth-form-login" onsubmit="handleAuthLogin(event)" class="flex flex-col gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1" for="login-email">Correu Electrònic</label>
                        <input type="email" id="login-email" required placeholder="elteucorreu@exemple.com" class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-primary focus:ring-primary py-2.5 px-4 shadow-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1" for="login-password">Contrasenya</label>
                        <input type="password" id="login-password" required placeholder="••••••••" class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-primary focus:ring-primary py-2.5 px-4 shadow-sm">
                    </div>
                    <div id="login-error-msg" class="text-red-500 text-base font-semibold hidden"></div>
                    <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer border border-transparent">
                        <span class="material-symbols-outlined text-[18px]">login</span> Entra
                    </button>
                </form>
                
                <!-- Register Form -->
                <form id="auth-form-register" onsubmit="handleAuthRegister(event)" class="flex flex-col gap-4 hidden">
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1" for="register-nick">Nick / Nom d'usuari</label>
                        <input type="text" id="register-nick" required placeholder="Biel Perelló" class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-primary focus:ring-primary py-2.5 px-4 shadow-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1" for="register-email">Correu Electrònic</label>
                        <input type="email" id="register-email" required placeholder="elteucorreu@exemple.com" class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-primary focus:ring-primary py-2.5 px-4 shadow-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1" for="register-password">Contrasenya</label>
                        <input type="password" id="register-password" required placeholder="Min. 6 caràcters" minlength="6" class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-primary focus:ring-primary py-2.5 px-4 shadow-sm">
                    </div>
                    <div id="register-error-msg" class="text-red-500 text-xs font-semibold hidden"></div>
                    <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer border border-transparent">
                        <span class="material-symbols-outlined text-[18px]">person_add</span> Registrar-se i Entrar
                    </button>
                </form>
            </div>
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
                ${createResponsiveImage({ src: c.imatge, alt: c.nom, sizes: 'card', lazy: true, srcset: localSrcset(c.imatge), className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' })}
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
    return tallers.map(t => {
        const distLabel = t.distanciaKm != null
            ? `${t.distanciaKm.toFixed(1)} km`
            : `<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[11px] animate-spin">progress_activity</span> Calculant...</span>`;
        return `
        <div class="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div class="flex-1 min-w-0 mr-2">
                <p class="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">${t.nom}</p>
                <p class="text-[10px] text-slate-500 truncate">${t.adreca || ''}</p>
                <div class="flex items-center gap-1 mt-1 font-bold text-blue-600 text-[10px]">
                    <span class="material-symbols-outlined text-[12px]">directions_car</span> ${distLabel}
                </div>
            </div>
            <a href="https://maps.google.com/?q=${t.mapsQuery || encodeURIComponent(t.nom)}" target="_blank" class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 p-1.5 rounded-md hover:bg-blue-100 transition-colors flex-shrink-0">
                <span class="material-symbols-outlined text-[16px]">directions</span>
            </a>
        </div>`;
    }).join('');
}

function renderGeoCalculating() {
    return `
    <div class="flex items-center justify-center gap-2 py-3 text-blue-600 dark:text-blue-400">
        <span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
        <span class="text-xs font-semibold">Calculant tallers propers...</span>
    </div>`;
}

// ── Multimèdia ───────────────────────────────────────────────

function renderMultimediaGrid(items) {
    let html = '<div class="grain-overlay z-10"></div>';

    items.forEach((item, idx) => {
        const itemId = `mm-${idx}`;
        if (item.tipus === 'video-hero') {
            const miniatura = './media/images/ceramica/ceramica-ca-na-mel-1.jpg';
            html += `
            <div class="col-span-1 md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer shadow-2xl z-20" onclick="openVideoGallery('${item.titol.replace(/'/g, "\\'")}', './media/videos/resultado.mp4', '${miniatura}')">
                <video
                    id="video-${itemId}"
                    class="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 pointer-events-none"
                    poster="${miniatura}"
                    preload="metadata"
                    playsinline
                    aria-label="${item.titol}"
                >
                    <source src="./media/videos/ca_na_mel.mp4" type="video/mp4">
                </video>
                <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10 pointer-events-none"></div>
                <div class="absolute inset-0 flex items-center justify-center z-20 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                    <div class="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <span class="material-symbols-outlined text-white text-6xl drop-shadow-lg">play_arrow</span>
                    </div>
                </div>
                <div class="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
                    <span class="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">${item.tag}</span>
                    <h3 class="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-md leading-tight group-hover:-translate-y-2 transition-transform duration-500">${item.titol}</h3>
                </div>
            </div>`;
        } else if (item.tipus === 'galeria') {
            // Serialitzem les fotos de forma segura per passar-les a l'onclick
            const fotosJson = item.fotos ? JSON.stringify(item.fotos).replace(/'/g, "&#39;").replace(/"/g, '&quot;') : '[]';
            const coverSrc = item.img || '';
            const coverSrcset = item.imgAvif || item.imgWebp
                ? `{ avif: '${item.imgAvif || ''}', webp: '${item.imgWebp || ''}' }`
                : '{}';
            html += `
            <div class="col-span-1 md:col-span-1 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer shadow-lg z-20 flex-1 flex flex-col" onclick="openPhotoGallery('${item.titol}', this)" data-fotos="${fotosJson}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <picture class="absolute inset-0 w-full h-full">
                    ${item.imgAvif ? `<source srcset="${item.imgAvif}" type="image/avif">` : ''}
                    ${item.imgWebp ? `<source srcset="${item.imgWebp}" type="image/webp">` : ''}
                    <img src="${item.img}" alt="${item.titol}" loading="lazy" class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">
                </picture>
                <div class="absolute inset-0 z-20 p-6 flex flex-col justify-end opacity-90 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="material-symbols-outlined text-white text-xl">photo_library</span>
                        <span class="text-white text-xs font-bold uppercase tracking-wider">Galeria &bull; ${item.fotos ? item.fotos.length + ' fotos' : ''}</span>
                    </div>
                    <h4 class="text-2xl font-serif font-bold text-white">${item.titol}</h4>
                </div>
            </div>`;
        } else if (item.tipus === 'serie') {
            const slides = item.slides || [];
            const slidesJson = item.slides ? JSON.stringify(item.slides).replace(/'/g, "&#39;").replace(/"/g, '&quot;') : '[]';
            const serieId = `serie-${idx}`;
            // Generar les diapositives (superposades, totes absolutes)
            const slidesHTML = slides.map((s, si) => `
                <div class="serie-slide absolute inset-0 transition-opacity duration-700 ${si === 0 ? 'opacity-100' : 'opacity-0'}" data-index="${si}" aria-hidden="${si !== 0}">
                    <picture class="absolute inset-0 w-full h-full">
                        ${s.avif ? `<source srcset="${s.avif}" type="image/avif">` : ''}
                        ${s.webp ? `<source srcset="${s.webp}" type="image/webp">` : ''}
                        <img src="${s.img}" alt="${s.titol}" loading="${si === 0 ? 'eager' : 'lazy'}" class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                    </picture>
                    <!-- Gradient + text -->
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90 z-10"></div>
                    <div class="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 class="text-2xl font-serif font-bold text-white mb-1">${s.titol}</h4>
                        <p class="text-slate-300 text-sm line-clamp-2 mb-4 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 delay-100">${s.subtitol || ''}</p>
                    </div>
                </div>`
            ).join('');

            // Dots de progrés
            const dotsHTML = slides.map((_, si) =>
                `<div class="serie-dot h-1 flex-1 rounded-full transition-all duration-500 ${si === 0 ? 'bg-white' : 'bg-white/30'}" data-index="${si}"></div>`
            ).join('');

            html += `
            <div id="${serieId}" class="col-span-1 md:col-span-1 md:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer shadow-lg z-20" aria-roledescription="carrussel" aria-label="${item.titol}" onclick="openSeriesGallery('${item.titol.replace(/'/g, "\\'")}', this)" data-slides="${slidesJson}">
                <!-- Badge Lliu EN VENDA / Sèrie -->
                <div class="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 border border-white/10">
                    <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span class="text-white text-xs font-bold uppercase">Sèrie</span>
                </div>
                <!-- Diapositives -->
                ${slidesHTML}
                <!-- Dots a baix de tot -->
                <div class="absolute bottom-4 left-6 right-6 z-30 flex gap-1">${dotsHTML}</div>
            </div>`;

        } else if (item.tipus === 'audio') {
            // ── Àudio natiu: <audio> amb preload="none" i controls personalitzats ──
            // Src pendent d'inserir l'URL definitiu del fitxer MP3/OGG
            html += `
            <div class="col-span-1 md:col-span-1 md:row-span-1 relative rounded-xl overflow-hidden group shadow-lg z-20 bg-slate-800">
                ${createResponsiveImage({ src: item.img, alt: '', sizes: 'thumbnail', lazy: true, srcset: localSrcset(item.img), className: 'absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700' })}
                <div class="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/80 z-10"></div>
                <div class="relative z-20 h-full p-6 flex flex-col items-center justify-center text-center">
                    <span class="text-primary text-xs font-bold uppercase tracking-widest mb-4">Sons de l'ofici</span>
                    <audio
                        id="audio-${itemId}"
                        preload="metadata"
                        aria-label="${item.titol}"
                        class="hidden"
                        onloadedmetadata="(function(aud){
                            const p = aud.closest('div').querySelector('.audio-duration');
                            if(!p) return;
                            const mins = Math.floor(aud.duration / 60);
                            const secs = Math.floor(aud.duration % 60).toString().padStart(2, '0');
                            p.textContent = mins + ':' + secs;
                        })(this)"
                        ontimeupdate="(function(aud){
                            const p = aud.closest('div').querySelector('.audio-current-time');
                            if(!p) return;
                            const mins = Math.floor(aud.currentTime / 60);
                            const secs = Math.floor(aud.currentTime % 60).toString().padStart(2, '0');
                            p.textContent = mins + ':' + secs;
                        })(this)"
                        onplay="(function(aud){
                            const waves = aud.closest('div').querySelectorAll('.audio-wave');
                            waves.forEach(w => w.style.animationPlayState = 'running');
                        })(this)"
                        onpause="(function(aud){
                            const waves = aud.closest('div').querySelectorAll('.audio-wave');
                            waves.forEach(w => w.style.animationPlayState = 'paused');
                        })(this)"
                        onended="(function(aud){
                            const btn = aud.closest('div').querySelector('button');
                            if(btn) btn.querySelector('.material-symbols-outlined').textContent='play_arrow';
                            const p = aud.closest('div').querySelector('.audio-current-time');
                            if(p) p.textContent = '0:00';
                            const waves = aud.closest('div').querySelectorAll('.audio-wave');
                            waves.forEach(w => w.style.animationPlayState = 'paused');
                        })(this)"
                    >
                        <source src="./media/audio/Teler-mejorada-v2.mp3" type="audio/mpeg">
                    </audio>
                    <button
                        onclick="(function(btn){
                            const aud = document.getElementById('audio-${itemId}');
                            if(!aud) return;
                            if(aud.paused){
                                aud.play();
                                btn.querySelector('.material-symbols-outlined').textContent='pause';
                            } else {
                                aud.pause();
                                btn.querySelector('.material-symbols-outlined').textContent='play_arrow';
                            }
                        })(this)"
                        aria-label="Reproduir ${item.titol}"
                        class="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-900 hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4 relative cursor-pointer"
                    >
                        <span class="absolute inset-0 rounded-full border border-white animate-ping opacity-20"></span>
                        <span class="material-symbols-outlined text-4xl ml-1">play_arrow</span>
                    </button>
                    <h4 class="text-xl font-serif font-bold text-white mb-1">${item.titol}</h4>
                    <p class="text-slate-400 text-sm">
                        <span class="audio-current-time font-medium">0:00</span> / <span class="audio-duration font-medium">${item.durada || '0:00'}</span>
                    </p>
                    <div class="w-full flex items-center justify-center gap-1 h-8 mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <div class="audio-wave w-1 bg-primary rounded-full h-2 animate-[pulse_1s_ease-in-out_infinite]" style="animation-play-state: paused;"></div>
                        <div class="audio-wave w-1 bg-primary rounded-full h-5 animate-[pulse_1.2s_ease-in-out_infinite_0.1s]" style="animation-play-state: paused;"></div>
                        <div class="audio-wave w-1 bg-primary rounded-full h-3 animate-[pulse_0.8s_ease-in-out_infinite_0.2s]" style="animation-play-state: paused;"></div>
                        <div class="audio-wave w-1 bg-primary rounded-full h-8 animate-[pulse_1.5s_ease-in-out_infinite_0.3s]" style="animation-play-state: paused;"></div>
                        <div class="audio-wave w-1 bg-primary rounded-full h-4 animate-[pulse_1.1s_ease-in-out_infinite_0.4s]" style="animation-play-state: paused;"></div>
                        <div class="audio-wave w-1 bg-primary rounded-full h-6 animate-[pulse_0.9s_ease-in-out_infinite_0.5s]" style="animation-play-state: paused;"></div>
                        <div class="audio-wave w-1 bg-primary rounded-full h-2 animate-[pulse_1.3s_ease-in-out_infinite_0.6s]" style="animation-play-state: paused;"></div>
                    </div>
                </div>
            </div>`;
        }
    });
    return html;
}

// ── Ressenyes Llista Renderització ───────────────────────────
function renderReviewsList(ressenyes) {
    if (!ressenyes || ressenyes.length === 0) {
        return `<p class="text-slate-500 dark:text-slate-400 text-center py-6">No hi ha ressenyes encara. Sigues el primer a valorar!</p>`;
    }
    return ressenyes.map(r => {
        const imatgesHTML = r.imatges && r.imatges.length ? `<div class="flex gap-2">${r.imatges.map(img => `<div class="w-20 h-20 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative">${createResponsiveImage({ src: img, alt: 'Foto de la ressenya', sizes: 'thumbnail', lazy: true, className: 'absolute inset-0 w-full h-full object-cover' })}</div>`).join('')}</div>` : '';
        return `
        <div class="border-b border-slate-200 dark:border-slate-800 pb-6 last:border-0">
            <div class="flex items-start justify-between mb-2">
                <div>
                    <h5 class="font-bold text-slate-900 dark:text-slate-100">${r.autor}</h5>
                    <p class="text-sm text-slate-500 dark:text-slate-400">${r.data}</p>
                </div>
                <div class="flex text-yellow-400 text-sm">${renderStars(r.rating)}</div>
            </div>
            <p class="text-slate-700 dark:text-slate-300 ${r.imatges && r.imatges.length ? 'mb-4' : ''}">${r.text}</p>
            ${imatgesHTML}
        </div>`;
    }).join('');
}

// ── Fitxa Detallada (Modal) ──────────────────────────────────

// ── Vídeo YouTube per a la Fitxa Detallada ──────────────────
// Mapa de craft.id → YouTube Video ID
const CRAFT_YOUTUBE_VIDEOS = {
    'siurells': 'GJvarb-kEtw',  // Documental siurells mallorquins
    'vidre-bufat': '43vY6sS21Es',  // Procés de vidre bufat
    'roba-llengues': 'NDmbuo_DGZI',  // Tela de llengües tradicional
    'llatra': 'AmZIiSisR1s',  // Art de la llata (margalló)
};

/**
 * Retorna un iframe de YouTube responsive i accessible per a la fitxa detallada.
 * Si l'artesania no té vídeo associat, mostra la imatge hero de l'artesania.
 * @param {Object} craft - Dades de l'artesania
 * @returns {string} HTML de l'iframe o imatge de fallback
 */
function renderCraftVideo(craft) {
    const videoId = CRAFT_YOUTUBE_VIDEOS[craft.id];

    if (videoId) {
        // Paràmetres YouTube:
        //   rel=0           → no mostrar vídeos relacionats d'altres canals al final
        //   modestbranding=1 → logotip de YouTube discret
        //   autoplay=0      → sense reproducció automàtica (UX + accessibilitat)
        const src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`;
        return `<iframe
            class="w-full h-full"
            src="${src}"
            title="Vídeo documental sobre el procés artesanal de: ${craft.nom}"
            loading="lazy"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
        ></iframe>`;
    }

    // Fallback per a artesanies sense vídeo de YouTube: imatge hero amb overlay
    return `
        <div class="relative w-full h-full">
            ${createResponsiveImage({
        src: craft.imatge,
        alt: `Imatge representativa de l'artesania: ${craft.nom}`,
        sizes: 'card',
        lazy: true,
        srcset: localSrcset(craft.imatge),
        className: 'absolute inset-0 w-full h-full object-cover'
    })}
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-5">
                <div class="flex items-center gap-2 text-white/80">
                    <span class="material-symbols-outlined text-sm">photo_camera</span>
                    <span class="text-xs font-medium">${craft.nom} — Artesania Mallorquina</span>
                </div>
            </div>
        </div>`;
}

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

    // Galeria (background-image → img absoluta via helper)
    const galeriaHTML = craft.galeria.map(g => `
        <div class="flex flex-col gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 shadow-sm">
            <div class="w-full aspect-square rounded-lg overflow-hidden relative">
                ${createResponsiveImage({ src: g.imatge, alt: g.titol, sizes: 'thumbnail', lazy: true, srcset: localSrcset(g.imatge), className: 'absolute inset-0 w-full h-full object-cover' })}
            </div>
            <div class="px-2 pb-1">
                <p class="text-slate-900 dark:text-slate-100 text-sm font-bold">${g.titol}</p>
                <p class="text-slate-500 dark:text-slate-400 text-xs">${g.subtitol}</p>
            </div>
        </div>
    `).join('');

    // Artesans
    const artesansHTML = craft.artesans.map(a => `
        <div class="flex flex-col min-w-[280px] w-[280px] bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 snap-center cursor-pointer group/artisan hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-500">
            <h4 class="font-display font-bold text-xl text-slate-900 dark:text-slate-100 text-center mb-1 group-hover/artisan:text-primary transition-colors duration-300">${a.nom}</h4>
            <div class="flex justify-center items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                <span>${a.dates}</span><span>•</span><span>${a.lloc}</span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 text-center flex-1">${a.bio}</p>
        </div>
    `).join('');

    // Ressenyes
    const currentLimit = (typeof currentReviewsLimit !== 'undefined') ? currentReviewsLimit : 3;
    const ressenyesHTML = renderReviewsList(craft.ressenyes.slice(0, currentLimit));

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
            <!-- Vídeo YouTube incrustat: responsive, accessible i amb lazy loading -->
            <div class="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-slate-900">
                ${renderCraftVideo(craft)}
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
                            ${(() => {
            const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
            if (user) {
                return `
                                        <h4 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 font-display">Escriu una valoració</h4>
                                        <form id="review-form" onsubmit="handleReviewSubmit(event, '${craft.id}')" class="flex flex-col gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" for="review-name">Nom i Llinatges</label>
                                                <input class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow-sm cursor-not-allowed" id="review-name" value="${user.nickname}" type="text" readonly required/>
                                            </div>
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
                                            <button class="mt-2 bg-terracotta text-white py-2 px-4 rounded-lg font-medium hover:bg-terracotta/90 transition-colors cursor-pointer" type="submit">Publicar ressenya</button>
                                        </form>
                                    `;
            } else {
                return `
                                        <div class="bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
                                            <span class="material-symbols-outlined text-slate-400 dark:text-slate-500 text-4xl mb-3">rate_review</span>
                                            <h5 class="font-display font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">Vols valorar aquesta artesania?</h5>
                                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-5">Inicia sessió o crea un compte per poder valorar la teva experiència amb els tallers i mestres artesans.</p>
                                            <button onclick="openAuthModal()" class="mx-auto bg-terracotta hover:bg-terracotta/90 text-white font-bold py-2 px-6 rounded-lg text-sm transition-all cursor-pointer shadow-md hover:scale-[1.02] flex items-center justify-center gap-2">
                                                <span class="material-symbols-outlined text-[18px]">login</span> Inicia Sessió
                                            </button>
                                        </div>
                                    `;
            }
        })()}
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-2 flex flex-col gap-6">
                    <div class="flex items-center justify-between">
                        <h4 class="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">${craft.numRatings} Valoracions</h4>
                        <select id="review-sort-select" onchange="handleReviewSortChange(this.value, '${craft.id}')" class="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm focus:border-terracotta focus:ring-terracotta text-sm">
                            <option value="recents" ${(typeof currentReviewSort !== 'undefined' && currentReviewSort === 'recents') ? 'selected' : ''}>Més recents</option>
                            <option value="antigues" ${(typeof currentReviewSort !== 'undefined' && currentReviewSort === 'antigues') ? 'selected' : ''}>Més antigues</option>
                            <option value="millor" ${(typeof currentReviewSort !== 'undefined' && currentReviewSort === 'millor') ? 'selected' : ''}>Millor valoració</option>
                            <option value="pitjor" ${(typeof currentReviewSort !== 'undefined' && currentReviewSort === 'pitjor') ? 'selected' : ''}>Pitjor valoració</option>
                        </select>
                    </div>
                    <div id="reviews-list-container" class="flex flex-col gap-6">${ressenyesHTML}</div>
                    <button id="load-more-reviews-btn" onclick="handleLoadMoreReviews('${craft.id}')" class="text-terracotta font-medium hover:underline self-center mt-4 ${craft.ressenyes.length <= currentLimit ? 'hidden' : ''}">Carregar més ressenyes</button>
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
        <div class="relative w-full h-48 rounded-2xl overflow-hidden flex items-end p-6">
            ${createResponsiveImage({ src: 'https://images.unsplash.com/photo-1543884879-66c878b2d187?auto=format&fit=crop&w=1000&q=80', alt: '', sizes: 'hero', lazy: true, className: 'absolute inset-0 w-full h-full object-cover' })}
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

    const totalImageSlides = 1 + craft.galeria.length;

    let html = `
    <!-- Contenidor del Slider amb fletxes -->
    <div class="relative w-full aspect-[4/3] md:aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-white/10 group/slider">
        <!-- Wrapper per lliscar horitzontalment -->
        <div id="gallery-slider-wrapper" class="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbars select-none">
            <!-- Slide 1: Imatge Principal -->
            <div class="gallery-slide w-full h-full shrink-0 snap-center relative flex items-center justify-center" data-slide-index="0">
                <picture class="w-full h-full flex items-center justify-center">
                    <source srcset="${localSrcset(craft.imatge)?.avif || ''}" type="image/avif">
                    <source srcset="${localSrcset(craft.imatge)?.webp || ''}" type="image/webp">
                    <img src="${craft.imatge}" alt="${craft.nom}" class="max-w-full max-h-full object-contain img-optimized img-loaded">
                </picture>
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 text-left">
                    <h4 class="text-white text-lg font-serif font-bold drop-shadow-lg">${craft.nom}</h4>
                    <p class="text-white/70 text-xs drop-shadow-md">Imatge principal</p>
                </div>
            </div>
            
            <!-- Slides de la Galeria -->
            ${craft.galeria.map((g, i) => `
            <div class="gallery-slide w-full h-full shrink-0 snap-center relative flex items-center justify-center" data-slide-index="${i + 1}">
                <picture class="w-full h-full flex items-center justify-center">
                    <source srcset="${localSrcset(g.imatge)?.avif || ''}" type="image/avif">
                    <source srcset="${localSrcset(g.imatge)?.webp || ''}" type="image/webp">
                    <img src="${g.imatge}" alt="${g.titol}" class="max-w-full max-h-full object-contain img-optimized" loading="lazy">
                </picture>
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 text-left">
                    <h4 class="text-white text-lg font-serif font-bold drop-shadow-lg">${g.titol}</h4>
                    <p class="text-white/70 text-xs drop-shadow-md">${g.subtitol || ''}</p>
                </div>
            </div>
            `).join('')}
        </div>
        
        <!-- Fletxa Esquerra -->
        <button id="gallery-prev-btn" onclick="slideGallery(-1)" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/15 hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/slider:opacity-100 focus:opacity-100" aria-label="Imatge anterior">
            <span class="material-symbols-outlined text-2xl">chevron_left</span>
        </button>
        
        <!-- Fletxa Dreta -->
        <button id="gallery-next-btn" onclick="slideGallery(1)" class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/15 hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/slider:opacity-100 focus:opacity-100" aria-label="Imatge següent">
            <span class="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
    </div>
    
    <!-- Controls inferiors -->
    <div class="flex flex-col items-center gap-3 mt-4">
        <div id="gallery-counter" class="text-white/60 text-sm font-medium tracking-wider">1 / ${totalImageSlides}</div>
        <div id="gallery-dots" class="flex gap-2 justify-center max-w-full overflow-x-auto py-1 hide-scrollbars">
            <span class="w-2.5 h-2.5 rounded-full bg-white/80 cursor-pointer transition-all duration-300 transform scale-110 active-dot" onclick="goToGallerySlide(0)"></span>
            ${craft.galeria.map((g, i) => `
                <span class="w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 cursor-pointer transition-all duration-300" onclick="goToGallerySlide(${i + 1})"></span>
            `).join('')}
        </div>
    </div>`;

    return html;
}

function renderSeriesGalleryImages(titol, slides) {
    if (!slides || slides.length === 0) return '';

    const totalImageSlides = slides.length;

    let html = `
    <!-- Contenidor del Slider amb fletxes -->
    <div class="relative w-full aspect-[4/3] md:aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-white/10 group/slider">
        <!-- Wrapper per lliscar horitzontalment -->
        <div id="gallery-slider-wrapper" class="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbars select-none">
            ${slides.map((s, i) => `
            <div class="gallery-slide w-full h-full shrink-0 snap-center relative flex items-center justify-center" data-slide-index="${i}">
                <picture class="w-full h-full flex items-center justify-center">
                    ${s.avif ? `<source srcset="${s.avif}" type="image/avif">` : ''}
                    ${s.webp ? `<source srcset="${s.webp}" type="image/webp">` : ''}
                    <img src="${s.img}" alt="${s.titol || titol}" class="max-w-full max-h-full object-contain img-optimized" loading="${i === 0 ? 'eager' : 'lazy'}">
                </picture>
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 text-left">
                    <h4 class="text-white text-lg font-serif font-bold drop-shadow-lg">${s.titol || titol}</h4>
                    <p class="text-white/70 text-xs drop-shadow-md">${s.subtitol || ''}</p>
                </div>
            </div>
            `).join('')}
        </div>
        
        <!-- Fletxa Esquerra -->
        <button id="gallery-prev-btn" onclick="slideGallery(-1)" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/15 hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/slider:opacity-100 focus:opacity-100" aria-label="Imatge anterior">
            <span class="material-symbols-outlined text-2xl">chevron_left</span>
        </button>
        
        <!-- Fletxa Dreta -->
        <button id="gallery-next-btn" onclick="slideGallery(1)" class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/15 hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/slider:opacity-100 focus:opacity-100" aria-label="Imatge següent">
            <span class="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
    </div>
    
    <!-- Controls inferiors -->
    <div class="flex flex-col items-center gap-3 mt-4">
        <div id="gallery-counter" class="text-white/60 text-sm font-medium tracking-wider">1 / ${totalImageSlides}</div>
        <div id="gallery-dots" class="flex gap-2 justify-center max-w-full overflow-x-auto py-1 hide-scrollbars">
            ${slides.map((s, i) => `
                <span class="w-2 h-2 rounded-full bg-white/${i === 0 ? '80' : '30'} hover:bg-white/50 cursor-pointer transition-all duration-300 ${i === 0 ? 'transform scale-110 active-dot' : ''}" onclick="goToGallerySlide(${i})"></span>
            `).join('')}
        </div>
    </div>`;

    return html;
}

function renderMixedGallery(titol, videoSrc, posterSrc, images) {
    if (!images) images = [];
    const totalSlides = 1 + images.length;

    let html = `
    <!-- Contenidor del Slider amb fletxes -->
    <div class="relative w-full aspect-[4/3] md:aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-white/10 group/slider">
        <!-- Wrapper per lliscar horitzontalment -->
        <div id="gallery-slider-wrapper" class="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbars select-none">
            <!-- Slide 0: El Vídeo -->
            <div class="gallery-slide w-full h-full shrink-0 snap-center relative flex items-center justify-center" data-slide-index="0">
                <video
                    class="w-full h-full object-contain animate-fade-in"
                    poster="${posterSrc || ''}"
                    controls
                    autoplay
                    playsinline
                    aria-label="${titol}"
                >
                    <source src="${videoSrc}" type="video/mp4">
                    El teu navegador no suporta la reproducció de vídeos.
                </video>
            </div>
            
            <!-- Slides 1 a N: Les Imatges de Ca Na Mel -->
            ${images.map((img, i) => {
        const srcset = localSrcset(img.src);
        return `
                <div class="gallery-slide w-full h-full shrink-0 snap-center relative flex items-center justify-center" data-slide-index="${i + 1}">
                    <picture class="w-full h-full flex items-center justify-center">
                        ${srcset?.avif ? `<source srcset="${srcset.avif}" type="image/avif">` : ''}
                        ${srcset?.webp ? `<source srcset="${srcset.webp}" type="image/webp">` : ''}
                        <img src="${img.src}" alt="${titol} — ${img.desc}" class="max-w-full max-h-full object-contain img-optimized" loading="lazy">
                    </picture>
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 text-left">
                        <p class="text-white text-sm font-medium drop-shadow-md">${img.desc}</p>
                    </div>
                </div>`;
    }).join('')}
        </div>
        
        <!-- Fletxa Esquerra -->
        <button id="gallery-prev-btn" onclick="slideGallery(-1)" class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/15 hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/slider:opacity-100 focus:opacity-100" aria-label="Imatge anterior">
            <span class="material-symbols-outlined text-2xl">chevron_left</span>
        </button>
        
        <!-- Fletxa Dreta -->
        <button id="gallery-next-btn" onclick="slideGallery(1)" class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/15 hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/slider:opacity-100 focus:opacity-100" aria-label="Imatge següent">
            <span class="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
    </div>
    
    <!-- Controls inferiors -->
    <div class="flex flex-col items-center gap-3 mt-4">
        <div id="gallery-counter" class="text-white/60 text-sm font-medium tracking-wider">1 / ${totalSlides}</div>
        <div id="gallery-dots" class="flex gap-2 justify-center max-w-full overflow-x-auto py-1 hide-scrollbars">
            <span class="w-2.5 h-2.5 rounded-full bg-white/80 cursor-pointer transition-all duration-300 transform scale-110 active-dot" onclick="goToGallerySlide(0)"></span>
            ${images.map((_, i) => `
                <span class="w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 cursor-pointer transition-all duration-300" onclick="goToGallerySlide(${i + 1})"></span>
            `).join('')}
        </div>
    </div>`;

    return html;
}

// ── Galeries d'Art Adjacents (JSON extern ArtGallery.json) ──────────────────

/**
 * Renderitza la secció de galeries d'art properes a partir del JSON extern ArtGallery.
 * S'injecta a renderCraftDetail, just sota el bloc Tallers+Mapa.
 * Les galeries amb subjectOf AudioObject mostren un <audio> natiu (preload="none").
 * Les galeries amb subjectOf VideoObject mostren un <video> natiu (preload="metadata").
 *
 * @param {Array} galleries - Array del @graph del fitxer ArtGallery.json
 * @returns {string} HTML de la secció de galeries
 */
function renderArtGalleries(galleries) {
    if (!galleries || galleries.length === 0) return '';

    const cardsHTML = galleries.map((g, idx) => {
        // Mapeig de dades schema.org → camps UI
        const name = g.name || 'Galeria d\'art';
        const description = g.description || '';
        const imageUrl = g.image || '';
        const gid = g['@id'] || `gallery-${idx}`;
        const lat = g.geo ? g.geo.latitude : null;
        const lng = g.geo ? g.geo.longitude : null;
        const mapsUrl = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : `https://maps.google.com/?q=${encodeURIComponent(name + ' Palma')}`;

        // Rating (si n'hi ha)
        const ratingHTML = g.aggregateRating ? `
            <div class="flex items-center gap-1 mt-1">
                <span class="material-symbols-outlined text-amber-400 text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">${g.aggregateRating.ratingValue}</span>
                <span class="text-xs text-slate-400">(${g.aggregateRating.reviewCount})</span>
            </div>` : '';

        // Característiques (amenityFeature)
        const featuresHTML = g.amenityFeature && g.amenityFeature.length > 0
            ? g.amenityFeature.filter(f => f.value).map(f =>
                `<span class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">${f.name}</span>`
            ).join('')
            : '';

        // Propietats addicionals (entrada, estil...)
        const propsHTML = g.additionalProperty && g.additionalProperty.length > 0
            ? g.additionalProperty.slice(0, 2).map(p =>
                `<span class="text-xs text-slate-500 dark:text-slate-400"><strong class="text-slate-700 dark:text-slate-300">${p.name}:</strong> ${p.value}</span>`
            ).join('<span class="text-slate-300 dark:text-slate-600 mx-1">·</span>')
            : '';

        // Media associada (subjectOf): AudioObject o VideoObject
        let mediaHTML = '';
        if (g.subjectOf && g.subjectOf.length > 0) {
            g.subjectOf.forEach((media, mIdx) => {
                const mediaId = `artgal-${gid}-media-${mIdx}`;
                if (media['@type'] === 'AudioObject' || media.encodingFormat === 'audio/mpeg') {
                    mediaHTML += `
                    <div class="mt-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 flex items-center gap-3">
                        <audio id="${mediaId}" preload="none" aria-label="${media.name || name}" class="hidden">
                            <source src="${media.contentUrl || ''}" type="audio/mpeg">
                        </audio>
                        <button
                            onclick="(function(btn){ const a = document.getElementById('${mediaId}'); if(!a) return; if(a.paused){ a.play(); btn.querySelector('span').textContent='pause'; } else { a.pause(); btn.querySelector('span').textContent='headphones'; } })(this)"
                            aria-label="Reproduir ${media.name || 'àudio'}"
                            class="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors"
                        >
                            <span class="material-symbols-outlined text-primary text-lg">headphones</span>
                        </button>
                        <div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">${media.name || 'Àudio'}</p>
                            <p class="text-[10px] text-slate-400">${media.duration ? media.duration.replace('PT', '').replace('M', 'min ').replace('S', 's') : ''} · MP3 · preload="none"</p>
                        </div>
                    </div>`;
                } else if (media['@type'] === 'VideoObject' || media.encodingFormat === 'video/mp4') {
                    mediaHTML += `
                    <div class="mt-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-900">
                        <video
                            id="${mediaId}"
                            class="w-full h-full object-cover"
                            ${media.thumbnailUrl ? `poster="${media.thumbnailUrl}"` : ''}
                            preload="metadata"
                            playsinline
                            controls
                            aria-label="${media.name || name}"
                        >
                            <source src="${media.contentUrl || ''}" type="video/mp4">
                            <track kind="captions" src="<!-- PENDENT: fitxer .vtt -->" srclang="ca" label="Català">
                        </video>
                    </div>`;
                }
            });
        }

        return `
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col" id="artgal-card-${gid}">
            <div class="relative h-36 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                ${imageUrl
                ? createResponsiveImage({ src: imageUrl, alt: name, sizes: 'card', lazy: true, className: 'w-full h-full object-cover hover:scale-105 transition-transform duration-500' })
                : `<div class="w-full h-full flex items-center justify-center"><span class="material-symbols-outlined text-slate-400 text-4xl">image_not_supported</span></div>`
            }
                ${g.publicAccess ? '<span class="absolute top-2 right-2 bg-green-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Accés públic</span>' : ''}
            </div>
            <div class="p-4 flex flex-col flex-1">
                <h4 class="font-bold text-slate-900 dark:text-slate-100 mb-1 leading-tight">${name}</h4>
                ${ratingHTML}
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 flex-1">${description}</p>
                ${propsHTML ? `<p class="mt-2 flex flex-wrap gap-x-1">${propsHTML}</p>` : ''}
                ${featuresHTML ? `<div class="flex flex-wrap gap-1 mt-3">${featuresHTML}</div>` : ''}
                ${mediaHTML}
                <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer"
                   class="mt-4 flex items-center justify-center gap-1.5 w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors">
                    <span class="material-symbols-outlined text-[16px]">directions</span> Com arribar-hi
                </a>
            </div>
        </div>`;
    }).join('');

    return `
    <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800" id="art-galleries-section">
        <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-primary">museum</span>
            </div>
            <div>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">Galeries d'Art Properes</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">Espais d'art contemporani a Palma relacionats amb l'artesania local</p>
            </div>
            <span class="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-wider">Font: ArtGallery.json · Grup extern</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${cardsHTML}
        </div>
    </div>`;
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

// Exposar a window per a la compatibilitat del mòdul ES6 en el bundle de Vite
window.renderFilterZones = renderFilterZones;
window.renderFilterTechniques = renderFilterTechniques;
window.renderFilterMaterials = renderFilterMaterials;
window.renderCatalogCards = renderCatalogCards;
window.renderMapComarques = renderMapComarques;
window.renderMapMaterials = renderMapMaterials;
window.renderGeoNearby = renderGeoNearby;
window.renderMultimediaGrid = renderMultimediaGrid;
window.renderChatMessages = renderChatMessages;
window.renderWeatherModal = renderWeatherModal;
window.renderHeader = renderHeader;
window.renderHero = renderHero;
window.renderAbout = renderAbout;
window.renderCatalogSection = renderCatalogSection;
window.renderMapSection = renderMapSection;
window.renderMultimediaSection = renderMultimediaSection;
window.renderFooter = renderFooter;
window.renderFAB = renderFAB;
window.renderModals = renderModals;
window.renderCraftDetail = renderCraftDetail;
window.renderStars = renderStars;
window.renderReviewsList = renderReviewsList;
window.renderCraftVideo = renderCraftVideo;
window.renderGalleryImages = renderGalleryImages;
window.renderSeriesGalleryImages = renderSeriesGalleryImages;
window.renderMixedGallery = renderMixedGallery;
window.renderArtGalleries = renderArtGalleries;
