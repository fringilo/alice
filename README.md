# Lagotto Romagnolo – website

Static website about the Lagotto Romagnolo breed: a breed guide (built from the
*Lagotto Romagnolo Field Guide* presentation), a diary/blog, a photo gallery
and a vlog page. No build tools, no dependencies — plain HTML/CSS/JS.

The site is bilingual: Slovak pages live in the root, English pages in `en/`.
Every page has a SK/EN switch in the navigation.

## Run it

Just open `index.html` in a browser (double-click it). Everything works from
the file system.

Optionally serve it locally:

```bash
cd "$(dirname "$0")" && python3 -m http.server 8000
# then open http://localhost:8000
```

It can be hosted as-is on GitHub Pages, Netlify, Cloudflare Pages, or any
static hosting — upload the whole folder.

## Pages

| Slovak | English | Page |
|---|---|---|
| `index.html` | `en/index.html` | Home — hero, quick facts, latest diary posts |
| `plemeno.html` | `en/breed.html` | Breed guide — history, FCI standard, coat, temperament, truffle training, health, suitability + the original presentation as a slide viewer |
| `blog.html` | `en/blog.html` | Diary / blog |
| `galeria.html` | `en/gallery.html` | Photo gallery with lightbox |
| `vlogy.html` | `en/vlogs.html` | Vlogs (YouTube embeds or local video files) |

## Admin interface (Firebase)

The site has a browser-based admin at `admin.html` (linked discreetly in the
footer). After logging in (Firebase Authentication, email/password) you can add,
edit and delete diary posts, gallery photos and vlogs directly on the website —
no file editing needed. Content is stored in **Firestore**; photos are compressed
in the browser (max 1600 px JPEG) and stored inline, so the free Spark plan is
enough. Videos are added as YouTube links.

The gallery is fully managed from admin (the static `js/data/gallery.js` seed is
empty). You can group photos into **albums (folders)**: create an album, then
assign photos to it on upload or via the dropdown on each photo row. The public
gallery shows albums as folder cards you click into; photos with no album appear
under "Other photos". Albums are stored as documents in the same `gallery`
collection (`kind: "album"`), so no extra security rule is needed; deleting an
album keeps its photos (they just become un-grouped).

Setup (one-time):
1. In the [Firebase console](https://console.firebase.google.com) create a
   **Web app** and copy its config into `js/firebase-config.js`.
2. Enable **Authentication → Sign-in method → Email/Password** and add a user
   with the admin email (must match `firestore.rules` and `js/firebase-config.js`).
3. Create a **Firestore database** (production mode).
4. Deploy the security rules: `npx firebase-tools deploy --only firestore:rules`
   (or paste `firestore.rules` into Firestore → Rules in the console).

The public pages merge Firestore content with the static seeds in `js/data/` and
work unchanged when Firebase is not configured.

### Editing the static page text (inline)

Headings, intros and the hero text are editable directly on the page. Log in at
`admin.html`, then open any normal page — a **"Upraviť stránku"** button appears
at the bottom right (only for the admin). Toggle it on, click any text, edit it
in the popup, Save. Edits are stored in the Firestore collection `siteText`
(one document per text, fields `sk` / `en`) and shown to all visitors. You edit
each language on its own page (SK pages save Slovak, the `/en/` pages save
English). Any element to make editable carries a `data-edit="key"` attribute in
the HTML; `js/sitetext.js` applies overrides and provides the editor.

## Adding content via files (no Firebase needed)

All content lives in three data files under `js/data/`. Each file starts with
a comment showing the exact format. **Both language versions read the same
files** — fields with an `_en` suffix (`title_en`, `body_en`, `caption_en`,
`description_en`, `tags_en`) are optional English versions; if missing, the
English pages fall back to the Slovak text.

### New diary post — `js/data/posts.js`

Add an entry at the top of the list:

```js
{
  title: "Prvý nájdený dubák!",
  title_en: "First porcini found!",      // optional
  date: "2026-06-15",
  tags: ["les", "tréning"],
  image: "assets/gallery/dubak.jpg",     // optional
  body: `
    <p>Dnes sa to podarilo...</p>
  `,
  body_en: `
    <p>Today we finally did it...</p>
  `                                      // optional
},
```

### New photo — `js/data/gallery.js`

1. Copy the photo into `assets/gallery/`
2. Add an entry:

```js
{ src: "assets/gallery/moja-fotka.jpg", caption: "Popis",
  caption_en: "Caption", date: "2026-06-15" },
```

### New vlog — `js/data/vlogs.js`

YouTube (take the ID from the video URL):

```js
{ type: "youtube", id: "ABC123xyz", title: "Plávanie v jazere", date: "2026-06-15", description: "..." },
```

Local video file (copy it into `assets/video/`):

```js
{ type: "file", src: "assets/video/plavanie.mp4", title: "Plávanie", date: "2026-06-15", description: "..." },
```

## Folder structure

```
index.html, plemeno.html, blog.html, galeria.html, vlogy.html   (Slovak)
en/index.html, en/breed.html, en/blog.html,
en/gallery.html, en/vlogs.html                                  (English)
css/style.css          – "Truffle & Curl" theme (from design_Sticht/, implemented in plain CSS)
js/main.js             – rendering logic (posts, gallery, lightbox, vlogs, slide viewer)
js/data/posts.js       – diary posts        ← edit to add content
js/data/gallery.js     – gallery photos     ← edit to add content
js/data/vlogs.js       – vlogs              ← edit to add content
assets/img/            – site imagery (hero, profile, coat)
assets/gallery/        – your photos
assets/video/          – your local videos
assets/guide/          – the 12 pages of the original field guide (slide viewer)
```
