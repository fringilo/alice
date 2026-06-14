/* ===== CMS bridge: merge Firestore content into the static site =====
   Loads posts/gallery/vlogs from Firestore (when FIREBASE_CONFIG is set),
   appends them to the static window.LAGOTTO_* arrays and fires "cms-ready"
   so pages can re-render. The site works unchanged without Firebase. */

(async () => {
  if (!window.FIREBASE_CONFIG) return;
  try {
    const [{ initializeApp, getApp }, { getFirestore, collection, getDocs }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"),
    ]);
    let app;
    try { app = initializeApp(window.FIREBASE_CONFIG); }
    catch { app = getApp(); }            // app už mohol inicializovať sitetext.js
    const db = getFirestore(app);

    const load = async (name) => {
      try {
        const snap = await getDocs(collection(db, name));
        return snap.docs.map(d => ({ _id: d.id, ...d.data() }));
      } catch (e) {
        console.warn(`CMS: failed to load "${name}"`, e);
        return [];
      }
    };

    const [posts, gallery, vlogs] = await Promise.all([
      load("posts"), load("gallery"), load("vlogs"),
    ]);

    if (posts.length) window.LAGOTTO_POSTS = [...(window.LAGOTTO_POSTS || []), ...posts];
    if (gallery.length) window.LAGOTTO_GALLERY = [...(window.LAGOTTO_GALLERY || []), ...gallery];
    if (vlogs.length) window.LAGOTTO_VLOGS = [...(window.LAGOTTO_VLOGS || []), ...vlogs];

    document.dispatchEvent(new CustomEvent("cms-ready"));
  } catch (e) {
    console.warn("CMS: Firebase initialisation failed", e);
  }
})();
