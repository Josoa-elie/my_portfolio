(function () {

    /* ── Hamburger ────────────────────────────────────────── */
    var toggle = document.getElementById('toggle');
    var menu = document.getElementById('menu');
    var overlay = document.getElementById('overlay');

    function openMenu() {
        toggle.classList.add('open'); menu.classList.add('open');
        overlay.classList.add('show'); toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        toggle.classList.remove('open'); menu.classList.remove('open');
        overlay.classList.remove('show'); toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    toggle.addEventListener('click', function () {
        menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(function (l) { l.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    /* ── Stagger observer ─────────────────────────────────── */
    var staggerEls = document.querySelectorAll('.stagger');
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
            if (!entry.isIntersecting) return;
            setTimeout(function () { entry.target.classList.add('visible'); }, i * 80);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.08 });
    staggerEls.forEach(function (el) { io.observe(el); });

    /* ── Compteur de caractères ───────────────────────────── */
    var textarea = document.getElementById('message');
    var charCount = document.getElementById('char-count');
    textarea.addEventListener('input', function () {
        charCount.textContent = textarea.value.length;
    });

    /* ── Validation & soumission ──────────────────────────── */
    var form = document.getElementById('contact-form');
    var submitBtn = document.getElementById('submit-btn');
    var toast = document.getElementById('toast');
    var toastMsg = document.getElementById('toast-msg');
    var toastIcon = document.getElementById('toast-icon');
    var toastTimer;

    function showToast(type, msg) {
        clearTimeout(toastTimer);
        toastMsg.textContent = msg;
        toast.className = 'toast toast--' + type;

        if (type === 'success') {
            toastIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00dc96" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
        } else {
            toastIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5566" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
        }

        requestAnimationFrame(function () {
            toast.classList.add('show');
        });
        toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 5000);
    }

    function validateField(id, groupId, check) {
        var el = document.getElementById(id);
        var group = document.getElementById(groupId);
        var ok = check(el.value.trim());
        group.classList.toggle('has-error', !ok);
        return ok;
    }

    function validateAll() {
        var ok = true;
        if (!validateField('prenom', 'g-prenom', function (v) { return v.length >= 2; })) ok = false;
        if (!validateField('nom', 'g-nom', function (v) { return v.length >= 2; })) ok = false;
        if (!validateField('email', 'g-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); })) ok = false;
        if (!validateField('sujet', 'g-sujet', function (v) { return v !== ''; })) ok = false;
        if (!validateField('message', 'g-message', function (v) { return v.length >= 20; })) ok = false;
        return ok;
    }

    /* live validation on blur */
    ['prenom', 'nom', 'email', 'sujet', 'message'].forEach(function (id) {
        var el = document.getElementById(id);
        el.addEventListener('blur', function () {
            validateAll();
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateAll()) {
            showToast('error', 'Veuillez corriger les erreurs avant d\'envoyer.');
            return;
        }

        /* simulate sending */
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(function () {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            form.reset();
            charCount.textContent = '0';
            showToast('success', 'Message envoyé ! Je vous répondrai sous 24h.');
            ['prenom', 'nom', 'email', 'sujet', 'message'].forEach(function (id) {
                var g = document.getElementById('g-' + id);
                if (g) g.classList.remove('has-error');
            });
        }, 1800);
    });

})();