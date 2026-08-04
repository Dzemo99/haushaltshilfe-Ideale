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
     4) CONVERSION-HELFER (Google Ads)

     Feuert   gtag('event', 'conversion', { send_to: 'AW-…/LABEL' })
     – aber nur, wenn ALLE drei Bedingungen erfüllt sind:
       a) der Nutzer hat im Cookie-Banner eingewilligt,
       b) das Google-Tag ist geladen (window.gtag vorhanden),
       c) in js/config.js steht ein echtes Label statt eines Platzhalters.

     Punkt c) verhindert, dass unvollständige send_to-Werte an Google gehen
     und dort als Fehler oder Falschmessung auftauchen.
     ---------------------------------------------------------------- */
  function istPlatzhalter(wert) {
    // Platzhalter sind: 'FORMULAR_LABEL', 'ANRUF_LABEL', 'WHATSAPP_LABEL'
    return !wert || /_LABEL$/.test(wert) || wert.indexOf('TODO') === 0;
  }

  function conversionFeuern(typ) {
    if (!typ) return;

    // a) Einwilligung
    if (typeof window.hatEinwilligung === 'function' && !window.hatEinwilligung()) return;
    // b) Tag geladen
    if (typeof window.gtag !== 'function') return;

    var adsId = CFG.adsConversionId || '';
    var label = (CFG.conversionLabels || {})[typ] || '';

    // c) Platzhalter erkennen und still abbrechen
    if (!adsId || adsId.indexOf('AW-X') === 0) return;
    if (istPlatzhalter(label)) return;

    window.gtag('event', 'conversion', { send_to: adsId + '/' + label });
  }
  window.conversionFeuern = conversionFeuern;

  /* --- Klick-Auslöser ---------------------------------------------
     Erkennt Anruf- und WhatsApp-Klicks zuverlässig, auch wenn irgendwo
     mal das data-conversion-Attribut vergessen wurde:
       - jedes data-conversion="…"
       - jeder Link, der mit tel: beginnt (inkl. Floating-Call-Button)
       - jeder Link auf wa.me / whatsapp.com
     Der Klick wird NICHT abgefangen – Anruf bzw. WhatsApp startet sofort.
     ---------------------------------------------------------------- */
  function typFuerElement(el) {
    if (el.hasAttribute('data-conversion')) return el.getAttribute('data-conversion');

    var href = (el.getAttribute('href') || '').toLowerCase();
    if (href.indexOf('tel:') === 0) return 'anruf';
    if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp.com') !== -1) return 'whatsapp';
    return null;
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[href], [data-conversion]');
    if (el) conversionFeuern(typFuerElement(el));
  });

  /* ----------------------------------------------------------------
     5) FORMULARE (Formspree via fetch)
     Kein Seitenwechsel: Erfolg/Fehler werden direkt im Formular gemeldet.
     Ohne JavaScript greift das action/method-Attribut am <form> als Fallback.

     optionen:
       dankeText     – Meldung nach erfolgreichem Versand
       conversionTyp – falls gesetzt, wird diese Google-Ads-Conversion gefeuert
     ---------------------------------------------------------------- */
  function formularAktivieren(form, optionen) {
    if (!form || !window.fetch) return;

    var successBox = form.querySelector('[data-fs-success]');
    var errorBox   = form.querySelector('[data-fs-error]');
    var submitBtn  = form.querySelector('[data-fs-submit-btn]');
    var fields     = form.querySelector('[data-fs-fields]');
    var btnText    = submitBtn ? submitBtn.textContent : '';

    function meldungZeigen(box, text) {
      if (!box) return;
      box.textContent = text;
      box.hidden = false;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Browser-Validierung zuerst durchlaufen lassen
      if (!form.reportValidity()) return;

      if (errorBox) errorBox.hidden = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet …';
      }

      fetch(form.action || CFG.formspreeEndpoint, {
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

          if (optionen.conversionTyp) conversionFeuern(optionen.conversionTyp);

          if (fields) fields.hidden = true;
          meldungZeigen(successBox, optionen.dankeText);
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

  // Anfrageformular – der erfolgreiche Versand ist unsere Lead-Conversion
  formularAktivieren(document.getElementById('anfrage-form'), {
    dankeText: 'Vielen Dank! Ihre Anfrage ist bei uns angekommen. ' +
               'Wir melden uns schnellstmöglich bei Ihnen.',
    conversionTyp: 'formular',
  });

  // Bewertungsformular – bewusst OHNE Conversion (das ist kein Lead)
  formularAktivieren(document.getElementById('bewertung-form'), {
    dankeText: 'Herzlichen Dank für Ihre Bewertung! Wir freuen uns sehr über Ihre Rückmeldung ' +
               'und lesen jede einzelne. Falls Sie der Veröffentlichung zugestimmt haben, ' +
               'prüfen wir Ihre Bewertung und stellen sie anschließend online.',
  });
})();
