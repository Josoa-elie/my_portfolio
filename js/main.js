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


// --- Indicateur de téléchargement pour le CV ---
(function () {
  var link = document.getElementById('download-cv');
  var indicator = document.getElementById('download-indicator');
  var status = document.getElementById('download-status');
  var progressFill = indicator ? indicator.querySelector('.progress-fill') : null;

  if (!link || !indicator) return;

  // true = essayer d'afficher une progression réelle via XHR; false = animation fictive courte
  var useRealProgress = true;

  link.addEventListener('click', function (e) {
    e.preventDefault();
    var url = link.getAttribute('href');
    if (!url) return;

    indicator.classList.add('active');
    indicator.setAttribute('aria-hidden', 'false');
    link.setAttribute('aria-busy', 'true');
    status.textContent = 'Préparation du téléchargement...';

    if (!useRealProgress) {
      setTimeout(function () {
        triggerNativeDownload(url);
        setTimeout(resetIndicator, 1200);
      }, 600);
      return;
    }

    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';

      xhr.onprogress = function (event) {
        if (event.lengthComputable) {
          var percent = Math.round((event.loaded / event.total) * 100);
          indicator.classList.add('progressing');
          if (progressFill) progressFill.style.width = percent + '%';
          status.textContent = 'Téléchargement : ' + percent + '%';
        } else {
          status.textContent = 'Téléchargement en cours...';
        }
      };

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          status.textContent = 'Téléchargement terminé — préparation du fichier...';
          var blob = xhr.response;
          var filename = deriveFilenameFromHeader(xhr) || (url.split('/').pop() || 'download.pdf');
          saveBlob(blob, filename);
          resetIndicator();
        } else {
          status.textContent = 'Erreur lors du téléchargement';
          setTimeout(resetIndicator, 2000);
        }
      };

      xhr.onerror = function () {
        status.textContent = 'Erreur réseau lors du téléchargement';
        setTimeout(resetIndicator, 2000);
      };

      xhr.send();
    } catch (err) {
      console.error(err);
      triggerNativeDownload(url);
      setTimeout(resetIndicator, 1200);
    }
  });

  function triggerNativeDownload(url) {
    var a = document.createElement('a');
    a.href = url;
    if (link.hasAttribute('download')) a.setAttribute('download', '');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function saveBlob(blob, filename) {
    var blobUrl = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  }

  function deriveFilenameFromHeader(xhr) {
    var disposition = xhr.getResponseHeader('Content-Disposition');
    if (!disposition) return null;
    var match = /filename\*?=(?:UTF-8'')?["']?([^;"']+)/i.exec(disposition);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function resetIndicator() {
    indicator.classList.remove('active', 'progressing');
    indicator.setAttribute('aria-hidden', 'true');
    link.removeAttribute('aria-busy');
    if (progressFill) progressFill.style.width = '0%';
    status.textContent = '';
  }
})();
