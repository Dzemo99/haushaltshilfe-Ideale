// Kopiert die statische Website nach dist/ – damit Netlify immer dieselbe Seite
// veroeffentlicht, egal ob im Netlify-Projekt "." oder "dist" eingestellt ist.
const fs = require("fs");
const path = require("path");
const root = __dirname;
const out = path.join(root, "dist");
const items = ["index.html","alltagsbegleitung.html","danke.html","datenschutz.html",
  "einkaufshilfe.html","entlastungsbetrag.html","haushaltshilfe-pflegegrad.html",
  "impressum.html","robots.txt","sitemap.xml","css","js","assets"];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const it of items) {
  const src = path.join(root, it);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(out, it), { recursive: true });
}
console.log("dist/ erstellt:", fs.readdirSync(out).join(", "));
