/* ==========================================================================
   ZENTRALE KONFIGURATION
   --------------------------------------------------------------------------
   >>> HIER (und nur hier) trägst du deine IDs ein. <<<
   Diese Datei wird auf jeder Seite als erstes Skript geladen.
   ========================================================================== */
window.SITE_CONFIG = {

  /* ----------------------------------------------------------------
     Google Ads
     ---------------------------------------------------------------- */

  // Conversion-ID – eingetragen und aktiv.
  adsConversionId: 'AW-17763019825',

  /* ----------------------------------------------------------------
     >>> HIER DIE ZWEI LABELS EINSETZEN <<<

     Wo finde ich sie?
       Google Ads -> Tools -> Messung -> Conversions
       -> Conversion-Aktion anklicken -> "Tag einrichten"
       -> dort steht: send_to: 'AW-17763019825/AbCdEfGhIjKl'
          Gebraucht wird NUR der Teil hinter dem Schrägstrich.

     Beispiel:  formular: 'AbCdEfGhIjKl',

     Solange hier noch "..._LABEL" steht, wird diese Conversion bewusst
     NICHT gefeuert – so entstehen keine falschen Messwerte.
     ---------------------------------------------------------------- */
  conversionLabels: {
    // AKTIV – Conversion-Aktion "Formular Haushaltshilfe".
    // Feuert im Erfolgsfall des Anfrageformulars (Formspree-Antwort ok).
    //
    // ACHTUNG: Das Label beginnt mit einem BINDESTRICH ("-Gj9C…").
    // Der gehört zum Label und darf beim Kopieren nicht wegfallen –
    // sonst geht ein falsches send_to an Google und nichts wird gemessen.
    formular: '-Gj9COqjoNwcELHYiJZC',

    // AKTIV – Anruf-Conversion.
    // Feuert beim Klick auf jeden tel:-Link (Header, Hero, Kontakt,
    // Footer, Floating-Button). Der Anruf startet dabei ganz normal.
    anruf: 'i7a_CKPxo9wcELHYiJZC',

    // DEAKTIVIERT – optionale WhatsApp-Conversion.
    // whatsapp: 'WHATSAPP_LABEL',
  },

  /* ----------------------------------------------------------------
     Google Analytics 4 (optional)
     Zu finden in GA4 unter: Verwaltung -> Datenstreams
     ---------------------------------------------------------------- */

  // Bewusst leer: GA4 wird derzeit nicht eingesetzt.
  // Wird hier eine Mess-ID ('G-XXXXXXXXXX') eingetragen, muss in datenschutz.html
  // wieder ein eigener Abschnitt zu Google Analytics 4 ergaenzt werden.
  ga4MeasurementId: '',

  /* ----------------------------------------------------------------
     Ladeverhalten des Google-Tags
     ----------------------------------------------------------------
     false (empfohlen, DSGVO-sicher):
        gtag.js wird ERST nach dem Klick auf "Akzeptieren" geladen.
        Vor der Einwilligung geht kein einziger Request an Google raus.

     true (Googles Standardvorgabe):
        gtag.js lädt sofort beim Seitenaufruf. Consent Mode v2 steht dabei
        auf "denied", es werden also keine Werbe-Cookies gesetzt – Google
        sendet aber cookielose Pings. Deutsche Aufsichtsbehörden sehen das
        teilweise kritisch. Nur umstellen, wenn das bewusst gewollt ist.
     ---------------------------------------------------------------- */
  tagVorEinwilligungLaden: false,

  /* ----------------------------------------------------------------
     Formspree – Endpunkt der Formulare
     ---------------------------------------------------------------- */
  formspreeEndpoint: 'https://formspree.io/f/xjybbgee',
};
