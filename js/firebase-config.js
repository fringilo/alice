// ============================================================
//  FIREBASE KONFIGURÁCIA
//
//  Hodnoty nájdeš vo Firebase konzole:
//  Project settings → General → Your apps → Web app → SDK setup (Config)
//
//  Kým je tu null, stránka beží len zo statických súborov js/data/
//  a admin rozhranie je vypnuté.
// ============================================================

window.FIREBASE_CONFIG = null;

// Po vytvorení web aplikácie vo Firebase to bude vyzerať takto:
// window.FIREBASE_CONFIG = {
//   apiKey: "AIza....",
//   authDomain: "tvoj-projekt.firebaseapp.com",
//   projectId: "tvoj-projekt",
//   storageBucket: "tvoj-projekt.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abcdef"
// };

// E-mail s právom upravovať obsah (musí sedieť s firestore.rules):
window.ADMIN_EMAIL = "marek.pinka@gmail.com";
