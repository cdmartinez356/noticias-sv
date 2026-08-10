document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.querySelector('.navbar');

    if (!hamburgerBtn || !navMenu || !navbar) return;

    const closeMenu = () => {
        hamburgerBtn.classList.remove('is-open');
        navMenu.classList.remove('is-open');
        navbar.classList.remove('menu-open');

        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Abrir menú de navegación');
    };

    const openMenu = () => {
        hamburgerBtn.classList.add('is-open');
        navMenu.classList.add('is-open');
        navbar.classList.add('menu-open');

        hamburgerBtn.setAttribute('aria-expanded', 'true');
        hamburgerBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
    };

    // Estado inicial: SIEMPRE cerrado
    closeMenu();

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
    const navLinks = navMenu.querySelectorAll('.nav-link');

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Si volvemos a desktop, cerrar el menú
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});