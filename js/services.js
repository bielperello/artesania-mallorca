// services.js — Serveis externs (Geolocalització + Meteorologia)
// Mòdul centralitzat per gestionar les APIs externes de l'SPA

// ══════════════════════════════════════════════════════════════
// GEOLOCALITZACIÓ — HTML5 Geolocation API
// ══════════════════════════════════════════════════════════════

const GeoService = {
    /** Coordenades actuals de l'usuari: { latitude, longitude, accuracy } | null */
    coords: null,

    /** ID del watcher actiu per aturar-lo posteriorment */
    _watchId: null,

    /** Callbacks registrats per rebre actualitzacions de posició */
    _listeners: [],

    /**
     * Comprova si l'API de geolocalització està disponible al navegador.
     * @returns {boolean}
     */
    isSupported() {
        return 'geolocation' in navigator;
    },

    /**
     * Demana permís al navegador i obté la posició actual de l'usuari.
     * Activa el diàleg natiu de permisos del navegador.
     * @returns {Promise<GeolocationCoordinates>} Les coordenades obtingudes
     */
    requestPermission() {
        return new Promise((resolve, reject) => {
            if (!this.isSupported()) {
                reject(new Error('Geolocalització no suportada en aquest navegador.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    this._notifyListeners();
                    resolve(this.coords);
                },
                (error) => {
                    let message;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'L\'usuari ha denegat el permís de geolocalització.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'La informació de la ubicació no està disponible.';
                            break;
                        case error.TIMEOUT:
                            message = 'S\'ha excedit el temps d\'espera per obtenir la ubicació.';
                            break;
                        default:
                            message = 'Error desconegut de geolocalització.';
                    }
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minuts de cache
                }
            );
        });
    },

    /**
     * Inicia la vigilància contínua de la posició (per actualitzacions en temps real).
     * @returns {void}
     */
    startWatching() {
        if (!this.isSupported() || this._watchId !== null) return;

        this._watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                this._notifyListeners();
            },
            (error) => {
                console.warn('[GeoService] Error de watchPosition:', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    },

    /**
     * Atura la vigilància contínua i neteja les coordenades.
     * @returns {void}
     */
    stopWatching() {
        if (this._watchId !== null) {
            navigator.geolocation.clearWatch(this._watchId);
            this._watchId = null;
        }
        this.coords = null;
    },

    /**
     * Registra un callback que serà cridat cada vegada que s'actualitzin les coordenades.
     * @param {function} callback - Funció que rep { latitude, longitude, accuracy }
     * @returns {void}
     */
    onPositionUpdate(callback) {
        if (typeof callback === 'function') {
            this._listeners.push(callback);
        }
    },

    /**
     * Retorna les coordenades actuals o null si no s'han obtingut.
     * @returns {{ latitude: number, longitude: number, accuracy: number } | null}
     */
    getPosition() {
        return this.coords;
    },

    /** Notifica tots els listeners registrats amb les coordenades actuals */
    _notifyListeners() {
        this._listeners.forEach(cb => cb(this.coords));
    }
};


// ══════════════════════════════════════════════════════════════
// METEOROLOGIA — Open-Meteo API (gratuïta, sense API key)
// ══════════════════════════════════════════════════════════════

const WeatherService = {
    /** Cache de les dades meteorològiques per evitar peticions repetides */
    _cache: null,

    /** Timestamp de l'últim fetch per controlar la caducitat */
    _lastFetch: 0,

    /** Durada de la cache en mil·lisegons (15 minuts) */
    CACHE_DURATION: 15 * 60 * 1000,

    /** Coordenades per defecte: Palma de Mallorca */
    DEFAULT_LAT: 39.5696,
    DEFAULT_LNG: 2.6502,

    /** URL base de l'API Open-Meteo */
    API_BASE: 'https://api.open-meteo.com/v1/forecast',

    /**
     * Mapeja els codis WMO (World Meteorological Organization) a icones Material Symbols
     * i descripcions en català.
     */
    WMO_CODES: {
        0:  { icon: 'light_mode',          iconColor: 'terracotta',  desc: 'Cel clar' },
        1:  { icon: 'light_mode',          iconColor: 'terracotta',  desc: 'Majorment clar' },
        2:  { icon: 'partly_cloudy_day',   iconColor: 'yellow-500',  desc: 'Parcialment ennuvolat' },
        3:  { icon: 'cloud',               iconColor: 'slate-400',   desc: 'Ennuvolat' },
        45: { icon: 'foggy',               iconColor: 'slate-400',   desc: 'Boira' },
        48: { icon: 'foggy',               iconColor: 'slate-400',   desc: 'Boira gelada' },
        51: { icon: 'rainy',               iconColor: 'blue-400',    desc: 'Plugim lleuger' },
        53: { icon: 'rainy',               iconColor: 'blue-400',    desc: 'Plugim moderat' },
        55: { icon: 'rainy',               iconColor: 'blue-400',    desc: 'Plugim intens' },
        56: { icon: 'weather_mix',         iconColor: 'blue-400',    desc: 'Plugim gelat' },
        57: { icon: 'weather_mix',         iconColor: 'blue-400',    desc: 'Plugim gelat intens' },
        61: { icon: 'rainy',               iconColor: 'blue-400',    desc: 'Pluja lleugera' },
        63: { icon: 'rainy',               iconColor: 'blue-500',    desc: 'Pluja moderada' },
        65: { icon: 'rainy',               iconColor: 'blue-600',    desc: 'Pluja intensa' },
        66: { icon: 'weather_mix',         iconColor: 'blue-500',    desc: 'Pluja gelada' },
        67: { icon: 'weather_mix',         iconColor: 'blue-600',    desc: 'Pluja gelada intensa' },
        71: { icon: 'ac_unit',             iconColor: 'blue-300',    desc: 'Nevada lleugera' },
        73: { icon: 'ac_unit',             iconColor: 'blue-400',    desc: 'Nevada moderada' },
        75: { icon: 'ac_unit',             iconColor: 'blue-500',    desc: 'Nevada intensa' },
        77: { icon: 'ac_unit',             iconColor: 'blue-300',    desc: 'Grans de neu' },
        80: { icon: 'rainy',               iconColor: 'blue-400',    desc: 'Xàfecs lleugers' },
        81: { icon: 'rainy',               iconColor: 'blue-500',    desc: 'Xàfecs moderats' },
        82: { icon: 'thunderstorm',        iconColor: 'blue-600',    desc: 'Xàfecs violents' },
        85: { icon: 'weather_snowy',       iconColor: 'blue-300',    desc: 'Xàfecs de neu lleugers' },
        86: { icon: 'weather_snowy',       iconColor: 'blue-500',    desc: 'Xàfecs de neu intensos' },
        95: { icon: 'thunderstorm',        iconColor: 'yellow-600',  desc: 'Tempesta' },
        96: { icon: 'thunderstorm',        iconColor: 'yellow-600',  desc: 'Tempesta amb calamarsa' },
        99: { icon: 'thunderstorm',        iconColor: 'red-500',     desc: 'Tempesta intensa amb calamarsa' },
    },

    /**
     * Obté les dades meteorològiques des de l'API Open-Meteo.
     * Utilitza cache per evitar peticions repetides dins el CACHE_DURATION.
     * @param {number} [lat] - Latitud (per defecte: Palma de Mallorca)
     * @param {number} [lng] - Longitud (per defecte: Palma de Mallorca)
     * @returns {Promise<Object>} Dades formatejades per a l'app
     */
    async fetchWeather(lat, lng) {
        const useLat = lat || this.DEFAULT_LAT;
        const useLng = lng || this.DEFAULT_LNG;

        // Comprovar cache
        const now = Date.now();
        if (this._cache && (now - this._lastFetch) < this.CACHE_DURATION) {
            return this._cache;
        }

        try {
            const params = new URLSearchParams({
                latitude: useLat,
                longitude: useLng,
                current: 'temperature_2m,weather_code,wind_speed_10m',
                hourly: 'temperature_2m,weather_code,precipitation_probability',
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                timezone: 'Europe/Madrid',
                forecast_days: 5
            });

            const response = await fetch(`${this.API_BASE}?${params}`);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const raw = await response.json();
            const formatted = this._formatData(raw);

            // Guardar a cache
            this._cache = formatted;
            this._lastFetch = now;

            return formatted;
        } catch (error) {
            console.error('[WeatherService] Error obtenint dades meteorològiques:', error);
            // Retornar les dades placeholder si falla la petició
            return null;
        }
    },

    /**
     * Transforma les dades crues de l'API al format que espera l'app.
     * @param {Object} raw - Resposta crua de l'API Open-Meteo
     * @returns {Object} Dades formatejades compatibles amb renderWeatherModal()
     */
    _formatData(raw) {
        const current = raw.current;
        const hourly = raw.hourly;
        const daily = raw.daily;

        // Dades actuals
        const currentWeatherInfo = this._getWeatherInfo(current.weather_code);

        // Pròximes 6 hores des de l'hora actual
        const nowHour = new Date().getHours();
        const hourlyStartIndex = hourly.time.findIndex(t => {
            const h = new Date(t).getHours();
            return h >= nowHour && new Date(t).getDate() === new Date().getDate();
        });

        const hores = [];
        for (let i = hourlyStartIndex; i < hourlyStartIndex + 6 && i < hourly.time.length; i++) {
            if (i < 0) continue;
            const time = new Date(hourly.time[i]);
            const weatherInfo = this._getWeatherInfo(hourly.weather_code[i]);
            hores.push({
                hora: `${time.getHours().toString().padStart(2, '0')}:00`,
                icon: weatherInfo.icon,
                iconColor: weatherInfo.iconColor,
                temp: `${Math.round(hourly.temperature_2m[i])}°`,
                pluja: `${hourly.precipitation_probability[i] || 0}%`,
                highlight: i === hourlyStartIndex
            });
        }

        // Noms dels dies en català
        const diesSetmana = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];

        // Pròxims 4 dies (excloent avui)
        const dies = [];
        for (let i = 1; i < Math.min(5, daily.time.length); i++) {
            const date = new Date(daily.time[i]);
            const weatherInfo = this._getWeatherInfo(daily.weather_code[i]);
            const dayName = i === 1 ? 'Demà' : diesSetmana[date.getDay()];
            dies.push({
                dia: dayName,
                icon: weatherInfo.icon,
                iconColor: weatherInfo.iconColor,
                desc: weatherInfo.desc,
                pluja: `${daily.precipitation_probability_max[i] || 0}%`,
                max: `${Math.round(daily.temperature_2m_max[i])}°`,
                min: `${Math.round(daily.temperature_2m_min[i])}°`,
                highlight: i === 1
            });
        }

        return {
            lloc: 'Mallorca',
            actual: {
                temp: `${Math.round(current.temperature_2m)}°C`,
                desc: currentWeatherInfo.desc,
                icon: currentWeatherInfo.icon
            },
            hores: hores,
            dies: dies
        };
    },

    /**
     * Obté la informació d'icona i descripció a partir d'un codi WMO.
     * @param {number} code - Codi meteorològic WMO
     * @returns {{ icon: string, iconColor: string, desc: string }}
     */
    _getWeatherInfo(code) {
        return this.WMO_CODES[code] || this.WMO_CODES[0];
    },

    /** Invalida la cache forçant una nova petició al pròxim fetch */
    invalidateCache() {
        this._cache = null;
        this._lastFetch = 0;
    }
};

// Exposar a window per a la compatibilitat del mòdul ES6 en el bundle de Vite
window.GeoService = GeoService;
window.WeatherService = WeatherService;

export { GeoService, WeatherService };
