/* ===== Lagotto Romagnolo – shared site logic (SK/EN) ===== */

const LANG = () => window.SITE_LANG || "sk";
const BASE = () => window.ASSET_BASE || "";

/* prefix relative asset paths so pages in /en/ resolve them */
function asset(p) {
  if (!p) return p;
  return /^(https?:)?\/\//.test(p) ? p : BASE() + p;
}

/* tr("slovensky", "english") */
function tr(sk, en) { return LANG() === "en" ? en : sk; }

/* pick(obj, "title") -> obj.title_en (if EN and present) else obj.title */
function pick(obj, field) {
  return LANG() === "en" ? (obj[field + "_en"] || obj[field]) : obj[field];
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d}. ${m}. ${y}`;
}

/* ---------- Blog ---------- */
function renderPosts(targetId, limit) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const posts = (window.LAGOTTO_POSTS || []).slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const shown = limit ? posts.slice(0, limit) : posts;

  if (!shown.length) {
    target.innerHTML = `<div class="empty-state">
      <h3>${tr("Zatiaľ žiadne príspevky", "No posts yet")}</h3>
      <p>${tr("Prvý príspevok pridáš v súbore", "Add your first post in")}
      <code>js/data/posts.js</code>.</p>
    </div>`;
    return;
  }

  target.innerHTML = shown.map(p => {
    const tags = (LANG() === "en" ? (p.tags_en || p.tags) : p.tags) || [];
    return `
    <article class="post">
      <h2>${pick(p, "title")}</h2>
      <div class="meta">${formatDate(p.date)}${tags
        .map(t => `<span class="tag">${t}</span>`).join("")}</div>
      ${p.image ? `<img src="${asset(p.image)}" alt="${pick(p, "title")}" loading="lazy">` : ""}
      <div class="post-body">${pick(p, "body") || ""}</div>
    </article>`;
  }).join("");
}

/* ---------- Gallery + lightbox ---------- */
let lbItems = [];
let lbIndex = 0;

function renderGallery(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  lbItems = (window.LAGOTTO_GALLERY || []).slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map(g => ({ src: asset(g.src), caption: pick(g, "caption") || "" }));

  if (!lbItems.length) {
    target.innerHTML = `<div class="empty-state">
      <h3>${tr("Galéria je zatiaľ prázdna", "The gallery is empty for now")}</h3>
      <p>${tr("Fotky pridáš do priečinka", "Add photos to the folder")}
      <code>assets/gallery/</code> ${tr("a zoznamu v", "and to the list in")}
      <code>js/data/gallery.js</code>.</p>
    </div>`;
    return;
  }

  target.innerHTML = lbItems.map((g, i) => `
    <figure data-index="${i}">
      <img src="${g.src}" alt="${g.caption}" loading="lazy">
      <figcaption>${g.caption}</figcaption>
    </figure>
  `).join("");

  target.querySelectorAll("figure").forEach(fig => {
    fig.addEventListener("click", () => openLightbox(Number(fig.dataset.index)));
  });
}

function ensureLightbox() {
  if (document.getElementById("lightbox")) return;
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.className = "lightbox";
  lb.innerHTML = `
    <button class="lb-close" aria-label="${tr("Zavrieť", "Close")}">✕</button>
    <button class="lb-prev" aria-label="${tr("Predchádzajúca", "Previous")}">‹</button>
    <img alt="">
    <div class="caption"></div>
    <button class="lb-next" aria-label="${tr("Ďalšia", "Next")}">›</button>`;
  document.body.appendChild(lb);
  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", () => stepLightbox(-1));
  lb.querySelector(".lb-next").addEventListener("click", () => stepLightbox(1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}

function openLightbox(i) {
  ensureLightbox();
  lbIndex = i;
  const lb = document.getElementById("lightbox");
  const item = lbItems[lbIndex];
  lb.querySelector("img").src = item.src;
  lb.querySelector(".caption").textContent = item.caption || "";
  lb.classList.add("open");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}

function stepLightbox(dir) {
  lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
  openLightbox(lbIndex);
}

/* ---------- Vlogs ---------- */
function renderVlogs(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const vlogs = (window.LAGOTTO_VLOGS || []).slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  if (!vlogs.length) {
    target.innerHTML = `<div class="empty-state">
      <h3>${tr("Zatiaľ žiadne vlogy", "No vlogs yet")}</h3>
      <p>${tr("Prvé video pridáš v súbore", "Add your first video in")}
      <code>js/data/vlogs.js</code> –
      ${tr("stačí YouTube ID alebo video súbor v",
           "just a YouTube ID or a video file in")} <code>assets/video/</code>.</p>
    </div>`;
    return;
  }

  target.innerHTML = vlogs.map(v => {
    const title = pick(v, "title");
    const frame = v.type === "youtube"
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}"
           title="${title}" allowfullscreen loading="lazy"></iframe>`
      : `<video src="${asset(v.src)}" controls preload="metadata"></video>`;
    const desc = pick(v, "description");
    return `
      <div class="video-card">
        <div class="frame">${frame}</div>
        <div class="info">
          <h3>${title}</h3>
          <div class="meta">${formatDate(v.date)}</div>
          ${desc ? `<p>${desc}</p>` : ""}
        </div>
      </div>`;
  }).join("");
}

/* ---------- Truffle & Curl chrome: header blur + scroll reveal ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll("section.block").forEach(s => {
    s.classList.add("reveal");
    observer.observe(s);
  });
});

/* ---------- Slide viewer (original field guide) ---------- */
function initSlideViewer(targetId, slideCount) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const src = n => asset(`assets/guide/slide-${String(n).padStart(2, "0")}.jpg`);
  const pageWord = tr("Strana", "Page");
  let current = 1;

  target.innerHTML = `
    <div class="stage"><img id="sv-stage" src="${src(1)}" alt="${pageWord} 1"></div>
    <div class="controls">
      <button class="btn secondary" id="sv-prev">‹ ${tr("Predchádzajúca", "Previous")}</button>
      <span class="counter" id="sv-counter">1 / ${slideCount}</span>
      <button class="btn secondary" id="sv-next">${tr("Ďalšia", "Next")} ›</button>
    </div>
    <div class="slide-thumbs" id="sv-thumbs">
      ${Array.from({ length: slideCount }, (_, i) =>
        `<img src="${src(i + 1)}" data-n="${i + 1}" alt="${pageWord} ${i + 1}"
          class="${i === 0 ? "active" : ""}" loading="lazy">`).join("")}
    </div>`;

  const stage = target.querySelector("#sv-stage");
  const counter = target.querySelector("#sv-counter");
  const thumbs = target.querySelectorAll("#sv-thumbs img");

  function show(n) {
    current = ((n - 1 + slideCount) % slideCount) + 1;
    stage.src = src(current);
    stage.alt = `${pageWord} ${current}`;
    counter.textContent = `${current} / ${slideCount}`;
    thumbs.forEach(t => t.classList.toggle("active", Number(t.dataset.n) === current));
  }

  target.querySelector("#sv-prev").addEventListener("click", () => show(current - 1));
  target.querySelector("#sv-next").addEventListener("click", () => show(current + 1));
  thumbs.forEach(t => t.addEventListener("click", () => show(Number(t.dataset.n))));
  stage.addEventListener("click", () => {
    lbItems = Array.from({ length: slideCount }, (_, i) =>
      ({ src: src(i + 1), caption: tr(`Sprievodca plemenom – strana ${i + 1}`,
                                      `Breed guide – page ${i + 1}`) }));
    openLightbox(current - 1);
  });
}
