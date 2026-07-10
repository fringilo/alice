// ============================================================
//  DENNÍK / BLOG – tu pridávaš nové príspevky.
//  DIARY / BLOG – add new posts here.
//
//  Príspevky bežne pridávaš cez admin.html (Firestore); tento súbor
//  slúži len ako statická záloha. Nový príspevok pridaj NA ZAČIATOK
//  zoznamu (hneď za "["). Polia s príponou _en sú voliteľné anglické
//  verzie – ak chýbajú, anglická stránka zobrazí slovenský text.
//
//  {
//    title: "Nadpis príspevku",
//    title_en: "Post title",            // voliteľné / optional
//    date: "2026-06-12",                // formát RRRR-MM-DD
//    tags: ["výlet", "tréning"],
//    tags_en: ["trip", "training"],     // voliteľné / optional
//    image: "assets/gallery/foto.jpg",  // voliteľné / optional
//    body: `<p>Prvý odsek…</p>`,
//    body_en: `<p>First paragraph…</p>` // voliteľné / optional
//  },
// ============================================================

window.LAGOTTO_POSTS = [];
