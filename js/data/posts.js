// ============================================================
//  DENNÍK / BLOG – tu pridávaš nové príspevky.
//  DIARY / BLOG – add new posts here.
//
//  Nový príspevok pridaj NA ZAČIATOK zoznamu (hneď za "[").
//  Polia s príponou _en sú voliteľné anglické verzie – ak chýbajú,
//  anglická stránka zobrazí slovenský text.
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

window.LAGOTTO_POSTS = [
  {
    title: "Vitajte v našom lagottovskom denníku!",
    title_en: "Welcome to our Lagotto diary!",
    date: "2026-06-12",
    tags: ["novinky"],
    tags_en: ["news"],
    image: "assets/gallery/les-hladanie.jpg",
    body: `
      <p>Táto stránka je venovaná úžasnému plemenu Lagotto Romagnolo – talianskemu
      kráľovi hľuzoviek. Nájdete tu kompletného sprievodcu plemenom, náš denník,
      fotogalériu aj videá.</p>
      <p>V denníku budeme zdieľať zážitky z výletov, tréningov nosework, hľadania
      húb a hľuzoviek, ale aj bežné radosti a starosti života s kučeravým psom.</p>
      <p>Ak vás zaujíma, či je Lagotto to pravé plemeno pre vás, začnite na stránke
      <a href="plemeno.html">O plemene</a>.</p>
    `,
    body_en: `
      <p>This site is dedicated to the wonderful Lagotto Romagnolo – the Italian
      king of truffles. You'll find a complete breed guide, our diary,
      a photo gallery and videos.</p>
      <p>In the diary we'll share adventures from trips, nosework training,
      mushroom and truffle hunting, as well as the everyday joys and troubles
      of life with a curly dog.</p>
      <p>If you're wondering whether the Lagotto is the right breed for you,
      start with <a href="breed.html">The Breed</a> page.</p>
    `
  }
];
