# Ideale Haushaltshilfe – Landingpage

Statische Landingpage für **Ideale Haushaltshilfe** (Haushaltshilfe & Alltagsbegleitung
in Göttingen und Region). Reines HTML/CSS/Vanilla-JS – kein Build-Schritt, kein Framework.

**Live:** https://idealehaushaltshilfe.de _(Domain muss noch bei Netlify verbunden werden)_

---

## Lokale Vorschau

Voraussetzung: [Node.js](https://nodejs.org) installiert.

```bash
node .tools/serve.js
# -> http://localhost:8080
```

Alternativ jeder beliebige statische Server, z. B. `npx serve .`.

---

## Projektstruktur

```
/
├── index.html            Startseite (Hero, Leistungen, FAQ, Anfrageformular …)
├── danke.html            Bestätigungsseite (noindex)
├── impressum.html        Impressum nach § 5 DDG
├── datenschutz.html      Datenschutzerklärung (DSGVO)
├── css/styles.css        Komplettes Stylesheet, Farben als CSS-Variablen in :root
├── js/
│   ├── config.js         >>> ALLE IDs (Google Ads, GA4, Formspree) <<<
│   ├── consent.js        Cookie-Banner + Google Consent Mode v2
│   └── main.js           Navigation, Formularversand, Conversion-Tracking
├── assets/               Optimierte Bilder (WebP), Logo, Favicons
├── netlify.toml          Publish-Verzeichnis, Security-Header, Redirects
├── robots.txt
├── sitemap.xml
├── .tools/               Nur lokal: Bildoptimierung + Vorschau-Server (gitignored)
└── _originale/           Original-Bilder, unkomprimiert (gitignored)
```

---

## Wo trage ich was ein?

| Was | Datei |
|---|---|
| Google-Ads-Conversion-ID (`AW-17763019825`) | `js/config.js`, Zeile 14 – eingetragen |
| Formular-Conversion (Lead) | `js/config.js`, Zeile 33 – **aktiv** |
| Anruf-Conversion | `js/config.js`, Zeile 39 – auskommentiert, inaktiv |
| WhatsApp-Conversion | `js/config.js`, Zeile 42 – auskommentiert, inaktiv |
| **GA4-Mess-ID** (optional) | `js/config.js` |
| **Formspree-Endpunkt** | `js/config.js` (+ `action` am `<form>` in `index.html`) |
| **Domain** (`https://IHRE-DOMAIN.de`) | `index.html`, `impressum.html`, `datenschutz.html`, `robots.txt`, `sitemap.xml` |
| **Markenfarben** | `css/styles.css`, Block `:root` |
| **Telefon / WhatsApp / E-Mail** | Alle HTML-Dateien (suchen nach `29214304`) |

Alle Inhalte sind ausgefüllt – es sind keine Platzhalter mehr im Code.

---

## Bilder neu aufbereiten

Originale nach `_originale/` legen, dann:

```bash
cd .tools
npm install          # einmalig
node inspect.js      # prüft alle Bilder auf Gültigkeit
node optimize.js     # schreibt optimierte WebP-Dateien nach ../assets
```

---

## Deployment (Netlify)

Die Seite ist mit GitHub verbunden: **jeder `git push` auf `main` löst automatisch
ein neues Deployment aus.**

```bash
git add -A
git commit -m "Beschreibung der Änderung"
git push
```

Einstellungen in Netlify:
- Build command: _(leer)_
- Publish directory: `.`

---

## Formular

Der Versand läuft über **Formspree** (Endpunkt in `js/config.js`), per `fetch` ohne
Seitenwechsel. Ohne JavaScript greift das `action`/`method`-Attribut am `<form>` als
Fallback.

Empfänger-E-Mail, Spam-Schutz und Domain-Beschränkung werden im
[Formspree-Dashboard](https://formspree.io/) eingestellt.

---

## Rechtliches

Impressum und Datenschutzerklärung sind vollständig ausgefüllt (Stand: 18.08.2026).
Sie ersetzen **keine Rechtsberatung** – bei Änderungen am Angebot bitte anpassen.

Der Abschnitt zu Google Analytics 4 wurde aus der Datenschutzerklärung entfernt,
weil `ga4MeasurementId` in `js/config.js` leer ist. Wird GA4 aktiviert, muss der
Abschnitt wieder ergänzt werden.

**Bildrechte:** Alle verwendeten Fotos stammen aus lizenzierten Stockfoto-Beständen.
