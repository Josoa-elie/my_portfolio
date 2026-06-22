(function () {
    // ── Hamburger menu ──────────────────────────────────
    var toggle = document.getElementById('toggle');
    var menu = document.getElementById('menu');
    var overlay = document.getElementById('overlay');

    function openMenu() {
        toggle.classList.add('open');
        menu.classList.add('open');
        overlay.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        toggle.classList.remove('open');
        menu.classList.remove('open');
        overlay.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
        menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(function (l) { l.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    // ── Intersection Observer : stagger cards ───────────
    var items = document.querySelectorAll('.stagger');
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
                // délai progressif selon l'index dans son groupe
                var delay = (Array.from(entry.target.parentNode.children).indexOf(entry.target)) * 80;
                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, delay);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });
})();
