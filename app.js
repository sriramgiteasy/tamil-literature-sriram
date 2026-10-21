/* Sriram Writes — hash-routed static site. No build step needed.
   Routes:  #/  ·  #/works  ·  #/works/<type>  ·  #/read/<n>  ·  #/about            */

const TYPES = [
  { key: "கவிதை", glyph: "கவி", plural: "கவிதைகள்", note: "சொற்களில் தங்கும் உணர்வுகள்" },
  { key: "கதை", glyph: "கதை", plural: "கதைகள்", note: "வாழ்விலிருந்து பிறக்கும் தருணங்கள்" },
  { key: "கட்டுரை", glyph: "உரை", plural: "கட்டுரைகள்", note: "எண்ணங்களும் அனுபவங்களும்" }
];
const SITE = "Sriram Writes";
const EMAIL = "hello@sriramwrites.in";

const all = (typeof works !== "undefined" ? works : []).map((w, i) => ({
  ...w,
  id: i + 1,
  minutes: Math.max(1, Math.round((w.body || "").split(/\s+/).filter(Boolean).length / 170))
}));

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const main = $("#main");
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const typeInfo = (key) => TYPES.find((t) => t.key === key);
const countOf = (key) => all.filter((w) => w.type === key).length;
const readHref = (w) => `#/read/${w.id}`;
const worksHref = (key) => (key ? `#/works/${encodeURIComponent(key)}` : "#/works");

/* ---------- reusable pieces ---------- */

function leaf(w, { showExcerpt = true } = {}) {
  return `
  <a class="leaf" href="${readHref(w)}">
    <span class="leaf-type">${esc(w.type)}</span>
    <span class="leaf-main">
      <h3>${esc(w.title)}</h3>
      ${showExcerpt && w.excerpt ? `<p>${esc(w.excerpt)}</p>` : ""}
    </span>
    <span class="leaf-meta">${w.date ? `<time>${esc(w.date)}</time>` : ""}<span>${w.minutes} நிமிட வாசிப்பு</span></span>
  </a>`;
}

function emptyState(message, hint) {
  return `<div class="empty"><h3>${esc(message)}</h3><p>${esc(hint)}</p></div>`;
}

function pageHead(title, lead, crumbs) {
  return `
  <div class="page-head">
    <nav class="crumbs" aria-label="நீங்கள் இருக்கும் இடம்">${crumbs}</nav>
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
  </div>`;
}

/* ---------- views ---------- */

function viewHome() {
  const latest = all.slice(-3).reverse();
  const featured = latest[0];
  return {
    title: `${SITE} — தமிழ் இலக்கியம்`,
    route: "home",
    html: `
    <section class="hero" id="top">
      <div class="hero-copy">
        <h1>சொற்களில்<br>சிறு உலகங்கள்.</h1>
        <p class="hero-description">கவிதைகள், கதைகள், கட்டுரைகள்—தமிழில் நான் எழுதும் எண்ணங்களுக்கும் அனுபவங்களுக்கும் ஒரு வீடு.</p>
        <div class="hero-actions">
          <a class="button" href="#/works">படைப்புகளை வாசி</a>
          <a class="text-link" href="#/about">எழுத்தாளரை அறிய</a>
        </div>
      </div>
      <figure class="hero-art">
        <img src="assets/writer-at-work.png" alt="புத்தகங்கள் நிறைந்த அறையில் எழுதிக்கொண்டிருக்கும் எழுத்தாளர்" width="1024" height="674">
        ${featured ? `<a class="hero-leaf leaf" href="${readHref(featured)}"><span class="leaf-type">புதியது</span><span class="leaf-main"><h3>${esc(featured.title)}</h3></span></a>` : ""}
      </figure>
    </section>

    <section class="wrap tiles-section" aria-labelledby="tiles-title">
      <h2 id="tiles-title" class="section-title">எதை வாசிக்க விரும்புகிறீர்கள்?</h2>
      <div class="tiles">
        ${TYPES.map((t) => `
        <a class="tile" href="${worksHref(t.key)}">
          <span class="tile-glyph" aria-hidden="true">${esc(t.glyph)}</span>
          <strong>${esc(t.plural)}</strong>
          <small>${esc(t.note)}</small>
          <span class="tile-count">${countOf(t.key)} படைப்பு${countOf(t.key) === 1 ? "" : "கள்"}</span>
        </a>`).join("")}
      </div>
    </section>

    <section class="wrap latest-section" aria-labelledby="latest-title">
      <div class="section-row">
        <h2 id="latest-title" class="section-title">சமீபத்திய படைப்புகள்</h2>
        <a class="text-link" href="#/works">அனைத்தையும் பார்</a>
      </div>
      <div class="leaves">${latest.length ? latest.map((w) => leaf(w)).join("") : emptyState("முதல் படைப்புக்காகக் காத்திருக்கிறோம்", "works.js கோப்பில் ஒரு படைப்பைச் சேர்த்தால் இங்கே தோன்றும்.")}</div>
    </section>

    <section class="about-band">
      <div class="wrap about-band-inner">
        <p class="quote">எழுதுவது என்பது<br>உலகைக் கவனிப்பது.</p>
        <div>
          <p>தமிழ் மொழியையும் அதன் கதைகளையும் நேசிக்கும் ஒரு வாசகன், எழுத்தாளன். இந்தத் தளத்தில் என் படைப்புகளையும், மனதில் தங்கும் சில எண்ணங்களையும் பகிர்கிறேன்.</p>
          <a class="button button-light" href="#/about">என்னைப் பற்றி</a>
        </div>
      </div>
    </section>`
  };
}

function viewWorks(typeKey) {
  const info = typeInfo(typeKey);
  const valid = !typeKey || info;
  const list = info ? all.filter((w) => w.type === typeKey) : all;
  const label = info ? info.plural : "படைப்புகள்";
  const crumbs = info
    ? `<a href="#/">முகப்பு</a><a href="#/works">படைப்புகள்</a><span aria-current="page">${esc(info.plural)}</span>`
    : `<a href="#/">முகப்பு</a><span aria-current="page">படைப்புகள்</span>`;
  const tabs = [{ key: "", plural: "அனைத்தும்", n: all.length }, ...TYPES.map((t) => ({ key: t.key, plural: t.plural, n: countOf(t.key) }))];

  return {
    title: `${label} — ${SITE}`,
    route: "works",
    html: `
    <div class="wrap">
      ${pageHead(esc(label), info ? esc(info.note) : "வாசிக்க ஒரு வரி போதும். தங்க ஒரு உணர்வு போதும்.", crumbs)}
      <div class="tabs" role="navigation" aria-label="வகை வாரியாகப் பார்">
        ${tabs.map((t) => `<a href="${worksHref(t.key)}" ${t.key === (info ? typeKey : "") ? 'aria-current="page"' : ""}>${esc(t.plural)} <span>${t.n}</span></a>`).join("")}
      </div>
      <div class="leaves">
        ${!valid ? emptyState("இந்த வகை இல்லை", "மேலுள்ள வகைகளில் ஒன்றைத் தேர்ந்தெடுங்கள்.") : list.length ? list.map((w) => leaf(w)).join("") : emptyState("இந்த வகையில் இன்னும் படைப்புகள் இல்லை", "விரைவில் சேர்க்கப்படும். அதற்குள் மற்ற வகைகளைப் பாருங்கள்.")}
      </div>
    </div>`
  };
}

function renderBody(w) {
  const lines = (w.body || "").split(/\r?\n/);
  if (w.type === "கவிதை") {
    const stanzas = [];
    let cur = [];
    lines.forEach((l) => {
      if (l.trim()) cur.push(l.trim());
      else if (cur.length) { stanzas.push(cur); cur = []; }
    });
    if (cur.length) stanzas.push(cur);
    return `<div class="poem">${stanzas.map((s) => `<p>${s.map(esc).join("<br>")}</p>`).join("")}</div>`;
  }
  return lines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (/^\d+\.\s+\S/.test(l) && l.length < 80 ? `<h2>${esc(l.replace(/^\d+\.\s+/, ""))}</h2>` : `<p>${esc(l)}</p>`))
    .join("");
}

function viewRead(id) {
  const w = all.find((x) => x.id === Number(id));
  if (!w) return viewNotFound();
  const idx = all.indexOf(w);
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const info = typeInfo(w.type);
  return {
    title: `${w.title} — ${SITE}`,
    route: "works",
    reading: true,
    html: `
    <article class="reader">
      <div class="reader-head">
        <nav class="crumbs" aria-label="நீங்கள் இருக்கும் இடம்">
          <a href="#/">முகப்பு</a><a href="#/works">படைப்புகள்</a>${info ? `<a href="${worksHref(w.type)}">${esc(info.plural)}</a>` : ""}<span aria-current="page">${esc(w.title)}</span>
        </nav>
        <p class="reader-type">${esc(w.type)}</p>
        <h1>${esc(w.title)}</h1>
        <p class="reader-meta">${w.date ? `<time>${esc(w.date)}</time> · ` : ""}${w.minutes} நிமிட வாசிப்பு</p>
        <div class="size-ctl" role="group" aria-label="எழுத்தின் அளவு">
          <button type="button" data-size="-1" aria-label="எழுத்தைச் சிறிதாக்கு">அ−</button>
          <button type="button" data-size="1" aria-label="எழுத்தைப் பெரிதாக்கு">அ+</button>
        </div>
      </div>
      <div class="reader-body ${w.type === "கவிதை" ? "is-poem" : ""}" id="reader-body">${renderBody(w)}</div>
      <nav class="pager" aria-label="அடுத்த படைப்புகள்">
        ${prev ? `<a class="pager-prev" href="${readHref(prev)}"><small>முந்தையது</small><strong>${esc(prev.title)}</strong></a>` : "<span></span>"}
        ${next ? `<a class="pager-next" href="${readHref(next)}"><small>அடுத்தது</small><strong>${esc(next.title)}</strong></a>` : "<span></span>"}
      </nav>
      <p class="reader-back"><a class="text-link" href="${worksHref(info ? w.type : "")}">அனைத்து ${esc(info ? info.plural : "படைப்புகளும்")}</a></p>
    </article>`
  };
}

function viewAbout() {
  return {
    title: `எழுத்தாளர் — ${SITE}`,
    route: "about",
    html: `
    <div class="wrap">
      ${pageHead("வணக்கம், நான் ஸ்ரீராம்.", "", '<a href="#/">முகப்பு</a><span aria-current="page">எழுத்தாளர்</span>')}
      <div class="about-grid">
        <figure><img src="assets/writer-at-work.png" alt="எழுத்தாளர் தன் மேசையில்" width="1024" height="674" loading="lazy"></figure>
        <div class="prose">
          <p>தமிழ் மொழியையும் அதன் கதைகளையும் நேசிக்கும் ஒரு வாசகன், எழுத்தாளன். இந்தத் தளத்தில் என் படைப்புகளையும், மனதில் தங்கும் சில எண்ணங்களையும் பகிர்கிறேன்.</p>
          <p>கவிதை, கதை, கட்டுரை என எது எழுதினாலும், முதலில் கவனிப்பதிலிருந்தே தொடங்குகிறது.</p>
          <p><a class="button" href="mailto:${EMAIL}">${EMAIL}</a></p>
          <p class="about-links"><a class="text-link" href="#/works">படைப்புகளை வாசி</a></p>
        </div>
      </div>
    </div>`
  };
}

function viewNotFound() {
  return {
    title: `பக்கம் இல்லை — ${SITE}`,
    route: "",
    html: `<div class="wrap"><div class="empty big"><h1>இந்தப் பக்கம் கிடைக்கவில்லை</h1><p>முகவரி மாறியிருக்கலாம். முகப்புக்குச் செல்லுங்கள் அல்லது படைப்புகளைப் பாருங்கள்.</p><p><a class="button" href="#/">முகப்புக்குச் செல்</a> <a class="text-link" href="#/works">படைப்புகள்</a></p></div></div>`
  };
}

/* ---------- router ---------- */

const progress = $("#read-progress");
let firstRender = true;

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [name, ...rest] = raw.split("/").filter((s) => s !== "");
  const arg = rest.length ? decodeURIComponent(rest.join("/")) : "";
  return { name: name ? decodeURIComponent(name) : "", arg };
}

function render() {
  if (location.hash === "#top") { window.scrollTo({ top: 0 }); return; }
  const { name, arg } = parseRoute();
  let view;
  if (name === "") view = viewHome();
  else if (name === "works") view = viewWorks(arg);
  else if (name === "read") view = viewRead(arg);
  else if (name === "about") view = viewAbout();
  else view = viewNotFound();

  main.innerHTML = view.html;
  main.classList.toggle("is-reading", !!view.reading);
  document.title = view.title;
  $$("[data-route]").forEach((a) => {
    if (a.dataset.route === view.route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  closeMenu();
  window.scrollTo({ top: 0 });
  if (!firstRender) main.focus({ preventScroll: true });
  firstRender = false;
  applySize();
  updateProgress();
}

window.addEventListener("hashchange", render);

/* ---------- reading size + progress ---------- */

let size = 0;
try { size = Number(localStorage.getItem("reader-size")) || 0; } catch (e) { /* storage unavailable */ }
function applySize() {
  const body = $("#reader-body");
  if (body) body.style.setProperty("--step", size);
}
main.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-size]");
  if (!btn) return;
  size = Math.max(-2, Math.min(4, size + Number(btn.dataset.size)));
  try { localStorage.setItem("reader-size", String(size)); } catch (err) { /* ignore */ }
  applySize();
});

function updateProgress() {
  const body = $("#reader-body");
  if (!body) { progress.style.transform = "scaleX(0)"; return; }
  const rect = body.getBoundingClientRect();
  const total = rect.height - window.innerHeight * 0.6;
  const done = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
  progress.style.transform = `scaleX(${done})`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

/* ---------- header: mobile menu, scroll state ---------- */

const menuToggle = $(".menu-toggle");
const nav = $("#primary-nav");
const header = $("#site-header");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "பட்டியலைத் திற");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "பட்டியலை மூடு" : "பட்டியலைத் திற");
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
});
nav.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 8), { passive: true });
$("#to-top").addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });

/* ---------- search ---------- */

const dialog = $("#search-dialog");
const input = $("#search-input");
const results = $("#search-results");

function snippet(w, term) {
  const text = (w.body || "").replace(/\s+/g, " ");
  const at = text.toLocaleLowerCase().indexOf(term);
  if (at < 0) return w.excerpt || "";
  let start = Math.max(0, at - 30);
  if (start) { const sp = text.indexOf(" ", start); start = sp > -1 && sp < at ? sp + 1 : at; }
  return (start ? "…" : "") + text.slice(start, at + 90) + "…";
}

function runSearch() {
  const term = input.value.trim().toLocaleLowerCase();
  if (!term) {
    results.innerHTML = `<p class="search-hint">ஒரு சொல்லை எழுதினால் படைப்புகளின் தலைப்பிலும் உரையிலும் தேடப்படும்.</p>`;
    return;
  }
  const hits = all.filter((w) => `${w.title} ${w.excerpt} ${w.body}`.toLocaleLowerCase().includes(term));
  results.innerHTML = hits.length
    ? hits.map((w) => `<a class="search-hit" href="${readHref(w)}"><span>${esc(w.type)}</span><strong>${esc(w.title)}</strong><small>${esc(snippet(w, term))}</small></a>`).join("")
    : `<p class="search-hint">“${esc(input.value.trim())}” என்பதற்குப் பொருத்தம் இல்லை. வேறு சொல்லை முயற்சிக்கவும்.</p>`;
}

function openSearch() {
  if (dialog.open) return;
  dialog.showModal();
  input.value = "";
  runSearch();
  input.focus();
}
$("#open-search").addEventListener("click", openSearch);
$("#close-search").addEventListener("click", () => dialog.close());
input.addEventListener("input", runSearch);
$("#search-form").addEventListener("submit", (e) => e.preventDefault());
results.addEventListener("click", (e) => { if (e.target.closest("a")) dialog.close(); });
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
document.addEventListener("keydown", (e) => {
  const typing = /input|textarea|select/i.test(document.activeElement.tagName);
  if (e.key === "/" && !typing) { e.preventDefault(); openSearch(); }
  if (e.key === "Escape") closeMenu();
});

/* ---------- start ---------- */

$("#year").textContent = new Date().getFullYear();
render();
