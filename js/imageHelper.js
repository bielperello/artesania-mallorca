// imageHelper.js — Mòdul d'optimització i gestió d'imatges
// Proporciona funcions per crear elements <img> optimitzats amb lazy loading,
// gestió d'errors i preparació per a srcset/sizes amb formats moderns.

// ══════════════════════════════════════════════════════════════
// CONFIGURACIÓ DE MIDES — Patrons estàndard per a `sizes`
// ══════════════════════════════════════════════════════════════

const IMAGE_SIZES = {
    /** Thumbnail petit (llista de tallers, avatars) */
    thumbnail: '(max-width: 640px) 100vw, 300px',
    /** Targeta del catàleg */
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    /** Imatge hero a pantalla completa */
    hero: '100vw',
    /** Element de galeria */
    gallery: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    /** Avatar d'artesà (cercle petit) */
    avatar: '96px',
};

// ══════════════════════════════════════════════════════════════
// PLACEHOLDER SVG — Mostrat quan una imatge falla
// ══════════════════════════════════════════════════════════════

const IMAGE_PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Ctext x='50%25' y='45%25' font-family='system-ui,sans-serif' font-size='40' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'%3E🖼%3C/text%3E%3Ctext x='50%25' y='60%25' font-family='system-ui,sans-serif' font-size='13' fill='%2394a3b8' text-anchor='middle'%3EImatge no disponible%3C/text%3E%3C/svg%3E`;

// ══════════════════════════════════════════════════════════════
// FUNCIÓ PRINCIPAL — Crear HTML d'imatge optimitzada
// ══════════════════════════════════════════════════════════════

/**
 * Genera l'HTML per una imatge optimitzada amb lazy loading i gestió d'errors.
 *
 * @param {Object} config - Configuració de la imatge
 * @param {string} config.src - URL de la imatge principal (obligatòria)
 * @param {string} config.alt - Text alternatiu (obligatori per accessibilitat)
 * @param {string} [config.sizes='card'] - Clau de IMAGE_SIZES o valor personalitzat
 * @param {string} [config.className=''] - Classes CSS addicionals
 * @param {string} [config.aspectRatio=''] - Aspect ratio CSS (ex: 'aspect-[4/3]')
 * @param {boolean} [config.lazy=true] - Activar lazy loading (false = fetchpriority high per LCP)
 * @param {Object} [config.srcset] - Objecte amb variants per srcset
 * @param {string} [config.srcset.webp] - URL de la variant WebP
 * @param {string} [config.srcset.avif] - URL de la variant AVIF
 * @param {Array}  [config.srcset.widths] - Array de {url, width} per srcset responsive
 * @param {string} [config.style=''] - Estils inline addicionals
 * @returns {string} HTML de l'element <picture> o <img>
 */
function createResponsiveImage(config) {
    const {
        src,
        alt = '',
        sizes = 'card',
        className = '',
        aspectRatio = '',
        lazy = true,
        srcset = null,
        style = '',
    } = config;

    // Obtenir el valor de sizes des de la constant o usar-lo directament
    const sizesValue = IMAGE_SIZES[sizes] || sizes;

    // fetchpriority: 'high' per a imatges LCP (hero, non-lazy), 'auto' per a la resta
    // Ajuda al navegador a prioritzar el recurs crític per al LCP
    const fetchPriority = lazy ? 'auto' : 'high';

    // Atributs comuns de l'<img>
    const loadingAttr = lazy ? 'loading="lazy"' : '';
    const decodingAttr = lazy ? 'decoding="async"' : 'decoding="sync"';
    const fetchPriorityAttr = `fetchpriority="${fetchPriority}"`;
    const errorHandler = 'onerror="handleImageError(this)"';
    const baseClass = `${className} img-optimized`.trim();
    const styleAttr = style ? `style="${style}"` : '';

    // Si tenim variants de format modern, usar <picture>
    if (srcset && (srcset.avif || srcset.webp || srcset.widths)) {
        let sourcesHTML = '';

        // Source AVIF (màxima compressió)
        if (srcset.avif) {
            sourcesHTML += `<source srcset="${srcset.avif}" type="image/avif">`;
        }

        // Source WebP (bona compressió, suport universal)
        if (srcset.webp) {
            sourcesHTML += `<source srcset="${srcset.webp}" type="image/webp">`;
        }

        // Srcset responsive amb múltiples mides
        let imgSrcset = '';
        if (srcset.widths && srcset.widths.length > 0) {
            imgSrcset = `srcset="${srcset.widths.map(w => `${w.url} ${w.width}w`).join(', ')}" sizes="${sizesValue}"`;
        }

        return `<picture class="${aspectRatio}">
            ${sourcesHTML}
            <img src="${src}" alt="${alt}" ${imgSrcset} ${loadingAttr} ${decodingAttr} ${fetchPriorityAttr} ${errorHandler} class="${baseClass}" ${styleAttr}>
        </picture>`;
    }

    // Sense variants, retornar <img> simple optimitzat
    return `<img src="${src}" alt="${alt}" ${loadingAttr} ${decodingAttr} ${fetchPriorityAttr} ${errorHandler} class="${baseClass}" ${styleAttr}>`;
}


// ══════════════════════════════════════════════════════════════
// GESTIÓ D'ERRORS — Substituir imatges trencades
// ══════════════════════════════════════════════════════════════

/**
 * Gestiona l'error de càrrega d'una imatge.
 * Substitueix la imatge trencada per un placeholder SVG inline
 * i mostra una notificació a l'usuari (només una vegada per sessió).
 *
 * @param {HTMLImageElement} imgElement - L'element <img> que ha fallat
 */
function handleImageError(imgElement) {
    // Evitar bucle infinit si el placeholder també falla
    if (imgElement.dataset.errorHandled) return;
    imgElement.dataset.errorHandled = 'true';

    // Guardar la URL original per depuració
    const originalSrc = imgElement.src;
    console.warn(`[ImageHelper] Error carregant imatge: ${originalSrc}`);

    // Substituir per placeholder SVG
    imgElement.src = IMAGE_PLACEHOLDER_SVG;
    imgElement.alt = 'Imatge no disponible';

    // Afegir classe visual per indicar l'error
    imgElement.classList.add('img-error');
    imgElement.style.objectFit = 'contain';

    // Mostrar notificació (només una vegada per pàgina)
    if (!window._imageErrorNotified) {
        window._imageErrorNotified = true;
        if (typeof showToast === 'function') {
            showToast('Algunes imatges no s\'han pogut carregar', 'warning', 'broken_image');
        }
    }
}

// ══════════════════════════════════════════════════════════════
// OBSERVADOR D'ANIMACIONS — Fade-in al carregar
// ══════════════════════════════════════════════════════════════

/**
 * Inicialitza un IntersectionObserver per animar les imatges
 * quan entren al viewport (fade-in suau).
 * Cridar un cop després de renderApp().
 */
function initImageObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('img-loaded');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Observar totes les imatges optimitzades
    document.querySelectorAll('.img-optimized').forEach(img => {
        // Si la imatge ja està carregada (cached), marcar-la directament
        if (img.complete && img.naturalHeight > 0) {
            img.classList.add('img-loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('img-loaded');
            }, { once: true });
            observer.observe(img);
        }
    });
}
