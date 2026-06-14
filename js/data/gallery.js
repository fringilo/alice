// ============================================================
//  FOTOGALÉRIA – záložný (statický) zoznam fotiek.
//
//  Galéria sa teraz spravuje cez admin rozhranie (admin.html):
//  pridávanie, mazanie aj albumy. Tento zoznam je prázdny – všetky
//  fotky sú uložené vo Firebase a dajú sa odtiaľ mazať.
//
//  (Ak by si chcel pevne „zabudované“ fotky aj bez Firebase, môžeš
//  sem pridať záznamy v tvare:
//   { src: "assets/gallery/nazov.jpg", caption: "Popis", date: "2026-06-12" } )
// ============================================================

window.LAGOTTO_GALLERY = [];
