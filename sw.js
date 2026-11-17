// Service worker de Musala : garde le site dans le téléphone pour économiser les données mobiles.
// Première visite : tout est téléchargé et rangé dans la mémoire du téléphone.
// Visites suivantes : Musala s'ouvre depuis cette mémoire (0 Ko), même sans Internet,
// puis vérifie discrètement s'il existe une nouvelle version, utilisée à la visite suivante.

const VERSION = "musala-v2";
const FICHIERS = [
  "./",
  "index.html",
  "css/style.css",
  "js/i18n.js",
  "js/db.js",
  "js/otp.js",
  "js/app.js",
  "vendor/sql-wasm.js",
  "vendor/sql-wasm.wasm",
  "manifest.webmanifest",
  "icones/icone-192.png",
  "icones/icone-512.png",
  "icones/icone-masquable-512.png",
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

// Supprime les anciennes versions gardées en mémoire.
self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((cle) => cle !== VERSION).map((cle) => caches.delete(cle))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (ev) => {
  const requete = ev.request;
  if (requete.method !== "GET" || new URL(requete.url).origin !== self.location.origin) return;
  const miseAJour = caches.open(VERSION).then((cache) =>
    fetch(requete)
      .then((reponse) => {
        if (reponse.ok) cache.put(requete, reponse.clone());
        return reponse;
      })
      .catch(() => null));
  ev.respondWith(
    caches.match(requete, { ignoreSearch: true }).then((enMemoire) =>
      enMemoire || miseAJour.then((reponse) => reponse || Response.error())),
  );
  ev.waitUntil(miseAJour);
});
