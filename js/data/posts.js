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
//
//  FOTKA V TEXTE / PHOTO INSIDE THE TEXT
//  Značka [foto1] (alebo [photo1]) v texte vloží danú fotku presne na to
//  miesto. Číslujú sa v poradí: 1 = úvodná fotka (image), 2, 3, … = ďalšie
//  fotky príspevku. Popis pod fotku pridáš cez dvojbodku:
//  [foto2: Gioia pri jazere]. Fotky bez značky sa zobrazia v mriežke navrchu.
//
//    body: `<p>Prvý odsek…</p>
//           <p>[foto2: Gioia pri jazere]</p>
//           <p>Druhý odsek…</p>`,
// ============================================================

window.LAGOTTO_POSTS = [];
