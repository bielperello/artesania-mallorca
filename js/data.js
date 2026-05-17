// data.js — Configuració i dades estàtiques de l'SPA d'Artesania Mallorquina
// Les dades dinàmiques (crafts, tallers, mestres) es carreguen des de fitxers JSON via fetch()

const APP_DATA = {

    groqToken: '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', // Token de Groq API

    // ── Filtres del Catàleg ──────────────────────────────────
    // Dades estàtiques de configuració — defineixen les opcions de filtre
    filterZones: [
        { id: 'tramuntana', label: 'Serra de Tramuntana' },
        { id: 'raiguer', label: 'Es Raiguer' },
        { id: 'pla', label: 'Pla de Mallorca' },
        { id: 'migjorn', label: 'Migjorn' },
        { id: 'palma', label: 'Palma' },
        { id: 'llevant', label: 'Llevant' },
    ],
    filterTechniques: [
        { id: 'modelatge', label: 'Modelatge' },
        { id: 'bufat', label: 'Bufat de vidre' },
        { id: 'brodat', label: 'Brodat i Costura' },
        { id: 'trenat', label: 'Trenat d\'espart' },
    ],
    filterMaterials: [
        { id: 'fang', label: 'Fang', icon: 'potted_plant', color: 'primary' },
        { id: 'vidre', label: 'Vidre', icon: 'water_drop', color: 'blue-500' },
        { id: 'llana', label: 'Llana', icon: 'styler', color: 'pink-500' },
        { id: 'espart', label: 'Espart', icon: 'grass', color: 'amber-600' },
        { id: 'fusta', label: 'Fusta', icon: 'park', color: 'amber-800' },
        { id: 'ceramica', label: 'Ceràmica', icon: 'emoji_objects', color: 'orange-500' },
        { id: 'pedra', label: 'Pedra', icon: 'landscape', color: 'slate-500' },
        { id: 'palma', label: 'Palma', icon: 'eco', color: 'green-600' },
    ],

    // ── Multimèdia ──────────────────────────────────────────
    multimedia: [
        { tipus: 'video-hero', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrf51cyWMYkm1-iXrDnBTsNKCHmukIssX9kg-6tH6No8tDIgDezjCACL8RP22k9hqkNi-RipDbvuWRUIqK4fYO34WX7Iz3XgCEF1afjGl2cv1Cd4U_IKCXMkgJ9do5hMXbg8KpVsEn-b-_x05y3TP97AazCGqUYVvsnMeJyRvCUDO3mjwsarD8R95VjVZCJeWtU_v7JUgCBu-N7VEXCNdmPKcy1oo80-Dz_dVcGV1tWhS3lD6umLv4Jyq5JTHMjMxrc6w_ERefzNao', tag: 'El procés de l\'aire', titol: 'Màgia fosa en vidre bufat' },
        { tipus: 'galeria', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALNMrHGXDsC-khMfjebpWKtVYTZnlpWAT7DzH9lfHG-GInEh0uH5Mk9t2j9MKHqQMX_FWeCUsN55wh42Lo2q6Y92OTn2wkdMo7bGo7PeQSxq4XovnZw6gitz0EEx6C-An8BZ3EyTu6HMv11Hb2YXKmyTN7w1Ap5FsT8HYATGshAcyGjmUriS2EI4buqxf2oUPDgMDVFys5naIVDmncM1nKL2OOWg_k-bHk9jBvwCcWSlg3YVqTF_sKBofEcz555u9Wzz2KUBy0pK6C', titol: 'Detalls de fang i pintura' },
        { tipus: 'serie', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_A0SUw9RqSKQLcR9plH8oQk7szdi5Jwz5Y2cIw7oFiTuC8QhhWD0GDPn9JDazVeRhNXLXDe3hyi_cAaMn-mttS4qbCn7B_hqztWhgY-gL85PLO-vpajx6t2L8r1oO0C-zpeZ_zbHvdasp2_VU_XIFcXAOUkCFiWHSlx8yV8nFjw7fxYypGVOQQsas9cUckIUjxuBiojI64zl4KsP01ytFkiW-M04BTdrJ3AHhKQNWfzXAduvg7dzvMiZYN25GE2HEQNRq8wPxubk1', titol: 'Mestres de la Llatra', subtitol: 'La paciència trenada en fulles de margalló al nord de l\'illa.' },
        { tipus: 'audio', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzA3dCjnGkNQg0Wqd3R-bwSh3Ih9BRp54sqpZMDuGuD-gQEFUS329rqT3sCeJmdDwo7SoHjJSnQXoDl8T9_2Q5IoN7R-BlJwFzakJkzhr9K7M4NSAW5i8VKTSUvJkpOekEdU9TJdlxG_955kC9DM9ah48EOgomMgUYFkS3U6QEW9RVWxqgfcC0QaKNTDDTKvwP2ZGnVU10CtLibTSJcaMkGuyRiGBCY5KQHka3yJWx8_L26Kfb50MB0iwyN5fh_Z93TMM1U5aOZo2W', titol: 'El ritme del teler', durada: '02:45' },
    ],

    // ── Dades del Temps (Fallback) ──────────────────────────
    // S'usa NOMÉS si la crida a Open-Meteo falla.
    weatherFallback: {
        lloc: 'Mallorca',
        actual: { temp: '--°C', desc: 'Dades no disponibles', icon: 'cloud_off' },
        hores: [
            { hora: '--:--', icon: 'cloud', iconColor: 'slate-400', temp: '--°', pluja: '--%', highlight: false },
        ],
        dies: [
            { dia: '--', icon: 'cloud', iconColor: 'slate-400', desc: 'Sense dades', pluja: '--%', max: '--°', min: '--°', highlight: false },
        ],
    },

    // ── Xat IA ──────────────────────────────────────────────
    chatMessages: [
        { role: 'assistant', text: 'Hola! Som l\'assistent del catàleg d\'artesania de Mallorca. Et puc ajudar a descobrir oficis, trobar tallers o conèixer la història dels materials. Què busques?' },
    ],

    // ── Dades dinàmiques (carregades a init() des de JSON) ──
    crafts: [],
    tallers: [],
    mestres: [],
};
