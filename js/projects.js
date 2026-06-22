(function () {

    // ── Hamburger ──────────────────────────────────────────
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

    // ── Filtres ─────────────────────────────────────────────
    var filterBtns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.project-card');
    var empty = document.getElementById('empty');
    var current = 'all';

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var cat = btn.getAttribute('data-filter');
            if (cat === current) return;
            current = cat;

            filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');

            var visible = 0;
            cards.forEach(function (card, i) {
                var match = cat === 'all' || card.getAttribute('data-cat') === cat;
                if (match) {
                    card.classList.remove('hidden');
                    // re-trigger stagger
                    card.classList.remove('visible');
                    setTimeout(function () { card.classList.add('visible'); }, i * 60);
                    visible++;
                } else {
                    card.classList.add('hidden');
                }
            });

            empty.classList.toggle('show', visible === 0);
        });
    });

    // ── Intersection Observer (stagger au scroll) ────────────
    var staggerEls = document.querySelectorAll('.stagger');
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var siblings = entry.target.parentNode.querySelectorAll('.stagger');
            var idx = Array.from(siblings).indexOf(entry.target);
            setTimeout(function () {
                entry.target.classList.add('visible');
            }, idx * 70);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    staggerEls.forEach(function (el) { io.observe(el); });

})();