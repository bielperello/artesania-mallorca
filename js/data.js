// data.js — Dades placeholder per a l'SPA d'Artesania Mallorquina
// En el futur, aquestes dades es carregaran des de fitxers JSON via fetch()

const APP_DATA = {

    // ── Filtres del Catàleg ──────────────────────────────────
    filterZones: [
        { id: 'tramuntana', label: 'Serra de Tramuntana', checked: false },
        { id: 'raiguer', label: 'Es Raiguer', checked: false },
        { id: 'pla', label: 'Pla de Mallorca', checked: true },
        { id: 'migjorn', label: 'Migjorn', checked: false },
        { id: 'palma', label: 'Palma', checked: false },
    ],
    filterTechniques: [
        { id: 'modelatge', label: 'Modelatge', checked: true },
        { id: 'bufat', label: 'Bufat de vidre', checked: true },
        { id: 'brodat', label: 'Brodat i Costura', checked: false },
        { id: 'trenat', label: 'Trenat d\'espart', checked: false },
    ],
    filterMaterials: [
        { id: 'fang', label: 'Fang', active: true },
        { id: 'vidre', label: 'Vidre', active: true },
        { id: 'llana', label: 'Llana', active: false },
        { id: 'espart', label: 'Espart', active: false },
        { id: 'fusta', label: 'Fusta', active: false },
    ],

    // ── Artesanies (Catàleg) ────────────────────────────────
    crafts: [
        {
            id: 'siurells',
            nom: 'Siurells de Marratxí',
            material: 'Fang',
            imatge: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALNMrHGXDsC-khMfjebpWKtVYTZnlpWAT7DzH9lfHG-GInEh0uH5Mk9t2j9MKHqQMX_FWeCUsN55wh42Lo2q6Y92OTn2wkdMo7bGo7PeQSxq4XovnZw6gitz0EEx6C-An8BZ3EyTu6HMv11Hb2YXKmyTN7w1Ap5FsT8HYATGshAcyGjmUriS2EI4buqxf2oUPDgMDVFys5naIVDmncM1nKL2OOWg_k-bHk9jBvwCcWSlg3YVqTF_sKBofEcz555u9Wzz2KUBy0pK6C',
            descripcio: 'Figures de fang cuit amb un xiulet, pintades tradicionalment de blanc amb traços verds i vermells.',
            descripcioLlarga: 'El siurell és una peça d\'artesania autèntica de Mallorca, els orígens de la qual es remunten a segles enrere, amb una forta influència mediterrània. Originalment usat per pastors per controlar els ramats, avui dia és un símbol de l\'illa, present en festes tradicionals i celebracions. La seva creació implica modelar el fang, afegir el característic xiulet, enfornar i, finalment, el banyat en calç blanca abans de rebre els tocs finals de color.',
            subtitol: 'Figura tradicional mallorquina de fang amb un xiulet, pintada amb pinzellades verdes i vermelles sobre fons blanc.',
            rating: 4.8,
            numRatings: 124,
            numComentaris: 128,
            numTallers: 4,
            favorit: true,
            videoThumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDYp72p9yb3VAKhAiX6PPO_S3glj1feGCKJA-WiPWZ7tSYLwvZJBktVBW2WKq9AUDSgtaNf9KuyW_QkJ14-3wtJnbkNKPhcUKoKeULc7wNYyG5X__0ej3nv2HtX8Ocx75PvvgS5uW0MTnYh9CKM4iwUEReuN8TrhSf1BL4yITS7HKrT0PtEdx_ZRoIB0GZVE-_wGnra_5iE4SNqp0xvCmgle-keXH4sxvOsPQR4EwHOiq_S_x4T8X6V_eM-qGshbSjTJjlQanbnVUY',
            galeria: [
                { imatge: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6NmHhunRITfm7YWg4R1nX0Ugh24DKVNywhVuxm1LZuv8Q8XlXVEGxQv0gwB7p_diTE8WamxfgE-tINR1htKpPm3hiFR18tkFRO0iIf8nRJgsZMpaHVbKWoLGwzPPk7AdjpIqtlP5XJnCHbihlTWbd0XFPxBMleIlBWF2fdRHjYfSfd8JVlf4xr2at9FhqoJ1-U1EUPmovyUF54Z4FWFFZIvKXMmfNAd5JBe1a1okeuaheXVQ5Ab-s_2to6jR_bUV7O0ltScK3VjXg', titol: 'Siurell Clàssic', subtitol: 'Figura de cavall típica' },
                { imatge: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAf0TENofon4YiwksUw-XB-rA7YIuRz_9MiYoKRU5W-1o_ggMhaBwXJGCqCeDZzb02T2dhLtR4iZBmRm3JTexspWxKUDQ99aTLSLxkJeVwJqub2dGpcGKIMCtQb_N-Z8P3lXs9t3z348VwBqgJxkSUwZ8WIzOoYtvlhgwVivvTpOzchsvw7Bkpe9xN8NB83iaUNkPN3VytLq-_MD0uCIkNHb_Ym2pbHWyfTcWKo9WKiimVwe-R3aL4PLyLacB1pi7EVN30BVYBiA7X', titol: 'Procés de Pintura', subtitol: 'Pinzellades característiques' },
                { imatge: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS3Kdurvz_F1o6sWyequ6xzYwR8XPss85ax7fQ29S0AarYH3CEX0aiZH8fBrS-vv4RBPHxbv144Z9xH1rffu7Xb_Sruaye2cvuy1LmkegG1gdpWipWL-B7tYRyWPlMlLoo5nlp3Q8gHuM2VaLXwKDX9Q2DfidQ_LTfaQdHHFTfUwW5dceANbvvnkutAWkT8X-l9s80sN0sA6ekWva7Ivr5Vg2eBfK5-ZkcmNMnXmUSRpKWQN_6EWFnJG2q3Lj20mOV6thZnCkXwLYM', titol: 'El Forn', subtitol: 'Cocció del fang' },
            ],
            tallers: [
                {
                    id: 'bernadi',
                    nom: 'Can Bernadí Nou',
                    adreca: 'Carrer de la Creu, 14, Marratxí',
                    telefon: '+34 971 60 12 34',
                    web: 'canbernadi.com',
                    contactType: 'language',
                    temp: '24°C',
                    mapsQuery: 'Can+Bernadi+Nou+Marratxi',
                    mapPosition: { top: '40%', left: '45%' },
                },
                {
                    id: 'camado',
                    nom: 'Siurells Ca Madò Bet',
                    adreca: 'Plaça de l\'Església, Sa Cabaneta',
                    telefon: '+34 971 79 45 67',
                    email: 'info@camadobet.cat',
                    contactType: 'mail',
                    temp: '22°C',
                    mapsQuery: 'Ca+Mado+Bet+Sa+Cabaneta',
                    mapPosition: { top: '35%', left: '55%' },
                },
            ],
            artesans: [
                { nom: 'Margalida Juan Amengual', dates: '1890 - 1976', lloc: 'Marratxí', foto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3xh5NZqnIj1W1KyFaKZAm1s7xI0TgJrlz3S1av_YcbR4jkZrhwEN-AbbtUziWtsVydV1W_kd-b5wGn8SJHTjKFbZdlTlXiQbgATU6g_dqgy5L6dilxt96qBOt_k4jr6qEqZESh3Q3nKf01o1J_Rgs7BRbk62xprE85kwWPUMbwlO70jVVcLtX0GiNAyoahV4EjgdxQzc5JXcPUtvjQ06VEcYkaN9W2rh7m5Fw29ssDIikBIRJDmO-kitZ9YhSDgtAycouK0EAMjqX', bio: 'Mestra artesana històrica de Sa Cabaneta, va ser pionera en la modernització del procés d\'esmaltat, mantenint vius els dissenys originals de les figures eqüestres que avui considerem un estàndard per la figura del siurell de cavall clàssic.' },
                { nom: 'Pere Coll Mir', dates: '1955', lloc: 'Inca', foto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhvCrZUGVYHcWFWt49QGdC-BRfT6F6X9Kx6xl4C__KsYNpHCumleKx_vNeN4HsJZ2_nOqDhemugsb4Yp_hFStp9pl3pdJbNgt4Rhc75XHq9eKLPdBzfF013c7Gqrw1iwwQe5RUNvzq54Om8VYRt5OiSpRQx90wA5uAKmi-5XjOEa54Hb2Wjg9TmjuQDA3_8uRoHJrvQcs_X66vfml9QCN2JkvJWWkxFhRddFqBJVFFM8B5_KfWXMA0c7kfHvFQnDQwii8MgLnQSd6R', bio: 'Artesà contemporani que ha revitalitzat la producció de siurells combinant les tècniques de pastat antics amb nous dissenys de figures antropomòrfiques. Les seves peces han estat exposades a diverses galeries d\'art popular europees.' },
                { nom: 'Catalina Pou Lliteras', dates: '1923 - 2005', lloc: 'Felanitx', foto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5I-2VcFluo_KFZe_CKLeS7-zN6gnCPN9GNButcoXeCmG1z6F2_dYdugujS-BSs4WyDP8MQx123zbZu6oHUIYKn_db3PLHx1cLXLQAxmvGmfKpEoeHMbVm5wDcVw6vlvJhxSg4TANfw5QAcmTksb2DE4chkWV85ixQptAHzJ7zDnimaY7D5hPnsrRgMB_xON_hdQ5RQQzb-13-Z2khEEV-a1PYTrpQMShadwWxMJC32xYDE8dlCVnjzdQ_qO-2coTQQAVI7RY4QjWv', bio: 'Coneguda popularment com a "Madò Catalina", va dedicar tota la seva vida a l\'elaboració de siurells utilitzant un forn de llenya tradicional que encara es conserva avui dia com a patrimoni etnològic del municipi.' },
                { nom: 'Antoni Riutort Gelabert', dates: '1968', lloc: 'Palma', foto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfEd0i0nYqrnE1ZvoW4QXjH1hEEzUxXvbBr7uQiSJK6Vo59lN6BmvoICSP2GaeLjnG9euJtqYk_g2OvwRYjZsp5SUtif6kUF9Jhf8kOkMNYbLYpK5xfFl__jiT8oW-fRInYLlzfMMYTV2hEgf-Up8bOuSqwPJPr5Icj49GxPt4FX-TKHm6iLB81ahWYexeE95n3gEibGdSkMlzHc0gcLE6vTo5neM-4bnPU5oxuoG1C7LeJnmq2B_gqUlZPFYSP9kiSYOJUEvR0FcB', bio: 'Reconegut pel Govern de les Illes Balears amb la Carta de Mestre Artesà el 2015. Riutort destaca per l\'ús de pigments naturals ecològics i per la realització de tallers didàctics orientats a la preservació de l\'ofici entre els joves.' },
            ],
            ressenyes: [
                { autor: 'Maria Antonieta', data: '12 d\'octubre de 2023', rating: 5, text: 'Vaig visitar el taller de Ca Madò Bet i va ser una experiència fantàstica. Poder veure com pinten els siurells en directe i conèixer la història de la família és molt recomanable. Les figures són precioses.', imatges: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBioo8H7adJrdmnnuMTTCqkII4BOLq4-prHUbBCi9Y1QNm10W8cIvmgKxaxDNmktz6nVCP9UFQy_3HAdqEhbmemEMDJOKwclwsRKqmAQw2TqYp5uvLBF1_WmkRilacKPv04V3GYldQFzTeWRcLXX9PmGKtEIHyCfTlv9lp_8CnImvf_otfmhy1dc42fFR9nbB8CAfOlonhDMJhRQaFMdTcmz8uVpKFslkcfK9OoJE_AjzETj48DZ98kG_GBMf3fStEK6MBPAS6ZuphE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbDq70IE-vWKiodjlO4BClpiUdIwec2DwMfcE0nbJSovg3Stn4ml6wYt9OfUC5XmkoZDpYy6rcyNQNBxrZkmiiOr_FsbnwY-x1poEmLbpVeOvVPvuyE8eBLMoPPuSayLyjOBXqJVwDltcCFbYZNXETjzpIANZxErmZwQhYUYj14Se8kpk6EPDHleOLXs5V_Cefqsr8YSQQFqUJA_8AkVXOhi5tA9XdCO_d-HGJ_LZ_RESoCWW6QPcmiS2q-ETRkcxLxWmi18aeQAI4'] },
                { autor: 'Joan Prats', data: '5 de setembre de 2023', rating: 4, text: 'Molt interessant la visita a Can Bernadí Nou. El mestre artesà ens va explicar tot el procés de cocció de manera molt amena.', imatges: [] },
            ],
        },
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
        { id: 'fang', label: 'Fang', icon: 'potted_plant', active: true, color: 'primary' },
        { id: 'vidre', label: 'Vidre', icon: 'water_drop', active: false, color: 'blue-500' },
        { id: 'textil', label: 'Tèxtil', icon: 'styler', active: false, color: 'pink-500' },
        { id: 'espart', label: 'Espart', icon: 'grass', active: false, color: 'amber-600' },
    ],
    mapMarkers: [
        { id: 'faded-marker', top: '35%', left: '20%', icon: 'potted_plant', color: 'primary', size: 'small', faded: true, tooltip: null },
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

    // ── Xat IA (Missatges Placeholder) ──────────────────────
    chatMessages: [
        { role: 'assistant', text: 'Hola! Som l\'assistent del catàleg d\'artesania de Mallorca. Et puc ajudar a descobrir oficis, trobar tallers o conèixer la història dels materials. Què busques?' },
        { role: 'user', text: 'Quina diferència hi ha entre els siurells de Marratxí i els brodats tìpics?' },
        { role: 'assistant', html: '<p class="text-sm text-slate-700 dark:text-slate-300 mb-2">Són oficis completamente diferents en materials i història:</p><ul class="text-sm text-slate-700 dark:text-slate-300 list-disc pl-4 space-y-1 mb-2"><li><strong>Siurells:</strong> Peces de fang modelat, típicament blanques amb ratlles verdes i vermelles. Porten un xiulet originàriament d\'ús pastoral.</li><li><strong>Brodats:</strong> Treball tèxtil femení, generalment sobre lli o cotó, amb cadeneta o punt de creu, per a parament de llar o roba.</li></ul><button class="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline mb-1 mt-1 block">Veure taller de siurells</button>' },
    ],
};
