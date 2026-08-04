/* ==========================================================================
   Ideale Haushaltshilfe – main.js
   Bewusst schlank: kein Framework, keine externen Abhängigkeiten.
   Inhalt:
     1) Mobile-Navigation
     2) Schatten am Sticky-Header
     3) Jahreszahl im Footer
     4) Conversion-Helfer (Google Ads) – respektiert die Einwilligung
     5) Anfrageformular via Formspree (AJAX, ohne Seitenwechsel)
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};

  /* ----------------------------------------------------------------
     1) Mobile-Navigation auf-/zuklappen
     ---------------------------------------------------------------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Menü öffnen');
      }
    });
  }

  /* ----------------------------------------------------------------
     2) Header bekommt beim Scrollen einen Schatten
     ---------------------------------------------------------------- */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------
     3) Aktuelles Jahr im Footer
     ---------------------------------------------------------------- */
  var jahr = document.getElementById('jahr');
  if (jahr) jahr.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------------
     4) CONVERSION-HELFER
     Feuert eine Google-Ads-Conversion – aber nur, wenn
       a) der Nutzer eingewilligt hat  UND
       b) in js/config.js echte IDs hinterlegt sind.
     Solange Platzhalter drinstehen, passiert bewusst nichts.
     ---------------------------------------------------------------- */
  function conversionFeuern(typ) {
    // a) Einwilligung prüfen
    if (typeof window.hatEinwilligung === 'function' && !window.hatEinwilligung()) return;
    if (typeof window.gtag !== 'function') return;

    var adsId = CFG.adsConversionId || '';
    var label = (CFG.conversionLabels || {})[typ] || '';

    // b) Platzhalter erkennen und abbrechen
    if (!adsId || adsId.indexOf('AW-X') === 0) return;
    if (!label || label.indexOf('TODO_') === 0) return;

    window.gtag('event', 'conversion', { send_to: adsId + '/' + label });
  }
  window.conversionFeuern = conversionFeuern;

  // An alle Elemente mit data-conversion="anruf" / "whatsapp" hängen.
  // Wichtig: Wir blockieren den Klick NICHT – der Anruf startet sofort.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-conversion]');
    if (el) conversionFeuern(el.getAttribute('data-conversion'));
  });

  /* ----------------------------------------------------------------
     5) ANFRAGEFORMULAR (Formspree via fetch)
     Kein Seitenwechsel: Erfolg/Fehler werden direkt im Formular gemeldet.
     Ohne JavaScript greift das action/method-Attribut am <form> als Fallback.
     ---------------------------------------------------------------- */
  var form = document.getElementById('anfrage-form');

  if (form && window.fetch) {
    var successBox = form.querySelector('[data-fs-success]');
    var errorBox   = form.querySelector('[data-fs-error]');
    var submitBtn  = form.querySelector('[data-fs-submit-btn]');
    var fields     = form.querySelector('[data-fs-fields]');
    var btnText    = submitBtn ? submitBtn.textContent : '';

    var meldungZeigen = function (box, text) {
      if (!box) return;
      box.textContent = text;
      box.hidden = false;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Browser-Validierung zuerst durchlaufen lassen
      if (!form.reportValidity()) return;

      if (errorBox) errorBox.hidden = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet …';
      }

      fetch(CFG.formspreeEndpoint || form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (daten) {
            return { ok: res.ok, daten: daten };
          });
        })
        .then(function (r) {
          if (!r.ok) throw r.daten;

          // --- ERFOLG: das ist unsere Lead-Conversion ---
          conversionFeuern('formular');

          if (fields) fields.hidden = true;
          meldungZeigen(
            successBox,
            'Vielen Dank! Ihre Anfrage ist bei uns angekommen. Wir melden uns schnellstmöglich bei Ihnen.'
          );
          if (successBox) successBox.focus({ preventScroll: true });
          form.reset();
        })
        .catch(function (fehler) {
          var text = 'Das Absenden hat leider nicht geklappt. Bitte versuchen Sie es erneut ' +
                     'oder rufen Sie uns einfach an: 0551 29214304.';
          if (fehler && Array.isArray(fehler.errors) && fehler.errors.length) {
            text = fehler.errors.map(function (f) { return f.message; }).join(' ');
          }
          meldungZeigen(errorBox, text);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = btnText;
          }
        });
    });
  }
})();
