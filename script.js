document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.querySelector('.navbar');
    const navLinks = navMenu?.querySelectorAll('.nav-link');
    const mobileBreakpoint = window.matchMedia('(max-width: 768px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let closeTimer;
    let openingFrame;
    let closeTransitionHandler;

    if (!hamburgerBtn || !navMenu || !navbar) return;

    const clearPendingAnimations = () => {
        window.clearTimeout(closeTimer);
        window.cancelAnimationFrame(openingFrame);
        if (closeTransitionHandler) {
            navMenu.removeEventListener('transitionend', closeTransitionHandler);
        }
        closeTimer = undefined;
        openingFrame = undefined;
        closeTransitionHandler = undefined;
    };

    const setClosedState = () => {
        hamburgerBtn.classList.remove('is-open');
        navMenu.classList.remove('is-opening', 'is-open', 'is-closing');
        navbar.classList.remove('is-open');
        document.body.classList.remove('menu-is-open');

        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Abrir menú de navegación');
    };

    const closeMenu = ({ animate = true } = {}) => {
        clearPendingAnimations();

        const canAnimate = animate && mobileBreakpoint.matches && !reducedMotion.matches;
        const wasOpen = navMenu.classList.contains('is-open');

        hamburgerBtn.classList.remove('is-open');
        navbar.classList.remove('is-open');
        document.body.classList.remove('menu-is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Abrir menú de navegación');

        if (!canAnimate || !wasOpen) {
            setClosedState();
            return;
        }

        navMenu.classList.remove('is-opening', 'is-open');
        navMenu.classList.add('is-closing');

        closeTransitionHandler = (event) => {
            if (event && (event.target !== navMenu || event.propertyName !== 'opacity')) return;

            navMenu.removeEventListener('transitionend', closeTransitionHandler);
            window.clearTimeout(closeTimer);
            closeTransitionHandler = undefined;
            navMenu.classList.remove('is-closing');
        };

        navMenu.addEventListener('transitionend', closeTransitionHandler);
        closeTimer = window.setTimeout(closeTransitionHandler, 300);
    };

    const openMenu = () => {
        clearPendingAnimations();
        navMenu.classList.remove('is-closing');

        hamburgerBtn.classList.add('is-open');
        navbar.classList.add('is-open');
        document.body.classList.add('menu-is-open');

        hamburgerBtn.setAttribute('aria-expanded', 'true');
        hamburgerBtn.setAttribute('aria-label', 'Cerrar menú de navegación');

        if (reducedMotion.matches) {
            navMenu.classList.add('is-open');
        } else {
            navMenu.classList.add('is-opening');
            openingFrame = window.requestAnimationFrame(() => {
                navMenu.classList.remove('is-opening');
                navMenu.classList.add('is-open');
            });
        }

        navLinks[0]?.focus();
    };

    // Estado inicial: SIEMPRE cerrado
    closeMenu({ animate: false });

    // El botón hamburguesa controla exclusivamente la apertura/cierre
    hamburgerBtn.addEventListener('click', (event) => {
        event.stopPropagation();

        const isOpen = navMenu.classList.contains('is-open');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Cerrar al seleccionar una opción
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Permite cerrar rápidamente el menú desde el teclado.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
            closeMenu();
            hamburgerBtn.focus();
        }
    });

    // Si volvemos a desktop, cerrar el menú
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu({ animate: false });
        }
    });
});
