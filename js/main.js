(function () {
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
        if (menu.classList.contains('open')) { closeMenu(); }
        else { openMenu(); }
    });

    overlay.addEventListener('click', closeMenu);

    // close on link click
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });
})();