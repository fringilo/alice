/* ============================================================
   Editovateľný statický text stránky (hero, nadpisy, odseky…)
   - Každý návštevník: aplikuje uložené úpravy z Firestore.
   - Admin (prihlásený): plávajúce tlačidlo „Upraviť stránku“ →
     klikni na ľubovoľný text a uprav ho priamo na stránke.

   Editovateľný prvok = ľubovoľný element s atribútom data-edit="kľúč".
   Text sa ukladá do kolekcie "siteText", dokument = kľúč,
   polia: { sk: "...", en: "..." }. Jazyk podľa window.SITE_LANG.
   ============================================================ */
(async () => {
  if (!window.FIREBASE_CONFIG) return;
  const LANG = window.SITE_LANG === "en" ? "en" : "sk";

  let app, db, auth, authMod, fs;
  try {
    const [appMod, fsMod, aMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"),
    ]);
    try { app = appMod.initializeApp(window.FIREBASE_CONFIG); }
    catch { app = appMod.getApp(); }            // app už mohol inicializovať cms.js
    db = fsMod.getFirestore(app);
    auth = aMod.getAuth(app);
    authMod = aMod;
    fs = fsMod;
  } catch (e) { console.warn("sitetext: init zlyhal", e); return; }

  const { collection, getDocs, doc, setDoc } = fs;

  /* ---------- 1) načítaj a aplikuj úpravy ---------- */
  const overrides = {};
  try {
    const snap = await getDocs(collection(db, "siteText"));
    snap.forEach(d => { overrides[d.id] = d.data(); });
  } catch (e) { console.warn("sitetext: načítanie zlyhalo", e); }

  const applyOne = (el) => {
    const o = overrides[el.getAttribute("data-edit")];
    if (o && typeof o[LANG] === "string") el.textContent = o[LANG];
  };
  const applyAll = () => document.querySelectorAll("[data-edit]").forEach(applyOne);
  applyAll();

  /* ---------- 2) editor pre admina ---------- */
  authMod.onAuthStateChanged(auth, (user) => {
    const isAdmin = user && (!window.ADMIN_EMAIL || user.email === window.ADMIN_EMAIL);
    if (isAdmin) enableEditor();
    else teardownEditor();
  });

  let editing = false;
  let injected = false;

  function injectChrome() {
    if (injected) return;
    injected = true;

    const style = document.createElement("style");
    style.id = "st-style";
    style.textContent = `
      #st-toggle {
        position: fixed; right: 24px; bottom: 24px; z-index: 300;
        background: var(--primary); color: #fff; border: none; cursor: pointer;
        font-family: var(--font-label); font-weight: 600; font-size: .9rem;
        padding: 12px 20px; border-radius: 999px;
        box-shadow: 0 8px 28px rgba(93,64,55,.28);
        display: inline-flex; align-items: center; gap: 8px;
      }
      #st-toggle.on { background: #54652e; }
      @media (max-width: 768px) { #st-toggle { bottom: 88px; } }
      body.st-edit [data-edit] {
        outline: 2px dashed var(--surface-tint); outline-offset: 3px;
        cursor: pointer; transition: outline-color .15s, background .15s;
        border-radius: 4px;
      }
      body.st-edit [data-edit]:hover { outline-color: var(--primary); background: rgba(118,87,77,.08); }
      .st-backdrop {
        position: fixed; inset: 0; z-index: 320; display: none;
        background: rgba(26,18,14,.55);
        align-items: center; justify-content: center; padding: 20px;
      }
      .st-backdrop.open { display: flex; }
      .st-modal {
        background: #fff; border-radius: 16px; width: 100%; max-width: 560px;
        padding: 22px; box-shadow: 0 18px 50px rgba(0,0,0,.3);
      }
      .st-modal h3 { margin: 0 0 4px; font-size: 1.15rem; color: var(--primary); }
      .st-modal .st-key {
        font-family: var(--font-label); font-size: .72rem; color: var(--secondary);
        margin-bottom: 12px; word-break: break-all;
      }
      .st-modal textarea {
        width: 100%; min-height: 130px; resize: vertical;
        padding: 12px 14px; border: 1px solid var(--outline-variant);
        border-radius: 8px; font-family: var(--font-display); font-size: 1rem;
        color: var(--on-surface); outline: none; box-sizing: border-box;
      }
      .st-modal textarea:focus { border-color: var(--primary); }
      .st-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
      .st-actions button {
        font-family: var(--font-label); font-weight: 600; font-size: .9rem;
        padding: 10px 22px; border-radius: 999px; cursor: pointer; border: none;
      }
      .st-save { background: var(--primary); color: #fff; }
      .st-cancel { background: var(--surface-container-high); color: var(--on-surface-variant); }
      #st-msg {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        background: var(--primary); color: #fff; padding: 11px 24px; border-radius: 999px;
        font-family: var(--font-label); font-size: .88rem; z-index: 340;
        opacity: 0; pointer-events: none; transition: opacity .3s;
      }
      #st-msg.show { opacity: 1; }
    `;
    document.head.appendChild(style);

    const toggle = document.createElement("button");
    toggle.id = "st-toggle";
    toggle.innerHTML = `<span class="material-symbols-outlined">edit</span><span id="st-toggle-label">Upraviť stránku</span>`;
    toggle.addEventListener("click", () => setEditing(!editing));
    document.body.appendChild(toggle);

    const backdrop = document.createElement("div");
    backdrop.className = "st-backdrop";
    backdrop.id = "st-backdrop";
    backdrop.innerHTML = `
      <div class="st-modal" role="dialog" aria-modal="true">
        <h3>Upraviť text${LANG === "en" ? " (English)" : " (slovensky)"}</h3>
        <div class="st-key" id="st-key"></div>
        <textarea id="st-text"></textarea>
        <div class="st-actions">
          <button class="st-cancel" id="st-cancel">Zrušiť</button>
          <button class="st-save" id="st-save">Uložiť</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);

    const msg = document.createElement("div");
    msg.id = "st-msg";
    document.body.appendChild(msg);

    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
    document.getElementById("st-cancel").addEventListener("click", closeModal);
    document.getElementById("st-save").addEventListener("click", saveModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && backdrop.classList.contains("open")) closeModal();
    });

    document.addEventListener("click", onEditableClick, true);
  }

  function setEditing(on) {
    editing = on;
    document.body.classList.toggle("st-edit", on);
    const t = document.getElementById("st-toggle");
    t.classList.toggle("on", on);
    document.getElementById("st-toggle-label").textContent = on ? "Hotovo" : "Upraviť stránku";
  }

  let current = null;

  function onEditableClick(e) {
    if (!editing) return;
    const el = e.target.closest("[data-edit]");
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    current = el;
    document.getElementById("st-key").textContent = el.getAttribute("data-edit");
    document.getElementById("st-text").value = el.textContent.trim().replace(/\s+/g, " ");
    document.getElementById("st-backdrop").classList.add("open");
    document.getElementById("st-text").focus();
  }

  function closeModal() {
    document.getElementById("st-backdrop").classList.remove("open");
    current = null;
  }

  async function saveModal() {
    if (!current) return;
    const key = current.getAttribute("data-edit");
    const value = document.getElementById("st-text").value.trim();
    try {
      await setDoc(doc(db, "siteText", key), { [LANG]: value }, { merge: true });
      overrides[key] = Object.assign({}, overrides[key], { [LANG]: value });
      current.textContent = value;
      closeModal();
      flash("Uložené ✓");
    } catch (err) {
      flash("Uloženie zlyhalo: " + (err.code || err.message));
    }
  }

  function flash(text) {
    const m = document.getElementById("st-msg");
    if (!m) return;
    m.textContent = text;
    m.classList.add("show");
    clearTimeout(m._h);
    m._h = setTimeout(() => m.classList.remove("show"), 2600);
  }

  function enableEditor() { injectChrome(); document.getElementById("st-toggle").style.display = ""; }
  function teardownEditor() {
    if (!injected) return;
    setEditing(false);
    document.getElementById("st-toggle").style.display = "none";
  }
})();
