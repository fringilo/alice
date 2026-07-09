/* ===== Komentáre + počítadlo prečítaní (Firestore) =====
   Renders comment sections and view counters into placeholders
   created by renderPosts() (.post-comments / .post-views).
   Works only when FIREBASE_CONFIG is set; fails silently otherwise. */

(async () => {
  if (!window.FIREBASE_CONFIG) return;
  const LANG = window.SITE_LANG === "en" ? "en" : "sk";
  const tr = (sk, en) => (LANG === "en" ? en : sk);

  let db, fs;
  try {
    const [appMod, fsMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"),
    ]);
    let app;
    try { app = appMod.initializeApp(window.FIREBASE_CONFIG); }
    catch { app = appMod.getApp(); }
    db = fsMod.getFirestore(app);
    fs = fsMod;
  } catch (e) { console.warn("comments: init zlyhal", e); return; }

  const { collection, getDocs, addDoc, doc, setDoc, increment, query, where } = fs;

  /* ---------- data (loaded once, cached) ---------- */
  let approved = null;
  async function loadComments() {
    if (approved) return approved;
    try {
      const snap = await getDocs(query(collection(db, "comments"), where("approved", "==", true)));
      approved = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    } catch (e) { approved = []; }
    return approved;
  }

  let stats = null;
  async function loadStats() {
    if (stats) return stats;
    stats = {};
    try {
      const snap = await getDocs(collection(db, "postStats"));
      snap.forEach(d => { stats[d.id] = d.data().views || 0; });
    } catch (e) { /* noop */ }
    return stats;
  }

  /* ---------- views: +1 once per browser session ---------- */
  const bumped = new Set();
  async function bumpViews(postId) {
    if (bumped.has(postId)) return;
    bumped.add(postId);
    try {
      const key = "viewed_" + postId;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch (e) { /* private mode – count anyway */ }
    try {
      await setDoc(doc(db, "postStats", postId), { views: increment(1) }, { merge: true });
      if (stats) stats[postId] = (stats[postId] || 0) + 1;
    } catch (e) { /* noop */ }
  }

  const esc = s => String(s || "").replace(/[<>&"]/g,
    c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

  /* ---------- render ---------- */
  async function renderAll() {
    const boxes = document.querySelectorAll(".post-comments[data-post-id]");
    const viewEls = document.querySelectorAll(".post-views[data-post-id]");
    if (!boxes.length && !viewEls.length) return;

    const comments = await loadComments();
    await loadStats();

    viewEls.forEach(el => {
      const id = el.dataset.postId;
      bumpViews(id);
      const b = el.querySelector("b");
      if (b) b.textContent = stats[id] || 0;
    });

    boxes.forEach(box => {
      const id = box.dataset.postId;
      const list = comments.filter(c => c.postId === id)
        .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
      box.innerHTML = `
        <h3>${tr("Komentáre", "Comments")}${list.length ? ` (${list.length})` : ""}</h3>
        ${list.map(c => `
          <div class="comment">
            <div class="comment-head"><strong>${esc(c.name)}</strong>
              <span>${esc((c.date || "").slice(0, 10))}</span></div>
            <p>${esc(c.text)}</p>
          </div>`).join("")
          || `<p class="no-comments">${tr("Zatiaľ žiadne komentáre – buď prvý!",
                                          "No comments yet – be the first!")}</p>`}
        <form class="comment-form">
          <input type="text" name="name" maxlength="60" required
            placeholder="${tr("Meno", "Name")}" autocomplete="name">
          <textarea name="text" maxlength="1500" required
            placeholder="${tr("Tvoj komentár…", "Your comment…")}"></textarea>
          <button class="btn secondary" type="submit">${tr("Pridať komentár", "Add comment")}</button>
        </form>`;

      box.querySelector("form").addEventListener("submit", async e => {
        e.preventDefault();
        const f = e.target;
        const data = {
          postId: id,
          name: f.querySelector('[name="name"]').value.trim().slice(0, 60),
          text: f.querySelector('[name="text"]').value.trim().slice(0, 1500),
          date: new Date().toISOString(),
          approved: false,
        };
        if (!data.name || data.text.length < 2) return;
        const btn = f.querySelector("button");
        btn.disabled = true;
        try {
          await addDoc(collection(db, "comments"), data);
          f.innerHTML = `<p class="comment-thanks">${tr(
            "Ďakujeme! Komentár sa zobrazí po schválení.",
            "Thank you! Your comment will appear after approval.")}</p>`;
        } catch (err) {
          btn.disabled = false;
          alert(tr("Odoslanie zlyhalo, skús to prosím znova.",
                   "Sending failed, please try again."));
        }
      });
    });
  }

  document.addEventListener("posts-rendered", renderAll);
  renderAll();
})();
