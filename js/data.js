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
        { id: 'adobat', label: 'Adobat i Sabateria' },
        { id: 'forja', label: 'Forja' },
        { id: 'rebosteria', label: 'Rebosteria' },
    ],
    filterMaterials: [
        { id: 'fang', label: 'Fang', icon: 'potted_plant', color: 'primary' },
        { id: 'vidre', label: 'Vidre', icon: 'water_drop', color: 'blue-500' },
        { id: 'teixit', label: 'Teixit', icon: 'texture', color: 'pink-500' },
        { id: 'palma', label: 'Palma', icon: 'eco', color: 'green-600' },
        { id: 'ferro', label: 'Ferro', icon: 'construction', color: 'slate-600' },
        { id: 'cuir', label: 'Cuir', icon: 'work', color: 'amber-800' },
        { id: 'dolcos', label: 'Rebosteria', icon: 'bakery_dining', color: 'yellow-600' }
    ],

    // ── Multimèdia ──────────────────────────────────────────
    multimedia: [
        { tipus: 'video-hero', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrf51cyWMYkm1-iXrDnBTsNKCHmukIssX9kg-6tH6No8tDIgDezjCACL8RP22k9hqkNi-RipDbvuWRUIqK4fYO34WX7Iz3XgCEF1afjGl2cv1Cd4U_IKCXMkgJ9do5hMXbg8KpVsEn-b-_x05y3TP97AazCGqUYVvsnMeJyRvCUDO3mjwsarD8R95VjVZCJeWtU_v7JUgCBu-N7VEXCNdmPKcy1oo80-Dz_dVcGV1tWhS3lD6umLv4Jyq5JTHMjMxrc6w_ERefzNao', tag: 'Taller Destacat', titol: 'Visita a Ca Na Mel a Campos' },
        {
            tipus: 'galeria',
            img: './media/images/siurells/siurells-bet-01.jpeg',
            imgAvif: './media/images/siurells/siurells-bet-01.avif',
            imgWebp: './media/images/siurells/siurells-bet-01.webp',
            titol: 'Siurells de Ca Madò Bet',
            fotos: [
                { src: './media/images/siurells/siurells-bet-01.jpeg', avif: './media/images/siurells/siurells-bet-01.avif', webp: './media/images/siurells/siurells-bet-01.webp', alt: 'Siurells de Ca Madò Bet — imatge 1' },
                { src: './media/images/siurells/siurells-bet-02.jpeg', avif: './media/images/siurells/siurells-bet-02.avif', webp: './media/images/siurells/siurells-bet-02.webp', alt: 'Siurells de Ca Madò Bet — imatge 2' },
                { src: './media/images/siurells/siurells-bet-03.jpeg', avif: './media/images/siurells/siurells-bet-03.avif', webp: './media/images/siurells/siurells-bet-03.webp', alt: 'Siurells de Ca Madò Bet — imatge 3' },
            ]
        },
        {
            tipus: 'serie',
            titol: 'Oficis de l\'Illa',
            slides: [
                {
                    img: './media/images/serie/siurells-alta-01.jpg',
                    webp: './media/images/serie/siurells-alta-01.webp',
                    avif: './media/images/serie/siurells-alta-01.avif',
                    titol: 'El Siurell',
                    subtitol: 'Fang, calç i un xiulet: el símbol més antic de l\'ànima mallorquina.'
                },
                {
                    img: './media/images/serie/llata-alta-01.jpg',
                    webp: './media/images/serie/llata-alta-01.webp',
                    avif: './media/images/serie/llata-alta-01.avif',
                    titol: 'La Llata',
                    subtitol: 'Sanalles, capells i estores: la paciència trenada fulla a fulla.'
                },
                {
                    img: './media/images/serie/ceramica-alta-01.jpg',
                    webp: './media/images/serie/ceramica-alta-01.webp',
                    avif: './media/images/serie/ceramica-alta-01.avif',
                    titol: 'La Ceràmica',
                    subtitol: 'Terra i foc units per mans que modelen cinc segles de tradició.'
                },
                {
                    img: './media/images/serie/alta-01.jpg',
                    webp: './media/images/serie/alta-01.webp',
                    avif: './media/images/serie/alta-01.avif',
                    titol: 'La Fusta',
                    subtitol: 'Estris de cuina tallats a mà: la memòria de cada llar mallorquina.'
                },
            ]
        },
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
    artGalleries: [],   // Carregat des de data/ArtGallery.json (JSON extern grup aliè)
};
