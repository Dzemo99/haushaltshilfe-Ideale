/* ==========================================================================
   ZENTRALE KONFIGURATION
   --------------------------------------------------------------------------
   >>> HIER (und nur hier) trägst du deine IDs ein. <<<
   Diese Datei wird auf jeder Seite als erstes Skript geladen.
   ========================================================================== */
window.SITE_CONFIG = {

  /* ----------------------------------------------------------------
     Google Ads
     Zu finden in Google Ads unter:  Tools -> Messung -> Conversions
     ---------------------------------------------------------------- */

  // TODO: Conversion-ID eintragen, Format: 'AW-1234567890'
  // Solange hier 'AW-XXXXXXXXXX' steht, wird KEIN Google-Tag geladen.
  adsConversionId: 'AW-XXXXXXXXXX',

  // TODO: Conversion-Labels eintragen (das Kürzel HINTER dem Schrägstrich).
  // Beispiel: Google Ads zeigt 'AW-1234567890/AbCdEfGhIj' -> hier 'AbCdEfGhIj'
  conversionLabels: {
    formular: 'TODO_LABEL_FORMULAR',   // Conversion-Aktion "Lead / Formularanfrage"
    anruf:    'TODO_LABEL_ANRUF',      // Conversion-Aktion "Anruf (Klick auf Telefonnummer)"
    whatsapp: 'TODO_LABEL_WHATSAPP',   // Conversion-Aktion "WhatsApp-Klick" (optional)
  },

  /* ----------------------------------------------------------------
     Google Analytics 4 (optional)
     Zu finden in GA4 unter: Verwaltung -> Datenstreams
     ---------------------------------------------------------------- */

  // TODO (optional): GA4-Mess-ID eintragen, Format: 'G-XXXXXXXXXX'
  // Leer lassen ('') wenn kein GA4 gewünscht ist.
  ga4MeasurementId: '',

  /* ----------------------------------------------------------------
     Formspree – Endpunkt des Anfrageformulars
     ---------------------------------------------------------------- */
  formspreeEndpoint: 'https://formspree.io/f/xjybbgee',
};
