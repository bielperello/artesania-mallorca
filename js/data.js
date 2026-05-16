// data.js — Dades placeholder per a l'SPA d'Artesania Mallorquina
// En el futur, aquestes dades es carregaran des de fitxers JSON via fetch()

const APP_DATA = {

    groqToken: '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', // Token de Groq API

    // ── Filtres del Catàleg ──────────────────────────────────
    filterZones: [
        { id: 'tramuntana', label: 'Serra de Tramuntana', active: false },
        { id: 'raiguer', label: 'Es Raiguer', active: false },
        { id: 'pla', label: 'Pla de Mallorca', active: false },
        { id: 'migjorn', label: 'Migjorn', active: false },
        { id: 'palma', label: 'Palma', active: false },
        { id: 'llevant', label: 'Llevant', active: false },
    ],
    filterTechniques: [
        { id: 'modelatge', label: 'Modelatge', active: false },
        { id: 'bufat', label: 'Bufat de vidre', active: false },
        { id: 'brodat', label: 'Brodat i Costura', active: false },
        { id: 'trenat', label: 'Trenat d\'espart', active: false },
    ],
    filterMaterials: [
        { id: 'fang', label: 'Fang', active: false },
        { id: 'vidre', label: 'Vidre', active: false },
        { id: 'llana', label: 'Llana', active: false },
        { id: 'espart', label: 'Espart', active: false },
        { id: 'fusta', label: 'Fusta', active: false },
        { id: 'ceramica', label: 'Ceràmica', active: false },
        { id: 'pedra', label: 'Pedra', active: false },
        { id: 'palma', label: 'Palma', active: false },
    ],

    // ── Mapa Principal ──────────────────────────────────────
    mapComarques: [
        { id: 'palma', label: 'Palma', active: false },
        { id: 'tramuntana', label: 'Serra de Tramuntana', active: false },
        { id: 'raiguer', label: 'Raiguer', active: false },
        { id: 'pla', label: 'Pla de Mallorca', active: true },
        { id: 'migjorn', label: 'Migjorn', active: false },
        { id: 'llevant', label: 'Llevant', active: false },
    ],
    mapMaterials: [
        { id: 'fang', label: 'Fang', icon: 'potted_plant', active: false, color: 'primary' },
        { id: 'vidre', label: 'Vidre', icon: 'water_drop', active: false, color: 'blue-500' },
        { id: 'llana', label: 'Llana', icon: 'styler', active: false, color: 'pink-500' },
        { id: 'espart', label: 'Espart', icon: 'grass', active: false, color: 'amber-600' },
        { id: 'fusta', label: 'Fusta', icon: 'park', active: false, color: 'amber-800' },
        { id: 'ceramica', label: 'Ceràmica', icon: 'emoji_objects', active: false, color: 'orange-500' },
        { id: 'pedra', label: 'Pedra', icon: 'landscape', active: false, color: 'slate-500' },
        { id: 'palma', label: 'Palma', icon: 'eco', active: false, color: 'green-600' },
    ],
    mapMarkers: [
        { id: 'faded-marker', top: '20%', left: '40%', icon: 'potted_plant', color: 'primary', size: 'small', faded: true, tooltip: null },
        {
            id: 'gordiola', top: '50%', left: '45%', icon: 'water_drop', color: 'blue-500', size: 'large', faded: false,
            tooltip: { nom: 'Vidrieries Gordiola', badgeText: 'Focus', badgeColor: 'blue', lloc: 'Algaida', comarca: 'Pla de Mallorca', telefon: '+34 971 66 50 46', material: 'Vidre bufat', materialColor: 'blue-500', mapsQuery: 'Vidrieries+Gordiola+Algaida' }
        },
        {
            id: 'canpere', top: '45%', left: '55%', icon: 'potted_plant', color: 'primary', size: 'large', faded: false,
            tooltip: { nom: 'Can Pere Ignasi', badgeText: 'Focus', badgeColor: 'primary', lloc: 'Montuïri', comarca: 'Pla de Mallorca', telefon: '+34 971 64 61 22', material: 'Fang tradicional', materialColor: 'primary', mapsQuery: 'Can+Pere+Ignasi+Montuiri' }
        },
    ],

    // ── Geolocalització ─────────────────────────────────────
    geoNearby: [
        { nom: 'Siurells Ca Madò Bet', zona: 'Sa Cabaneta', material: 'Fang', distancia: '2.4 km' },
        { nom: 'Can Bernadí Nou', zona: 'Marratxí', material: 'Fang', distancia: '3.1 km' },
        { nom: 'Teixits Vicens', zona: 'Pollença', material: 'Tèxtil', distancia: '12.8 km' },
    ],

    // ── Multimèdia ──────────────────────────────────────────
    multimedia: [
        { tipus: 'video-hero', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrf51cyWMYkm1-iXrDnBTsNKCHmukIssX9kg-6tH6No8tDIgDezjCACL8RP22k9hqkNi-RipDbvuWRUIqK4fYO34WX7Iz3XgCEF1afjGl2cv1Cd4U_IKCXMkgJ9do5hMXbg8KpVsEn-b-_x05y3TP97AazCGqUYVvsnMeJyRvCUDO3mjwsarD8R95VjVZCJeWtU_v7JUgCBu-N7VEXCNdmPKcy1oo80-Dz_dVcGV1tWhS3lD6umLv4Jyq5JTHMjMxrc6w_ERefzNao', tag: 'El procés de l\'aire', titol: 'Màgia fosa en vidre bufat' },
        { tipus: 'galeria', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALNMrHGXDsC-khMfjebpWKtVYTZnlpWAT7DzH9lfHG-GInEh0uH5Mk9t2j9MKHqQMX_FWeCUsN55wh42Lo2q6Y92OTn2wkdMo7bGo7PeQSxq4XovnZw6gitz0EEx6C-An8BZ3EyTu6HMv11Hb2YXKmyTN7w1Ap5FsT8HYATGshAcyGjmUriS2EI4buqxf2oUPDgMDVFys5naIVDmncM1nKL2OOWg_k-bHk9jBvwCcWSlg3YVqTF_sKBofEcz555u9Wzz2KUBy0pK6C', titol: 'Detalls de fang i pintura' },
        { tipus: 'serie', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_A0SUw9RqSKQLcR9plH8oQk7szdi5Jwz5Y2cIw7oFiTuC8QhhWD0GDPn9JDazVeRhNXLXDe3hyi_cAaMn-mttS4qbCn7B_hqztWhgY-gL85PLO-vpajx6t2L8r1oO0C-zpeZ_zbHvdasp2_VU_XIFcXAOUkCFiWHSlx8yV8nFjw7fxYypGVOQQsas9cUckIUjxuBiojI64zl4KsP01ytFkiW-M04BTdrJ3AHhKQNWfzXAduvg7dzvMiZYN25GE2HEQNRq8wPxubk1', titol: 'Mestres de la Llatra', subtitol: 'La paciència trenada en fulles de margalló al nord de l\'illa.' },
        { tipus: 'audio', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzA3dCjnGkNQg0Wqd3R-bwSh3Ih9BRp54sqpZMDuGuD-gQEFUS329rqT3sCeJmdDwo7SoHjJSnQXoDl8T9_2Q5IoN7R-BlJwFzakJkzhr9K7M4NSAW5i8VKTSUvJkpOekEdU9TJdlxG_955kC9DM9ah48EOgomMgUYFkS3U6QEW9RVWxqgfcC0QaKNTDDTKvwP2ZGnVU10CtLibTSJcaMkGuyRiGBCY5KQHka3yJWx8_L26Kfb50MB0iwyN5fh_Z93TMM1U5aOZo2W', titol: 'El ritme del teler', durada: '02:45' },
    ],

    // ── Dades del Temps (Placeholder) ───────────────────────
    weather: {
        lloc: 'Marratxí',
        actual: { temp: '24°C', desc: 'Assolellat i brisa marina', icon: 'light_mode' },
        hores: [
            { hora: '14:00', icon: 'light_mode', iconColor: 'terracotta', temp: '24°', pluja: '0%', highlight: true },
            { hora: '15:00', icon: 'light_mode', iconColor: 'terracotta', temp: '25°', pluja: '0%' },
            { hora: '16:00', icon: 'partly_cloudy_day', iconColor: 'yellow-500', temp: '23°', pluja: '5%' },
            { hora: '17:00', icon: 'partly_cloudy_day', iconColor: 'yellow-500', temp: '22°', pluja: '10%' },
            { hora: '18:00', icon: 'cloud', iconColor: 'slate-400', temp: '20°', pluja: '15%' },
            { hora: '19:00', icon: 'cloud', iconColor: 'slate-400', temp: '19°', pluja: '20%' },
        ],
        dies: [
            { dia: 'Demà', icon: 'light_mode', iconColor: 'terracotta', desc: 'Majorment assolellat', pluja: '5%', max: '26°', min: '18°', highlight: true },
            { dia: 'Dimecres', icon: 'partly_cloudy_day', iconColor: 'yellow-500', desc: 'Intervals de núvols', pluja: '20%', max: '24°', min: '17°' },
            { dia: 'Dijous', icon: 'rainy', iconColor: 'blue-400', desc: 'Possibilitat de pluja', pluja: '75%', max: '21°', min: '15°' },
            { dia: 'Divendres', icon: 'light_mode', iconColor: 'terracotta', desc: 'Cel clar', pluja: '0%', max: '23°', min: '16°' },
        ],
    },

    // ── Xat IA  ──────────────────────
    chatMessages: [
        { role: 'assistant', text: 'Hola! Som l\'assistent del catàleg d\'artesania de Mallorca. Et puc ajudar a descobrir oficis, trobar tallers o conèixer la història dels materials. Què busques?' },
    ],
};
