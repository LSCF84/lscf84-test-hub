document.addEventListener('DOMContentLoaded', () => {
    // Claves de almacenamiento local
    const CONSENT_KEY = 'cookie_consent_lscf';
    const PREFS_KEY = 'cookie_prefs';

    // Referencias a elementos del DOM
    const banner = document.getElementById('cookie-banner');
    const modal = document.getElementById('cookie-modal');
    const acceptAllBtn = document.getElementById('accept-all-btn');
    const configureBtn = document.getElementById('configure-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const savePreferencesBtn = document.getElementById('save-preferences-btn');
    const performanceCheckbox = document.getElementById('performance-checkbox');
    
    // Estado interno
    let currentConsentStatus = localStorage.getItem(CONSENT_KEY) || 'pendiente';
    let currentPreferences = { necesarias: true, rendimiento: false };

    /**
     * Carga las preferencias almacenadas desde localStorage.
     */
    function loadPreferences() {
        try {
            const storedPrefs = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
            // Fusionar con valores por defecto para evitar errores
            currentPreferences = { ...currentPreferences, ...storedPrefs };
        } catch (e) {
            console.error("Error al cargar preferencias de cookies:", e);
        }
    }

    /**
     * Guarda el estado del consentimiento y las preferencias.
     * @param {string} status - 'aceptado' o 'configurado'.
     * @param {object} prefs - Las preferencias actuales.
     */
    function saveConsent(status, prefs) {
        localStorage.setItem(CONSENT_KEY, status);
        localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
        currentConsentStatus = status;
        
        // Oculta el modal y el banner
        modal.classList.add('hidden');
        banner.classList.add('hidden');
        
        applyCookieActions(prefs);
    }

    /**
     * Ejecuta o bloquea scripts de terceros según las preferencias.
     * En un proyecto real, aquí se inyectarían/eliminarían dinámicamente los scripts de Google Analytics.
     * @param {object} prefs - Las preferencias actuales.
     */
    function applyCookieActions(prefs) {
        if (prefs.rendimiento) {
            console.log("ACCION: Scripts de Rendimiento (Analytics) HABILITADOS.");
            // Aquí iría la lógica para cargar Google Analytics o scripts de seguimiento.
        } else {
            console.log("ACCION: Scripts de Rendimiento (Analytics) DESHABILITADOS/BLOQUEADOS.");
            // Aquí iría la lógica para asegurar que no se carguen los scripts o se borren cookies de análisis.
        }
    }

    /**
     * Muestra el banner si el estado es 'pendiente'.
     */
    function showBannerIfPending() {
        if (currentConsentStatus === 'pendiente') {
            banner.classList.remove('hidden');
        } else {
            // Si ya hay consentimiento, aplicar las acciones al cargar la página.
            applyCookieActions(currentPreferences);
        }
    }

    // --- MANEJADORES DE EVENTOS ---

    // 1. Aceptar Todo
    acceptAllBtn.addEventListener('click', () => {
        const acceptedPrefs = { necesarias: true, rendimiento: true };
        saveConsent('aceptado', acceptedPrefs);
    });

    // 2. Abrir Modal de Configuración
    configureBtn.addEventListener('click', () => {
        loadPreferences(); // Asegurar que cargamos las últimas preferencias
        performanceCheckbox.checked = currentPreferences.rendimiento;
        modal.classList.remove('hidden');
    });

    // 3. Cancelar Modal / Cerrar
    cancelModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    // Clic fuera del modal para cerrar
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // 4. Guardar Preferencias
    savePreferencesBtn.addEventListener('click', () => {
        const newPrefs = {
            necesarias: true, // Siempre true
            rendimiento: performanceCheckbox.checked
        };
        // Usamos 'configurado' para el estado
        saveConsent('configurado', newPrefs); 
    });

    // 5. Inicialización al cargar la página
    loadPreferences();
    showBannerIfPending();
});
