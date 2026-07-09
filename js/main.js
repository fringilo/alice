/* ===== Lagotto Romagnolo – shared site logic (SK/EN) ===== */

const LANG = () => window.SITE_LANG || "sk";
const BASE = () => window.ASSET_BASE || "";

/* prefix relative asset paths so pages in /en/ resolve them
   (absolute URLs and inline data:/blob: images pass through untouched) */
function asset(p) {
  if (!p) return p;
  return /^(https?:)?\/\/|^(data|blob):/.test(p) ? p : BASE() + p;
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

  /* photos per post: cover (p.image) + extra images from postImages */
  const photoSets = shown.map(p => {
    const arr = [];
    if (p.image) arr.push({ src: asset(p.image), caption: pick(p, "title") || "" });
    (window.LAGOTTO_POST_IMAGES || [])
      .filter(x => x.postId === p._id)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .forEach(x => arr.push({ src: asset(x.src), caption: pick(p, "title") || "" }));
    return arr;
  });

  const canSpeak = "speechSynthesis" in window;

  target.innerHTML = shown.map((p, idx) => {
    const tags = (LANG() === "en" ? (p.tags_en || p.tags) : p.tags) || [];
    const photos = photoSets[idx];
    const photosHtml = photos.length === 1
      ? `<img class="post-photo" src="${photos[0].src}" alt="${photos[0].caption}"
           loading="lazy" data-post="${idx}" data-i="0">`
      : photos.length > 1
        ? `<div class="post-photos${photos.length === 2 ? " cols-2" : ""}">${photos.map((ph, i) =>
            `<img class="post-photo" src="${ph.src}" alt="${ph.caption}"
              loading="lazy" data-post="${idx}" data-i="${i}">`).join("")}</div>`
        : "";
    const audioHtml = p.audio
      ? `<div class="post-audio"><audio controls preload="none" src="${asset(p.audio)}"></audio></div>`
      : "";
    const listenHtml = (!p.audio && canSpeak)
      ? `<button class="listen-btn" type="button" data-post="${idx}">
           <span aria-hidden="true">▶</span> ${tr("Vypočuť článok", "Listen to this post")}</button>`
      : "";
    /* views + comments only on the full blog page and for CMS posts */
    const viewsHtml = (!limit && p._id)
      ? `<span class="post-views" data-post-id="${p._id}"
           title="${tr("Počet prečítaní", "Views")}"><span
           class="material-symbols-outlined">visibility</span> <b>–</b></span>`
      : "";
    const commentsHtml = (!limit && p._id)
      ? `<div class="post-comments" data-post-id="${p._id}"></div>`
      : "";
    return `
    <article class="post">
      <h2>${pick(p, "title")}</h2>
      <div class="meta">${formatDate(p.date)}${tags
        .map(t => `<span class="tag">${t}</span>`).join("")}${viewsHtml}</div>
      ${photosHtml}
      ${audioHtml}
      <div class="post-body">${pick(p, "body") || ""}</div>
      ${listenHtml}
      ${commentsHtml}
    </article>`;
  }).join("");

  document.dispatchEvent(new CustomEvent("posts-rendered", { detail: { targetId } }));

  /* lightbox for post photos */
  target.querySelectorAll(".post-photo").forEach(img => {
    img.addEventListener("click", () => {
      lbItems = photoSets[Number(img.dataset.post)];
      openLightbox(Number(img.dataset.i));
    });
  });

  /* read-aloud buttons */
  target.querySelectorAll(".listen-btn").forEach(btn => {
    btn.addEventListener("click", () => toggleSpeech(btn, shown[Number(btn.dataset.post)]));
  });
}

/* ---------- Read post aloud (Web Speech API) ---------- */
let activeSpeechBtn = null;

function stopSpeech() {
  window.speechSynthesis.cancel();
  if (activeSpeechBtn) {
    activeSpeechBtn.classList.remove("playing");
    activeSpeechBtn.querySelector("span").textContent = "▶";
    activeSpeechBtn = null;
  }
}

function toggleSpeech(btn, post) {
  const synth = window.speechSynthesis;
  if (activeSpeechBtn === btn && (synth.speaking || synth.pending)) { stopSpeech(); return; }
  stopSpeech();

  const tmp = document.createElement("div");
  tmp.innerHTML = pick(post, "body") || "";
  const text = `${pick(post, "title") || ""}. ${tmp.textContent || ""}`.trim();
  if (!text) return;

  const u = new SpeechSynthesisUtterance(text);
  const lang = LANG() === "en" ? "en" : "sk";
  u.lang = lang === "en" ? "en-US" : "sk-SK";
  const voice = synth.getVoices().find(v => (v.lang || "").toLowerCase().startsWith(lang));
  if (voice) u.voice = voice;
  u.onend = u.onerror = stopSpeech;

  btn.classList.add("playing");
  btn.querySelector("span").textContent = "■";
  activeSpeechBtn = btn;
  synth.speak(u);
}

/* ---------- Gallery + lightbox ---------- */
let lbItems = [];
let lbIndex = 0;

function renderGallery(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const all = (window.LAGOTTO_GALLERY || []).slice();
  const byDate = (a, b) => (b.date || "").localeCompare(a.date || "");
  const albums = all.filter(x => x.kind === "album").sort(byDate);
  const photos = all.filter(x => x.kind !== "album").sort(byDate);

  if (!albums.length && !photos.length) {
    target.innerHTML = `<div class="empty-state">
      <h3>${tr("Galéria je zatiaľ prázdna", "The gallery is empty for now")}</h3>
      <p>${tr("Fotky a albumy pridáš po prihlásení v",
              "Add photos and albums after logging in at")}
      <a href="${BASE()}admin.html">admin</a>.</p>
    </div>`;
    return;
  }

  const figHtml = (g, i) => `
    <figure data-index="${i}">
      <img src="${asset(g.src)}" alt="${pick(g, "caption") || ""}" loading="lazy">
      <figcaption>${pick(g, "caption") || ""}</figcaption>
    </figure>`;

  const wirePhotos = (list) => {
    lbItems = list.map(g => ({ src: asset(g.src), caption: pick(g, "caption") || "" }));
    target.querySelectorAll("figure[data-index]").forEach(fig => {
      fig.addEventListener("click", () => openLightbox(Number(fig.dataset.index)));
    });
  };

  /* --- inside one album --- */
  const m = location.hash.match(/album=([^&]+)/);
  const album = m ? albums.find(a => a._id === decodeURIComponent(m[1])) : null;
  if (album) {
    const inside = photos.filter(p => p.albumId === album._id);
    target.innerHTML = `
      <div class="gallery-bar">
        <a class="gallery-back" href="#">${tr("← Späť na galériu", "← Back to gallery")}</a>
        <h2 class="album-heading">${pick(album, "title") || ""}</h2>
      </div>
      <div class="gallery-grid">${inside.map(figHtml).join("") ||
        `<p>${tr("Tento album je zatiaľ prázdny.", "This album is empty for now.")}</p>`}</div>`;
    target.querySelector(".gallery-back").addEventListener("click", (e) => {
      e.preventDefault(); location.hash = "";
    });
    wirePhotos(inside);
    return;
  }

  /* --- top level: folders + loose photos --- */
  let html = "";
  if (albums.length) {
    html += `<div class="gallery-grid">` + albums.map(a => {
      const cover = photos.find(p => p.albumId === a._id);
      const count = photos.filter(p => p.albumId === a._id).length;
      return `<figure class="album-card" data-album="${a._id}">
        <div class="album-thumb">
          ${cover ? `<img src="${asset(cover.src)}" alt="" loading="lazy">`
                  : `<span class="album-empty material-symbols-outlined">folder</span>`}
          <span class="album-badge"><span class="material-symbols-outlined">folder</span></span>
        </div>
        <figcaption>
          <span class="album-name">${pick(a, "title") || ""}</span>
          <span class="album-count">${count} ${tr("fotiek", "photos")}</span>
        </figcaption>
      </figure>`;
    }).join("") + `</div>`;
  }

  const loose = photos.filter(p => !p.albumId || !albums.some(a => a._id === p.albumId));
  if (loose.length) {
    if (albums.length) {
      html += `<h2 class="section-title" style="margin-top:36px">${tr("Ostatné fotky", "Other photos")}</h2>`;
    }
    html += `<div class="gallery-grid">${loose.map(figHtml).join("")}</div>`;
  }

  target.innerHTML = html;
  target.querySelectorAll(".album-card").forEach(card => {
    card.addEventListener("click", () => {
      location.hash = "album=" + encodeURIComponent(card.dataset.album);
    });
  });
  wirePhotos(loose);
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
function renderVlogs(targetId, limit) {
  const target = document.getElementById(targetId);
  if (!target) return;
  let vlogs = (window.LAGOTTO_VLOGS || []).slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (limit) vlogs = vlogs.slice(0, limit);

  if (!vlogs.length) {
    target.innerHTML = `<div class="empty-state">
      <h3>${tr("Prvé video už čoskoro", "First video coming soon")}</h3>
      <p>${tr("Zatiaľ nás sledujte na", "In the meantime, follow us on")}
      <a href="https://www.instagram.com/la_gioia_tto/" target="_blank" rel="noopener">${tr("Instagrame", "Instagram")}</a>.</p>
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
