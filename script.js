document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const cards = Array.from(track.children);
    
    let currentIndex = 0;
    
    // Calcula el ancho de cada tarjeta más su margen
    const getCardWidth = () => {
        if (cards.length === 0) return 0;
        const cardStyle = window.getComputedStyle(cards[0]);
        const cardWidth = cards[0].offsetWidth;
        const cardMarginRight = parseFloat(cardStyle.marginRight);
        return cardWidth + cardMarginRight;
    };

    // Función principal para mover el carrusel
    const updateTrack = () => {
        const width = getCardWidth();
        // Aplica la traducción (translateX) para mover el track
        track.style.transform = `translateX(${-(width * currentIndex)}px)`;
        
        // Actualiza el estado de los botones (deshabilitar en los extremos)
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === cards.length - 1;
    };

    // Navegación con botones
    nextButton.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateTrack();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateTrack();
        }
    });

    // ----------------------------------------
    // Lógica para SWIPE/Arrastre Táctil (Móviles)
    // ----------------------------------------
    let touchStartX = 0;
    let touchEndX = 0;

    // 1. Capturar el punto de inicio del toque
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    // 2. Capturar el punto final del toque
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    }, false);

    // 3. Procesar el gesto (swipe)
    const handleGesture = () => {
        const threshold = 50; // Mínima distancia para considerarlo un swipe
        const difference = touchStartX - touchEndX;

        if (difference > threshold) {
            // Swipe a la izquierda (quiere ver el siguiente proyecto)
            if (currentIndex < cards.length - 1) {
                currentIndex++;
            }
        } else if (difference < -threshold) {
            // Swipe a la derecha (quiere ver el proyecto anterior)
            if (currentIndex > 0) {
                currentIndex--;
            }
        }
        
        updateTrack();
    };

    // Manejar el redimensionamiento de la ventana (para recalcular el ancho de la tarjeta)
    window.addEventListener('resize', updateTrack);

    // Inicializar la posición al cargar la página
    updateTrack();
});
