// ============================================================
//  FIREBASE KONFIGURÁCIA
//
//  Hodnoty nájdeš vo Firebase konzole:
//  Project settings → General → Your apps → Web app → SDK setup (Config)
//
//  Kým je tu null, stránka beží len zo statických súborov js/data/
//  a admin rozhranie je vypnuté.
// ============================================================

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAODf5ssRXF37Lhf_uJKoxPe1n4Kw7Nqj8",
  authDomain: "alice-e7442.firebaseapp.com",
  projectId: "alice-e7442",
  storageBucket: "alice-e7442.firebasestorage.app",
  messagingSenderId: "836252786708",
  appId: "1:836252786708:web:bf63fb3f5255f1fb5c0701",
  measurementId: "G-9WSWVL6M2N"
};

// E-mail s právom upravovať obsah (musí sedieť s firestore.rules):
window.ADMIN_EMAIL = "marek.pinka@gmail.com";
