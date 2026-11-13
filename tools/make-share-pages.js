/* Builds read/<n>/index.html for every work in works.js.
   Link previews (WhatsApp, Facebook, X, Telegram) ignore everything after "#", so a
   shared "#/read/<n>" link always showed the home page. Each small page here carries
   that work's own title, excerpt and picture, then sends readers on to the app.
   Run after adding or editing a work:  node tools/make-share-pages.js           */
const fs = require("fs");
const path = require("path");

const ORIGIN = "https://www.sriramwrites.in";
const SITE = "Sriram Writes";
const root = path.join(__dirname, "..");

const src = fs.readFileSync(path.join(root, "works.js"), "utf8");
const works = new Function(src + "; return works;")();
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const abs = (p) => (/^https?:/.test(p) ? p : ORIGIN + "/" + p.replace(/^\//, ""));
// WhatsApp doesn't reliably show WebP previews: use a .jpg copy beside the picture when there is one.
const shareImage = (p) => {
  const jpg = p.replace(/\.webp$/i, ".jpg");
  return jpg !== p && fs.existsSync(path.join(root, jpg.replace(/^\//, ""))) ? jpg : p;
};

const outDir = path.join(root, "read");
fs.rmSync(outDir, { recursive: true, force: true });

works.forEach((w, i) => {
  const n = i + 1;
  const url = `${ORIGIN}/read/${n}/`;
  const img = w.image
    ? { src: abs(shareImage(w.image.src)), width: w.image.width, height: w.image.height, alt: w.image.alt || w.title }
    : { src: `${ORIGIN}/assets/share.jpg`, width: 670, height: 550, alt: SITE };
  const desc = w.excerpt || "";
  const html = `<!doctype html>
<html lang="ta">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(w.title)} — ${SITE}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${SITE}">
  <meta property="og:locale" content="ta_IN">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(w.title)}">
  <meta property="og:description" content="${esc(w.type ? w.type + " · " : "")}${esc(desc)}">
  <meta property="og:image" content="${esc(img.src)}">
  <meta property="og:image:width" content="${img.width}">
  <meta property="og:image:height" content="${img.height}">
  <meta property="og:image:alt" content="${esc(img.alt)}">
  <meta name="twitter:card" content="summary_large_image">
  <script>location.replace("/" + (location.hash.length > 1 ? location.hash : "#/read/${n}"));</script>
</head>
<body>
  <p><a href="/#/read/${n}">${esc(w.title)}</a></p>
</body>
</html>
`;
  fs.mkdirSync(path.join(outDir, String(n)), { recursive: true });
  fs.writeFileSync(path.join(outDir, String(n), "index.html"), html);
});
console.log(`Wrote ${works.length} share pages to read/`);
