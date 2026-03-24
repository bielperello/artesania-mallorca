// main.js

function openWeatherModal() {
    const modal = document.getElementById('weather-modal');
    const modalContent = document.getElementById('weather-modal-content');
    if(!modal || !modalContent) return;

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
    if(!modal || !modalContent) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}

function openModal() {
    const modal = document.getElementById('craft-modal');
    const modalContent = document.getElementById('craft-modal-content');
    
    if(!modal || !modalContent) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Un petit delay per permetre que la transició CSS s'apliqui
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
    
    if(!modal || !modalContent) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    
    // Esperar a que acabi la transició abans d'amagar el DOM
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('craft-modal');
    const weatherModal = document.getElementById('weather-modal');
    
    // Tancar modals clicant fora del contingut
    if(modal) {
        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeModal();
        });
    }
    
    if(weatherModal) {
        weatherModal.addEventListener('click', (e) => {
            if(e.target === weatherModal) closeWeatherModal();
        });
    }
    
    // Map Filter buttons toggle logic
    const mapFilterButtons = document.querySelectorAll('#mapa details button');
    mapFilterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('border-primary')) {
                this.classList.remove('bg-primary/10', 'border-primary', 'text-primary', 'shadow-[0_0_15px_rgba(236,73,19,0.3)]');
                this.classList.add('bg-white', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
                const textSpan = Array.from(this.querySelectorAll('span')).find(s => !s.classList.contains('material-symbols-outlined'));
                if (textSpan) {
                    textSpan.classList.remove('font-bold');
                    textSpan.classList.add('font-medium');
                }
            } else {
                this.classList.remove('bg-white', 'dark:bg-slate-800', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
                this.classList.add('bg-primary/10', 'border-primary', 'text-primary');
                if (!this.querySelector('.material-symbols-outlined')) {
                    this.classList.add('shadow-[0_0_15px_rgba(236,73,19,0.3)]');
                }
                const textSpan = Array.from(this.querySelectorAll('span')).find(s => !s.classList.contains('material-symbols-outlined'));
                if (textSpan) {
                    textSpan.classList.remove('font-medium');
                    textSpan.classList.add('font-bold');
                }
            }
        });
    });
});

// Geolocation logic
function toggleGeolocation() {
    const geoPanel = document.getElementById('geo-popup');
    const geoIcon = document.getElementById('geo-icon');
    if(!geoPanel || !geoIcon) return;
    
    if (geoPanel.classList.contains('hidden')) {
        geoPanel.classList.remove('hidden');
        geoIcon.classList.add('text-blue-600', 'animate-pulse');
        setTimeout(() => {
            geoPanel.classList.remove('opacity-0', 'translate-y-2');
            geoPanel.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    } else {
        geoPanel.classList.remove('opacity-100', 'translate-y-0');
        geoPanel.classList.add('opacity-0', 'translate-y-2');
        geoIcon.classList.remove('text-blue-600', 'animate-pulse');
        setTimeout(() => {
            geoPanel.classList.add('hidden');
        }, 300);
    }
}

// AI Chat logic
function toggleAIChat() {
    const chatPanel = document.getElementById('ai-chat-panel');
    if(!chatPanel) return;
    
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

// Grid Layout logic
function setGridCols(cols, btnElement) {
    const grid = document.getElementById('catalog-grid');
    if(!grid) return;
    
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
}

// Favorite Toggle logic
function toggleFavoriteCard(btn, event) {
    if(event) event.stopPropagation();
    const icon = btn.querySelector('.material-symbols-outlined');
    if (icon.classList.contains('fill-current') && icon.classList.contains('text-red-500')) {
        icon.classList.remove('fill-current', 'text-red-500');
        btn.classList.remove('text-red-500');
        btn.classList.add('text-slate-400');
    } else {
        icon.classList.add('fill-current', 'text-red-500');
        btn.classList.remove('text-slate-400');
        btn.classList.add('text-red-500');
    }
}
