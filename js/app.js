// Musala : le réseau pro de la RDC.
// Chaque page est une fonction qui renvoie du HTML, choisie selon l'adresse (#/...).

const VILLES = ["Kinshasa", "Lubumbashi", "Goma", "Bukavu", "Kisangani", "Mbuji-Mayi", "Kananga", "Matadi", "Kolwezi", "Bunia", "Mbandaka", "Kikwit"];
const SECTEURS = ["Informatique & Tech", "Mines", "Agriculture", "Santé", "Éducation", "Commerce", "BTP", "Banque & Finance", "Télécoms", "ONG & Humanitaire", "Transport & Logistique", "Hôtellerie"];
const CONTRATS = ["CDI", "CDD", "Stage", "Freelance", "Temps partiel"];
const NIVEAUX = ["Sans diplôme", "Certificat d'études primaires", "Diplôme d'État", "Formation professionnelle", "Graduat", "Licence", "Master", "Doctorat"];
const PIECES = ["Carte d'électeur", "Passeport", "Permis de conduire"];
const AGE_MINIMUM = 18;
const STATUTS = {
  envoyee: "Envoyée",
  vue: "Vue",
  entretien: "Entretien",
  retenue: "Retenue",
  refusee: "Non retenue",
};
const SESSION_KEY = "musala_session";

// Critères qu'un employeur doit remplir pour être validé.
const CRITERES_EMPLOYEUR = [
  { cle: "rccm", texte: "Entreprise immatriculée au RCCM (numéro valide)" },
  { cle: "id_nat", texte: "Numéro d'identification nationale (Id. Nat.)" },
  { cle: "nif", texte: "Numéro d'impôt (NIF)" },
  { cle: "adresse", texte: "Adresse physique du siège en RDC" },
  { cle: "responsable", texte: "Responsable du recrutement identifié (nom et fonction)" },
  { cle: "contact", texte: "Téléphone et e-mail joignables" },
];

// Critères qu'un demandeur d'emploi doit remplir pour être validé.
const CRITERES_DEMANDEUR = [
  { cle: "identite", texte: "Nom complet identique à celui de la pièce d'identité" },
  { cle: "age", texte: `Avoir au moins ${AGE_MINIMUM} ans (date de naissance)` },
  { cle: "piece", texte: "Pièce d'identité valide : carte d'électeur, passeport ou permis de conduire" },
  { cle: "adresse", texte: "Adresse de résidence en RDC" },
  { cle: "etudes", texte: "Niveau d'études renseigné" },
  { cle: "profil", texte: "Métier recherché et au moins une compétence" },
  { cle: "contact", texte: "Téléphone et e-mail joignables" },
];

const STATUTS_COMPTE = {
  en_attente: "En attente de validation",
  valide: "Validé",
  refuse: "Refusé",
  suspendu: "Suspendu",
};

// Les deux administrateurs : chacun ne traite que les dossiers de « sa » catégorie.
const ADMINS = {
  admin_employeurs: { cible: "employeur", titre: "Administration des employeurs", pluriel: "employeurs", criteres: CRITERES_EMPLOYEUR },
  admin_demandeurs: { cible: "demandeur", titre: "Administration des demandeurs", pluriel: "demandeurs", criteres: CRITERES_DEMANDEUR },
};

const app = document.getElementById("app");

// ---------- Petits outils ----------

function e(texte) {
  return String(texte ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initiales(nom) {
  return e(String(nom || "?").split(" ").map((m) => m[0]).slice(0, 2).join("").toUpperCase());
}

// La valeur enregistrée reste en français ; seul le texte affiché est traduit.
function options(liste, choisi, vide) {
  const premier = vide ? `<option value="">${e(t(vide))}</option>` : "";
  return premier + liste.map((v) => `<option value="${e(v)}" ${v === choisi ? "selected" : ""}>${e(t(v))}</option>`).join("");
}

function tags(texte, classe = "") {
  return String(texte || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `<span class="tag ${classe}">${e(t)}</span>`)
    .join("");
}

function depuis(date) {
  const jours = Math.floor((Date.now() - new Date(date.replace(" ", "T") + "Z")) / 86400000);
  if (jours <= 0) return t("aujourd'hui");
  if (jours === 1) return t("hier");
  return t("il y a {n} jours", { n: jours });
}

// Âge en années à partir d'une date "AAAA-MM-JJ" ; null si la date est invalide.
function age(date) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || ""));
  if (!m) return null;
  const naissance = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (naissance.getMonth() !== Number(m[2]) - 1) return null;
  const auj = new Date();
  let ans = auj.getFullYear() - naissance.getFullYear();
  if (auj < new Date(auj.getFullYear(), naissance.getMonth(), naissance.getDate())) ans--;
  return ans;
}

function chiffres(texte) {
  return String(texte || "").replace(/\D/g, "");
}

function normaliser(texte) {
  return String(texte || "").toUpperCase().replace(/[\s-]/g, "");
}

function dateFr(date) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || ""));
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "—";
}

function toast(message) {
  const boite = document.getElementById("toast");
  // Les messages sont écrits en français dans le code et traduits ici automatiquement.
  boite.textContent = traduireMessage(message);
  boite.classList.add("visible");
  clearTimeout(toast.minuteur);
  toast.minuteur = setTimeout(() => boite.classList.remove("visible"), 2600);
}

function aller(route) {
  if (location.hash === route) afficher();
  else location.hash = route;
}

// Marque un champ obligatoire (le code vérifie aussi ces champs à l'envoi).
const OBL = ' <span class="obligatoire" aria-hidden="true">*</span>';
const noteObl = () => `<p class="sous"><span class="obligatoire">*</span> ${t("Champ obligatoire")}</p>`;

function donneesForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

// ---------- Session ----------

// La session expire après 30 minutes sans activité,
// pour protéger les comptes sur les ordinateurs partagés (cybercafé, école…).
const SESSION_DUREE = 30 * 60 * 1000;

function lireSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY));
    return s && Number.isInteger(s.id) && typeof s.expire === "number" ? s : null;
  } catch (err) {
    return null;
  }
}

function ecrireSession(id) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ id, expire: Date.now() + SESSION_DUREE })); } catch (err) { /* rien */ }
}

function oublierSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (err) { /* rien */ }
}

function utilisateur() {
  const s = lireSession();
  if (!s) {
    oublierSession();
    return null;
  }
  if (s.expire < Date.now()) {
    oublierSession();
    toast("Session expirée : reconnecte-toi.");
    return null;
  }
  const u = DB.un("SELECT * FROM users WHERE id = ?", [s.id]);
  // Un administrateur désactivé par le super admin est déconnecté tout de suite.
  if (u && estAdmin(u) && u.statut_compte === "suspendu") {
    oublierSession();
    toast("Ton compte administrateur a été désactivé.");
    return null;
  }
  return u;
}

// Chaque action repousse l'expiration de 30 minutes.
function prolongerSession() {
  const s = lireSession();
  if (s && s.expire >= Date.now()) ecrireSession(s.id);
}

function estAdmin(u) {
  return !!u && Object.hasOwn(ADMINS, u.role);
}

function estSuperAdmin(u) {
  return !!u && u.role === "super_admin";
}

// Mot de passe temporaire aléatoire (sans caractères faciles à confondre comme 0/O ou 1/l).
function genererMotDePasse() {
  const lettres = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(crypto.getRandomValues(new Uint32Array(12)), (n) => lettres[n % lettres.length]).join("");
}

// Mot de passe temporaire à afficher une seule fois au super admin.
let mdpTemporaire = null;

function estValide(u, role) {
  return !!u && u.role === role && u.statut_compte === "valide";
}

// Renvoie l'utilisateur connecté s'il a le bon rôle, sinon l'envoie se connecter.
function exiger(role) {
  const moi = utilisateur();
  if (moi && moi.role === role) return moi;
  const noms = { employeur: "Réservé aux employeurs.", demandeur: "Réservé aux demandeurs d'emploi." };
  toast(noms[role] || "Accès refusé.");
  aller("#/connexion");
  return null;
}

// Employeurs et demandeurs ne peuvent agir qu'une fois leur dossier validé par un administrateur.
function exigerValide(role) {
  const moi = exiger(role);
  if (!moi) return null;
  if (moi.statut_compte !== "valide") {
    toast("Ton dossier doit d'abord être validé par un administrateur.");
    aller("#/espace");
    return null;
  }
  return moi;
}

function connecter(id) {
  ecrireSession(id);
}

function deconnecter() {
  oublierSession();
  toast("À bientôt sur Musala !");
  aller("#/");
}

function majNav() {
  const moi = utilisateur();
  let lienEspace = `<a href="#/espace">${t("Mon espace")}</a>`;
  if (estAdmin(moi)) {
    const n = DB.un("SELECT COUNT(*) AS n FROM users WHERE role = ? AND statut_compte = 'en_attente'", [ADMINS[moi.role].cible]).n;
    lienEspace = `<a href="#/espace">Administration${n ? ` <span class="pastille">${n}</span>` : ""}</a>`;
  } else if (estSuperAdmin(moi)) {
    lienEspace = '<a href="#/espace">Super admin 👑</a>';
  }
  document.getElementById("navUser").innerHTML = moi
    ? `${lienEspace}
       <button class="btn btn-petit btn-blanc" data-action="deconnexion">${t("Déconnexion")}</button>`
    : `<a href="#/connexion">${t("Connexion")}</a>
       <a href="#/inscription" class="btn btn-petit btn-rouge">${t("S'inscrire")}</a>`;
}

// ---------- Langue et mode léger ----------

// Mode léger : moins d'effets visuels et des listes plus courtes, pour économiser les données mobiles.
// Activé automatiquement si le téléphone est en mode « économie de données ».
function lireModeLeger() {
  const pref = lirePreferences().leger;
  if (typeof pref === "boolean") return pref;
  return !!(navigator.connection && navigator.connection.saveData);
}

let modeLeger = lireModeLeger();

function appliquerReglages() {
  document.documentElement.lang = langue;
  document.documentElement.classList.toggle("leger", modeLeger);
  const bouton = document.getElementById("boutonLeger");
  bouton.setAttribute("aria-pressed", String(modeLeger));
  bouton.title = t("Mode léger");
  bouton.setAttribute("aria-label", t("Mode léger"));
  const choix = document.getElementById("choixLangue");
  choix.setAttribute("aria-label", t("Langue"));
  choix.innerHTML = Object.entries(LANGUES)
    .map(([code, nom]) => `<option value="${code}" ${code === langue ? "selected" : ""}>${e(nom)}</option>`).join("");
  document.getElementById("lienOffres").textContent = t("Offres");
  document.getElementById("lienTalents").textContent = t("Talents");
  document.getElementById("piedSlogan").textContent = t("« le travail » en lingala · Le réseau pro de la RDC");
  document.getElementById("piedProjet").textContent = t("Projet d'Arnold · Code en Famille");
  const bandeau = document.getElementById("bandeauLangue");
  bandeau.hidden = langue === "fr";
  bandeau.textContent = langue === "fr" ? "" : t("🗣️ Traduction en cours de vérification : aide-nous à la corriger !");
  afficherCompteur();
}

// Nombre d'éléments affichés dans une liste ; le bouton « Voir plus » en ajoute d'autres.
function taillePage() {
  return modeLeger ? 6 : 24;
}

function combienAfficher(params) {
  const n = Number.parseInt(params.get("n"), 10);
  return Number.isInteger(n) && n > 0 ? Math.min(n, 1000) : taillePage();
}

function boutonVoirPlus(total, nombre, params) {
  if (total <= nombre) return "";
  const suite = new URLSearchParams(params);
  suite.set("n", String(nombre + taillePage()));
  const chemin = location.hash.split("?")[0] || "#/";
  return `<p style="text-align:center;margin-top:16px"><a class="btn btn-blanc" href="${e(chemin + "?" + suite)}">${t("Voir plus")} (${total - nombre})</a></p>`;
}

// Compteur de données : ce que cette visite a vraiment téléchargé (0 Ko pour ce qui vient de la mémoire du téléphone).
function donneesUtilisees() {
  if (!window.performance || !performance.getEntriesByType) return null;
  const entrees = [...performance.getEntriesByType("navigation"), ...performance.getEntriesByType("resource")];
  return Math.round(entrees.reduce((total, x) => total + (x.transferSize || 0), 0) / 1024);
}

function afficherCompteur() {
  const zone = document.getElementById("compteurDonnees");
  const ko = donneesUtilisees();
  zone.hidden = !modeLeger || ko === null;
  if (!zone.hidden) zone.textContent = t("📶 Mode léger activé · Cette visite a utilisé {ko} Ko d'Internet.", { ko });
}

// Garde Musala dans le téléphone (service worker) : les visites suivantes ne retéléchargent presque rien,
// et le site s'ouvre même sans Internet.
function enregistrerHorsLigne() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
  const premiereFois = !navigator.serviceWorker.controller;
  navigator.serviceWorker.register("sw.js")
    .then((inscription) => {
      if (!premiereFois) return;
      const travailleur = inscription.installing || inscription.waiting;
      if (!travailleur) return;
      travailleur.addEventListener("statechange", () => {
        if (travailleur.state === "activated") toast("Musala est enregistré sur ton appareil : il marche même sans Internet.");
      });
    })
    .catch((err) => console.warn("Mode hors ligne indisponible", err));
}

window.addEventListener("offline", () => toast("Tu n'es pas connecté à Internet : tu vois la dernière version enregistrée."));
window.addEventListener("load", () => setTimeout(afficherCompteur, 500));

document.getElementById("choixLangue").addEventListener("change", (ev) => {
  changerLangue(ev.target.value);
  appliquerReglages();
  afficher();
});

document.getElementById("boutonLeger").addEventListener("click", () => {
  modeLeger = !modeLeger;
  ecrirePreferences({ leger: modeLeger });
  appliquerReglages();
  afficher();
  toast(modeLeger ? "Mode léger activé 📶" : "Mode léger désactivé");
});

// ---------- Cartes réutilisables ----------

function carteOffre(o) {
  return `
    <a class="carte carte-lien" href="#/offre/${o.id}">
      <h3>${e(o.titre)}</h3>
      <p class="sous">${e(o.entreprise)} · ${e(o.ville)}</p>
      <div class="tags">
        <span class="tag tag-rouge">${e(t(o.type_contrat))}</span>
        <span class="tag">${e(t(o.secteur))}</span>
      </div>
      <small>${o.salaire ? "💰 " + e(o.salaire) + " · " : ""}${depuis(o.cree_le)}</small>
    </a>`;
}

function carteTalent(p) {
  return `
    <a class="carte carte-lien" href="#/talent/${p.id}">
      <div class="ligne">
        <div class="avatar">${initiales(p.nom)}</div>
        <div>
          <h3>${e(p.nom)} <span class="verifie" title="${e(t("✔ Vérifié"))}">✔</span></h3>
          <p class="sous" style="margin:0">${e(p.titre || t("Membre Musala"))} · ${e(p.ville)}</p>
        </div>
      </div>
      <div class="tags">${tags(p.competences)}</div>
    </a>`;
}

// Seules les offres d'employeurs validés sont visibles du public.
const REQ_OFFRES = `
  SELECT o.*, u.nom AS entreprise FROM offres o
  JOIN users u ON u.id = o.employeur_id
  WHERE o.active = 1 AND u.statut_compte = 'valide'`;

// Seuls les demandeurs validés apparaissent dans les talents.
const REQ_TALENTS = `
  SELECT u.id, u.nom, u.ville, p.titre, p.competences, p.bio FROM users u
  JOIN profils p ON p.user_id = u.id
  WHERE u.role = 'demandeur' AND u.statut_compte = 'valide'`;

// ---------- Pages ----------

const pages = {
  accueil() {
    const nbOffres = DB.un(`SELECT COUNT(*) AS n FROM (${REQ_OFFRES})`).n;
    const nbTalents = DB.un(`SELECT COUNT(*) AS n FROM (${REQ_TALENTS})`).n;
    const nbEntreprises = DB.un("SELECT COUNT(*) AS n FROM users WHERE role = 'employeur' AND statut_compte = 'valide'").n;
    const recentes = DB.tous(REQ_OFFRES + " ORDER BY o.cree_le DESC, o.id DESC LIMIT 3");
    return `
      <section class="hero">
        <h1>${t("Ton talent mérite d'être vu.")} 🇨🇩</h1>
        <p>${t("Musala connecte les demandeurs d'emploi et les employeurs de toute la RDC, de Kinshasa à Lubumbashi, de Goma à Matadi.")}</p>
        <form class="recherche" data-form="recherche">
          <input name="q" placeholder="${e(t("Métier, compétence…"))}">
          <select name="ville">${options(VILLES, "", "Toutes les villes")}</select>
          <button class="btn btn-rouge">${t("Chercher")}</button>
        </form>
        <div class="hero-actions">
          <a href="#/inscription?role=demandeur" class="btn btn-blanc">${t("Je cherche un emploi")}</a>
          <a href="#/inscription?role=employeur" class="btn btn-rouge">${t("Je recrute")}</a>
        </div>
      </section>

      <section class="stats">
        <div class="stat"><b>${nbOffres}</b><span>${t("offres d'emploi")}</span></div>
        <div class="stat"><b>${nbTalents}</b><span>${t("talents vérifiés")}</span></div>
        <div class="stat"><b>${nbEntreprises}</b><span>${t("employeurs vérifiés")}</span></div>
      </section>

      <h2 class="section">${t("Offres récentes")}</h2>
      <div class="grille">${recentes.map(carteOffre).join("") || `<p class="vide">${t("Aucune offre pour le moment.")}</p>`}</div>
      <p style="text-align:center;margin-top:20px"><a href="#/offres" class="btn">${t("Voir toutes les offres")}</a></p>`;
  },

  offres(params) {
    const q = params.get("q") || "";
    const ville = params.get("ville") || "";
    const secteur = params.get("secteur") || "";
    const contrat = params.get("contrat") || "";
    let req = REQ_OFFRES;
    const p = [];
    if (q) {
      req += " AND (o.titre LIKE ? OR o.competences LIKE ? OR o.description LIKE ? OR u.nom LIKE ?)";
      p.push(...Array(4).fill(`%${q}%`));
    }
    if (ville) { req += " AND o.ville = ?"; p.push(ville); }
    if (secteur) { req += " AND o.secteur = ?"; p.push(secteur); }
    if (contrat) { req += " AND o.type_contrat = ?"; p.push(contrat); }
    const liste = DB.tous(req + " ORDER BY o.cree_le DESC, o.id DESC", p);
    const nombre = combienAfficher(params);
    return `
      <div class="page-titre"><h1>${t("Offres d'emploi")}</h1><span class="sous">${t("{n} résultat(s)", { n: liste.length })}</span></div>
      <form class="filtres" data-form="filtres">
        <input name="q" placeholder="${e(t("Métier, compétence, entreprise…"))}" value="${e(q)}">
        <select name="ville">${options(VILLES, ville, "Toutes les villes")}</select>
        <select name="secteur">${options(SECTEURS, secteur, "Tous les secteurs")}</select>
        <select name="contrat">${options(CONTRATS, contrat, "Tous les contrats")}</select>
        <button class="btn">${t("Filtrer")}</button>
      </form>
      <div class="grille">${liste.slice(0, nombre).map(carteOffre).join("") || `<p class="vide">${t("Aucune offre ne correspond. Essaie d'autres filtres !")}</p>`}</div>
      ${boutonVoirPlus(liste.length, nombre, params)}`;
  },

  offre(params, id) {
    const o = DB.un(`SELECT o.*, u.nom AS entreprise, u.statut_compte, en.description AS desc_entreprise FROM offres o
      JOIN users u ON u.id = o.employeur_id LEFT JOIN entreprises en ON en.user_id = u.id WHERE o.id = ?`, [Number(id)]);
    if (!o) return pages.introuvable();
    const moi = utilisateur();
    // L'offre d'un employeur non validé (ou suspendu) reste cachée, sauf pour lui et l'admin des employeurs.
    const visible = o.statut_compte === "valide" || (moi && (moi.id === o.employeur_id || moi.role === "admin_employeurs"));
    if (!visible) return pages.introuvable();
    let action = `<a class="btn btn-rouge" href="#/connexion?retour=${encodeURIComponent("#/offre/" + o.id)}">${t("Se connecter pour postuler")}</a>`;
    if (o.statut_compte !== "valide") {
      action = `<p class="sous">${t("🔒 Cette offre n'est pas visible du public : le compte de l'employeur n'est pas validé.")}</p>`;
    } else if (estAdmin(moi)) {
      action = `<p class="sous">${t("Tu es connecté en administrateur.")}</p>`;
    } else if (moi && moi.role === "employeur") {
      action = moi.id === o.employeur_id
        ? `<a class="btn" href="#/espace/candidats/${o.id}">${t("Voir les candidats")}</a>`
        : `<p class="sous">${t("Connecte-toi avec un compte demandeur pour postuler.")}</p>`;
    } else if (moi && moi.statut_compte !== "valide") {
      action = `<p>${t("🔒 Ton dossier doit être validé par un administrateur avant de pouvoir postuler.")} <a href="#/espace">${t("Voir mon dossier")}</a></p>`;
    } else if (moi) {
      const deja = DB.un("SELECT statut FROM candidatures WHERE offre_id = ? AND demandeur_id = ?", [o.id, moi.id]);
      action = deja
        ? `<p>${t("✅ Tu as déjà postulé. Statut :")} <span class="statut statut-${e(deja.statut)}">${e(t(STATUTS[deja.statut]))}</span></p>`
        : `<form data-form="postuler" data-offre="${o.id}">
             <label for="message">${t("Ton message à l'employeur")}</label>
             <textarea id="message" name="message" placeholder="${e(t("Présente-toi en quelques lignes et dis pourquoi ce poste t'intéresse."))}" required></textarea>
             <button class="btn btn-rouge" style="margin-top:12px">${t("Postuler")}</button>
           </form>`;
    }
    return `
      <div class="detail carte">
        <a href="#/offres">${t("← Toutes les offres")}</a>
        <h1>${e(o.titre)}</h1>
        <p class="sous">${e(o.entreprise)}${o.statut_compte === "valide" ? ` <span class="verifie">${t("✔ Vérifié")}</span>` : ""} · ${e(o.ville)} · ${t("publiée {quand}", { quand: depuis(o.cree_le) })}</p>
        <div class="tags">
          <span class="tag tag-rouge">${e(t(o.type_contrat))}</span>
          <span class="tag">${e(t(o.secteur))}</span>
          ${o.salaire ? `<span class="tag">💰 ${e(o.salaire)}</span>` : ""}
        </div>
        <h3>${t("Le poste")}</h3>
        <p class="description">${e(o.description)}</p>
        ${o.competences ? `<h3>${t("Compétences recherchées")}</h3><div class="tags">${tags(o.competences)}</div>` : ""}
        ${o.desc_entreprise ? `<h3>${e(t("À propos de {nom}", { nom: o.entreprise }))}</h3><p>${e(o.desc_entreprise)}</p>` : ""}
        <hr style="border:0;border-top:1px solid var(--bord);margin:24px 0">
        ${action}
      </div>`;
  },

  talents(params) {
    const q = params.get("q") || "";
    const ville = params.get("ville") || "";
    let req = REQ_TALENTS;
    const p = [];
    if (q) {
      req += " AND (u.nom LIKE ? OR p.titre LIKE ? OR p.competences LIKE ?)";
      p.push(...Array(3).fill(`%${q}%`));
    }
    if (ville) { req += " AND u.ville = ?"; p.push(ville); }
    const liste = DB.tous(req + " ORDER BY u.id DESC", p);
    const nombre = combienAfficher(params);
    return `
      <div class="page-titre"><h1>${t("Talents")}</h1><span class="sous">${t("{n} profil(s) vérifié(s)", { n: liste.length })}</span></div>
      <form class="filtres" data-form="filtres-talents">
        <input name="q" placeholder="${e(t("Nom, métier, compétence…"))}" value="${e(q)}">
        <select name="ville">${options(VILLES, ville, "Toutes les villes")}</select>
        <button class="btn">${t("Filtrer")}</button>
      </form>
      <div class="grille">${liste.slice(0, nombre).map(carteTalent).join("") || `<p class="vide">${t("Aucun talent trouvé.")}</p>`}</div>
      ${boutonVoirPlus(liste.length, nombre, params)}`;
  },

  talent(params, id) {
    const p = DB.un(`SELECT u.*, p.* FROM users u JOIN profils p ON p.user_id = u.id
      WHERE u.id = ? AND u.role = 'demandeur'`, [Number(id)]);
    if (!p) return pages.introuvable();
    const moi = utilisateur();
    // Un profil non validé n'est visible que par son propriétaire et l'admin des demandeurs.
    const visible = p.statut_compte === "valide" || (moi && (moi.id === p.id || moi.role === "admin_demandeurs"));
    if (!visible) return pages.introuvable();
    const voitContact = estValide(moi, "employeur") || (moi && (moi.id === p.id || moi.role === "admin_demandeurs"));
    const contact = voitContact
      ? `<p>📧 <a href="mailto:${e(p.email)}">${e(p.email)}</a>${p.telephone ? ` · 📞 ${e(p.telephone)}` : ""}</p>`
      : `<p class="sous">${t("Les coordonnées sont visibles uniquement par les employeurs vérifiés.")}</p>`;
    return `
      <div class="detail carte">
        <a href="#/talents">${t("← Tous les talents")}</a>
        ${p.statut_compte !== "valide" ? `<div class="bandeau bandeau-en_attente">${t("🔒 Ce profil n'est pas encore visible du public.")} (${e(t(STATUTS_COMPTE[p.statut_compte]))})</div>` : ""}
        <div class="ligne" style="margin-top:16px">
          <div class="avatar avatar-grand">${initiales(p.nom)}</div>
          <div>
            <h1 style="margin:0">${e(p.nom)}${p.statut_compte === "valide" ? ` <span class="verifie">${t("✔ Vérifié")}</span>` : ""}</h1>
            <p class="sous" style="margin:0">${e(p.titre || t("Membre Musala"))} · ${e(p.ville)}</p>
            ${p.disponible ? `<span class="tag">${t("🟢 Disponible")}</span>` : ""}
          </div>
        </div>
        ${p.bio ? `<h3>${t("À propos")}</h3><p class="description">${e(p.bio)}</p>` : ""}
        ${p.competences ? `<h3>${t("Compétences")}</h3><div class="tags">${tags(p.competences)}</div>` : ""}
        ${p.experience ? `<h3>${t("Expérience")}</h3><p class="description">${e(p.experience)}</p>` : ""}
        ${p.niveau_etudes ? `<h3>${t("Études")}</h3><p>${e(t(p.niveau_etudes))}</p>` : ""}
        <h3>${t("Contact")}</h3>${contact}
      </div>`;
  },

  connexion(params) {
    const retour = params.get("retour") || "#/espace";
    return `
      <form class="form carte" data-form="connexion" data-retour="${e(retour)}">
        <h1>${t("Connexion")}</h1>
        <label for="email">${t("E-mail")}</label>
        <input id="email" name="email" type="email" required autocomplete="email">
        <label for="mdp">${t("Mot de passe")}</label>
        <input id="mdp" name="mdp" type="password" required autocomplete="current-password">
        <button class="btn">${t("Se connecter")}</button>
        <p style="text-align:center">${t("Pas encore de compte ?")} <a href="#/inscription">${t("Inscris-toi")}</a></p>
        <div class="astuce">💡 Comptes de test (mot de passe <b>musala123</b>) : <b>grace@exemple.cd</b> (demandeuse validée), <b>merveille@exemple.cd</b> (demandeuse en attente), <b>contact@kindigital.cd</b> (employeur validé), <b>rh@congobatiment.cd</b> (employeur en attente).
          <br>Administrateurs : <b>admin.employeurs@musala.cd</b> / <b>admin-employeurs</b> et <b>admin.demandeurs@musala.cd</b> / <b>admin-demandeurs</b>.
          <br>Super admin : <b>superadmin@musala.cd</b> / <b>super-musala</b>.</div>
        <div class="astuce">${t("🔒 Sur un ordinateur partagé (cybercafé, école), pense à cliquer sur Déconnexion en partant. Par sécurité, Musala te déconnecte aussi après 30 minutes sans activité.")}</div>
      </form>`;
  },

  inscription(params) {
    const role = params.get("role") === "employeur" ? "employeur" : "demandeur";
    // Étapes 1 et 2 : vérifier l'adresse e-mail avec un code reçu par e-mail.
    if (!OTP.verifie || !OTP.estVerifie(OTP.verifie.email)) return etapesOtp();
    return `
      <form class="form carte" data-form="inscription">
        ${etapes(3)}
        <h1>${t("Rejoins Musala")}</h1>
        ${noteObl()}
        <label>${t("Je suis…")}</label>
        <div class="choix-role">
          <label><input type="radio" name="role" value="demandeur" ${role === "demandeur" ? "checked" : ""}><span>${t("👤 Demandeur d'emploi")}</span><small>${t("Je cherche un travail")}</small></label>
          <label><input type="radio" name="role" value="employeur" ${role === "employeur" ? "checked" : ""}><span>${t("🏢 Employeur")}</span><small>${t("Je recrute")}</small></label>
        </div>
        <label for="nom">${t("Nom complet (comme sur ta pièce d'identité) ou nom de l'entreprise")}${OBL}</label>
        <input id="nom" name="nom" required maxlength="100">
        <div class="deux-col">
          <div>
            <label for="ville">${t("Ville")}${OBL}</label>
            <select id="ville" name="ville" required>${options(VILLES, "Kinshasa")}</select>
          </div>
          <div>
            <label for="telephone">${t("Téléphone")}${OBL}</label>
            <input id="telephone" name="telephone" placeholder="+243…" required>
          </div>
        </div>
        <label for="email">${t("E-mail")} <span class="verifie">${t("✔ vérifié")}</span></label>
        <input id="email" name="email" type="email" value="${e(OTP.verifie.email)}" readonly>
        <p class="sous" style="margin:4px 0 0"><a href="#/inscription" data-action="otp-recommencer">${t("Utiliser une autre adresse")}</a></p>
        <label for="mdp">${t("Mot de passe (8 caractères minimum)")}${OBL}</label>
        <input id="mdp" name="mdp" type="password" minlength="8" required autocomplete="new-password">

        <fieldset class="bloc-role" id="champsDemandeur" ${role === "demandeur" ? "" : "hidden disabled"}>
          <h3>${t("👤 Dossier de vérification")}</h3>
          ${blocCriteres("demandeur")}
          ${champsDemandeur({}, "d-")}
        </fieldset>
        <fieldset class="bloc-role" id="champsEmployeur" ${role === "employeur" ? "" : "hidden disabled"}>
          <h3>${t("🏢 Dossier de vérification")}</h3>
          ${blocCriteres("employeur")}
          ${champsEmployeur({}, "e-")}
        </fieldset>

        <button class="btn btn-rouge">${t("Créer mon compte et envoyer mon dossier")}</button>
        <p style="text-align:center">${t("Déjà inscrit ?")} <a href="#/connexion">${t("Connecte-toi")}</a></p>
      </form>`;
  },

  espace(params) {
    const moi = utilisateur();
    if (!moi) { aller("#/connexion"); return ""; }
    if (estSuperAdmin(moi)) return espaceSuperAdmin(moi);
    if (estAdmin(moi)) return espaceAdmin(moi, params);
    return moi.role === "employeur" ? espaceEmployeur(moi) : espaceDemandeur(moi);
  },

  motDePasse() {
    const moi = utilisateur();
    if (!moi) { aller("#/connexion"); return ""; }
    const minimum = estAdmin(moi) || estSuperAdmin(moi) ? 10 : 8;
    return `
      <form class="form carte" data-form="mot-de-passe">
        ${moi.doit_changer_mdp
          ? `<div class="bandeau bandeau-en_attente">🔑 <b>Bienvenue ${e(moi.nom)} !</b> Ton compte a été créé avec un mot de passe temporaire. Choisis ton propre mot de passe pour continuer.</div>`
          : `<a href="#/espace">${t("← Mon espace")}</a>`}
        <h1>${t("Changer mon mot de passe")}</h1>
        ${noteObl()}
        <label for="actuel">${t("Mot de passe actuel")}${moi.doit_changer_mdp ? " (temporaire)" : ""}${OBL}</label>
        <input id="actuel" name="actuel" type="password" required autocomplete="current-password">
        <label for="nouveau">${t("Nouveau mot de passe ({minimum} caractères minimum)", { minimum })}${OBL}</label>
        <input id="nouveau" name="nouveau" type="password" minlength="${minimum}" required autocomplete="new-password">
        <label for="confirmation">${t("Confirme le nouveau mot de passe")}${OBL}</label>
        <input id="confirmation" name="confirmation" type="password" minlength="${minimum}" required autocomplete="new-password">
        <button class="btn btn-rouge">${t("Enregistrer")}</button>
      </form>`;
  },

  nouvelleOffre() {
    const moi = exigerValide("employeur");
    if (!moi) return "";
    return `
      <form class="form carte" data-form="offre">
        <a href="#/espace">${t("← Mon espace")}</a>
        <h1>${t("Publier une offre")}</h1>
        <label for="titre">${t("Intitulé du poste")}</label>
        <input id="titre" name="titre" required placeholder="Ex : Développeur web junior">
        <div class="deux-col">
          <div><label for="secteur">${t("Secteur")}</label><select id="secteur" name="secteur">${options(SECTEURS, "")}</select></div>
          <div><label for="ville">${t("Ville")}</label><select id="ville" name="ville">${options(VILLES, moi.ville)}</select></div>
          <div><label for="type_contrat">${t("Contrat")}</label><select id="type_contrat" name="type_contrat">${options(CONTRATS, "CDI")}</select></div>
          <div><label for="salaire">${t("Salaire (facultatif)")}</label><input id="salaire" name="salaire" placeholder="Ex : 600 $ / mois"></div>
        </div>
        <label for="description">${t("Description du poste")}</label>
        <textarea id="description" name="description" required placeholder="${e(t("Missions, horaires, avantages…"))}"></textarea>
        <label for="competences">${t("Compétences (séparées par des virgules)")}</label>
        <input id="competences" name="competences" placeholder="Ex : Excel, Français, Permis B">
        <button class="btn btn-rouge">${t("Publier l'offre")}</button>
      </form>`;
  },

  candidats(params, id) {
    const moi = exigerValide("employeur");
    if (!moi) return "";
    const o = DB.un("SELECT * FROM offres WHERE id = ? AND employeur_id = ?", [Number(id), moi.id]);
    if (!o) return pages.introuvable();
    const liste = DB.tous(`SELECT c.*, u.nom, u.email, u.telephone, u.ville, p.titre FROM candidatures c
      JOIN users u ON u.id = c.demandeur_id LEFT JOIN profils p ON p.user_id = u.id
      WHERE c.offre_id = ? ORDER BY c.cree_le DESC`, [o.id]);
    const lignes = liste.map((c) => `
      <tr>
        <td><a href="#/talent/${c.demandeur_id}"><b>${e(c.nom)}</b></a><br><small>${e(c.titre || "")} · ${e(c.ville)}</small><br><small>${e(c.email)}</small></td>
        <td style="white-space:pre-line">${e(c.message)}</td>
        <td><select data-statut="${c.id}">${Object.entries(STATUTS).map(([k, v]) => `<option value="${k}" ${k === c.statut ? "selected" : ""}>${e(t(v))}</option>`).join("")}</select></td>
      </tr>`).join("");
    return `
      <div class="page-titre"><h1>${t("Candidats")}</h1><a href="#/espace">${t("← Mon espace")}</a></div>
      <p class="sous">${e(t("Pour l'offre « {titre} » · {n} candidature(s)", { titre: o.titre, n: liste.length }))}</p>
      <div class="carte table-scroll">
        ${liste.length ? `<table><tr><th>${t("Candidat")}</th><th>${t("Message")}</th><th>${t("Statut")}</th></tr>${lignes}</table>` : `<p class="vide">${t("Pas encore de candidat. Partage ton offre !")}</p>`}
      </div>`;
  },

  introuvable() {
    return `<div class="vide"><h1>${t("Oups ! 🤔")}</h1><p>${t("Cette page n'existe pas.")}</p><a class="btn" href="#/">${t("Retour à l'accueil")}</a></div>`;
  },
};

// ---------- Vérification de l'e-mail (OTP) ----------

function etapes(active) {
  const noms = [t("Ton e-mail"), t("Le code reçu"), t("Ton dossier")];
  return `<ol class="etapes">${noms.map((n, i) =>
    `<li class="${i + 1 < active ? "faite" : i + 1 === active ? "active" : ""}"><span>${i + 1 < active ? "✔" : i + 1}</span>${e(n)}</li>`).join("")}</ol>`;
}

function etapesOtp() {
  const c = OTP.enCours;
  if (!c) {
    return `
      <form class="form carte" data-form="otp-email">
        ${etapes(1)}
        <h1>${t("Rejoins Musala")}</h1>
        <p>${t("Pour commencer, on vérifie que ton adresse e-mail t'appartient bien et que tu n'es pas un robot 🤖. Tu vas recevoir un code à 6 chiffres.")}</p>
        <label for="otp-email">${t("Ton adresse e-mail")}${OBL}</label>
        <input id="otp-email" name="email" type="email" required autocomplete="email" maxlength="120">
        <!-- Piège à robots : ce champ est invisible pour les humains. Un robot qui le remplit est bloqué. -->
        <div class="piege" aria-hidden="true">
          <label for="site_web">${t("Ne pas remplir")}</label>
          <input id="site_web" name="site_web" tabindex="-1" autocomplete="off">
        </div>
        <button class="btn btn-rouge">${t("Recevoir mon code")}</button>
        <p style="text-align:center">${t("Déjà inscrit ?")} <a href="#/connexion">${t("Connecte-toi")}</a></p>
      </form>`;
  }
  const minutes = Math.max(1, Math.ceil((c.expire - Date.now()) / 60000));
  const demo = OTP.boiteDemo ? `
    <div class="boite-demo carte">
      <p class="boite-titre">${t("📬 Boîte mail de démonstration")}</p>
      <p class="sous">${t("En mode démo, aucun e-mail n'est vraiment envoyé : voici le message que tu recevrais.")}</p>
      <div class="email-demo">
        <p><b>De :</b> Musala &lt;no-reply@musala.cd&gt;<br><b>À :</b> ${e(OTP.boiteDemo.a)}<br><b>Objet :</b> ${e(OTP.boiteDemo.sujet)}</p>
        <p class="email-texte">${e(OTP.boiteDemo.texte)}</p>
      </div>
    </div>` : "";
  return `
    <form class="form carte" data-form="otp-code">
      ${etapes(2)}
      <h1>${t("Entre ton code")}</h1>
      <p>${t("Nous avons envoyé un code à 6 chiffres à {email}. Il est valable {minutes} minute(s).", { email: `<b>${e(c.email)}</b>`, minutes })}</p>
      <label for="otp-code">${t("Code reçu par e-mail")}${OBL}</label>
      <input id="otp-code" name="code" class="champ-code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required placeholder="••••••">
      <button class="btn btn-rouge">${t("Vérifier mon code")}</button>
      <p class="actions" style="justify-content:center">
        <button type="button" class="btn btn-petit btn-blanc" data-action="otp-renvoyer">${t("Renvoyer le code")}</button>
        <button type="button" class="btn btn-petit btn-blanc" data-action="otp-recommencer">${t("Changer d'adresse e-mail")}</button>
      </p>
      <p class="sous">${t("Pas reçu ? Regarde dans tes courriers indésirables (spam).")}</p>
    </form>
    ${demo}`;
}

// ---------- Dossiers de vérification ----------

function blocCriteres(role) {
  const intro = role === "employeur"
    ? t("Pour protéger les demandeurs contre les fausses offres, chaque employeur est vérifié par un administrateur avant de pouvoir recruter. Il faut :")
    : t("Pour garantir des profils sérieux aux employeurs, chaque demandeur est vérifié par un administrateur avant de pouvoir postuler. Il faut :");
  const criteres = role === "employeur" ? CRITERES_EMPLOYEUR : CRITERES_DEMANDEUR;
  return `<div class="astuce">${intro}<ul class="criteres">${criteres.map((c) => `<li>${e(t(c.texte))}</li>`).join("")}</ul></div>`;
}

// p : préfixe des identifiants, pour pouvoir afficher deux dossiers sur la même page.
function champsEmployeur(v, p = "") {
  return `
    <div class="deux-col">
      <div><label for="${p}secteur">${t("Secteur")}${OBL}</label><select required id="${p}secteur" name="secteur">${options(SECTEURS, v.secteur, "Choisir…")}</select></div>
      <div><label for="${p}rccm">${t("N° RCCM")}${OBL}</label><input required id="${p}rccm" name="rccm" value="${e(v.rccm)}" maxlength="60" placeholder="Ex : CD/KIN/RCCM/24-B-01234"></div>
      <div><label for="${p}id_nat">${t("N° Id. Nat.")}${OBL}</label><input required id="${p}id_nat" name="id_nat" value="${e(v.id_nat)}" maxlength="60"></div>
      <div><label for="${p}nif">${t("N° Impôt (NIF)")}${OBL}</label><input required id="${p}nif" name="nif" value="${e(v.nif)}" maxlength="60"></div>
      <div><label for="${p}responsable">${t("Nom du responsable")}${OBL}</label><input required id="${p}responsable" name="responsable" value="${e(v.responsable)}" maxlength="100"></div>
      <div><label for="${p}fonction_responsable">${t("Sa fonction")}${OBL}</label><input required id="${p}fonction_responsable" name="fonction_responsable" value="${e(v.fonction_responsable)}" maxlength="100" placeholder="Ex : Directeur RH"></div>
    </div>
    <label for="${p}adresse">${t("Adresse du siège")}${OBL}</label>
    <input required id="${p}adresse" name="adresse" value="${e(v.adresse)}" maxlength="200" placeholder="N°, avenue, commune, ville">`;
}

function champsDemandeur(v, p = "") {
  return `
    <div class="deux-col">
      <div><label for="${p}date_naissance">${t("Date de naissance")}${OBL}</label><input required id="${p}date_naissance" name="date_naissance" type="date" value="${e(v.date_naissance)}"></div>
      <div><label for="${p}niveau_etudes">${t("Niveau d'études")}${OBL}</label><select required id="${p}niveau_etudes" name="niveau_etudes">${options(NIVEAUX, v.niveau_etudes, "Choisir…")}</select></div>
      <div><label for="${p}type_piece">${t("Pièce d'identité")}${OBL}</label><select required id="${p}type_piece" name="type_piece">${options(PIECES, v.type_piece, "Choisir…")}</select></div>
      <div><label for="${p}numero_piece">${t("N° de la pièce")}${OBL}</label><input required id="${p}numero_piece" name="numero_piece" value="${e(v.numero_piece)}" maxlength="30"></div>
    </div>
    <label for="${p}adresse">${t("Adresse de résidence")}${OBL}</label>
    <input required id="${p}adresse" name="adresse" value="${e(v.adresse)}" maxlength="200" placeholder="N°, avenue, quartier, commune">
    <label for="${p}titre">${t("Métier recherché")}${OBL}</label>
    <input required id="${p}titre" name="titre" value="${e(v.titre)}" maxlength="100" placeholder="Ex : Comptable">
    <label for="${p}competences">${t("Compétences (séparées par des virgules)")}${OBL}</label>
    <input required id="${p}competences" name="competences" value="${e(v.competences)}" maxlength="300" placeholder="Ex : Excel, Anglais, Vente">`;
}

function erreurTelephone(telephone) {
  return chiffres(telephone).length < 9 ? "Indique un numéro de téléphone joignable (au moins 9 chiffres)." : null;
}

// Vérifie le dossier envoyé ; renvoie un message d'erreur ou null.
function erreurDossierEmployeur(d) {
  if (!SECTEURS.includes(d.secteur)) return "Choisis le secteur de l'entreprise.";
  const champs = { rccm: "le n° RCCM", id_nat: "le n° Id. Nat.", nif: "le n° d'impôt (NIF)", adresse: "l'adresse du siège", responsable: "le nom du responsable", fonction_responsable: "la fonction du responsable" };
  for (const [cle, nom] of Object.entries(champs)) {
    const valeur = String(d[cle] || "").trim();
    if (!valeur) return `Indique ${nom}.`;
    if (valeur.length > 200) return `${nom[0].toUpperCase() + nom.slice(1)} est trop long.`;
  }
  if (!/RCCM/i.test(d.rccm)) return "Le n° RCCM doit contenir « RCCM » (ex : CD/KIN/RCCM/24-B-01234).";
  return erreurTelephone(d.telephone);
}

function erreurDossierDemandeur(d) {
  const ans = age(d.date_naissance);
  if (ans === null || ans > 100) return "Indique une date de naissance valide.";
  if (ans < AGE_MINIMUM) return `Il faut avoir au moins ${AGE_MINIMUM} ans pour s'inscrire.`;
  if (!PIECES.includes(d.type_piece)) return "Choisis le type de pièce d'identité.";
  if (!/^[A-Za-z0-9 /-]{4,30}$/.test(String(d.numero_piece || "").trim())) return "Le n° de pièce doit faire 4 à 30 caractères (lettres, chiffres, tirets).";
  if (String(d.adresse || "").trim().length < 5) return "Indique ton adresse de résidence.";
  if (!NIVEAUX.includes(d.niveau_etudes)) return "Choisis ton niveau d'études.";
  if (!String(d.titre || "").trim()) return "Indique le métier que tu recherches.";
  if (!tags(d.competences)) return "Indique au moins une compétence.";
  return erreurTelephone(d.telephone);
}

function erreurDossier(role, d) {
  return role === "employeur" ? erreurDossierEmployeur(d) : erreurDossierDemandeur(d);
}

// Enregistre le dossier et le (re)met en attente de validation.
function enregistrerDossier(role, userId, d) {
  const val = (cle) => String(d[cle] || "").trim();
  if (role === "employeur") {
    DB.executer(`UPDATE entreprises SET secteur = ?, rccm = ?, id_nat = ?, nif = ?, adresse = ?, responsable = ?, fonction_responsable = ?
      WHERE user_id = ?`, [d.secteur, val("rccm"), val("id_nat"), val("nif"), val("adresse"), val("responsable"), val("fonction_responsable"), userId]);
  } else {
    DB.executer(`UPDATE profils SET date_naissance = ?, type_piece = ?, numero_piece = ?, adresse = ?, niveau_etudes = ?, titre = ?, competences = ?
      WHERE user_id = ?`, [d.date_naissance, d.type_piece, val("numero_piece").toUpperCase(), val("adresse"), d.niveau_etudes, val("titre"), val("competences"), userId]);
  }
  DB.executer(`UPDATE users SET statut_compte = 'en_attente', dossier_envoye_le = datetime('now'),
    motif = NULL, decide_le = NULL, decide_par = NULL WHERE id = ?`, [userId]);
}

function bandeauStatut(moi) {
  const s = moi.statut_compte;
  if (s === "valide") return "";
  const droits = moi.role === "employeur"
    ? t("Tu pourras publier des offres dès que ton compte sera validé.")
    : t("Tu pourras postuler aux offres et apparaître dans les talents dès que ton dossier sera validé.");
  const textes = {
    en_attente: `⏳ <b>${t("Ton dossier est en cours de vérification.")}</b> ${t("Un administrateur va contrôler tes informations.")} ${droits}`,
    refuse: `❌ <b>${t("Ton dossier a été refusé.")}</b> ${t("Corrige les informations ci-dessous puis renvoie-le.")}`,
    suspendu: `⛔ <b>${t("Ton compte est suspendu.")}</b> ${t("Contacte l'administrateur de Musala.")}`,
  };
  return `<div class="bandeau bandeau-${e(s)}">${textes[s] || ""}${moi.motif ? `<br>${t("Motif :")} <i>${e(moi.motif)}</i>` : ""}</div>`;
}

function enTeteEspace(moi, titre, bouton = "") {
  const gestion = estAdmin(moi) || estSuperAdmin(moi);
  const pastille = gestion ? "" : ` <span class="statut statut-compte-${e(moi.statut_compte)}">${e(t(STATUTS_COMPTE[moi.statut_compte]))}</span>`;
  return `
    <div class="page-titre"><h1>${titre}${pastille}</h1>${bouton}</div>
    <p class="lien-mdp"><a href="#/mot-de-passe">${t("🔑 Changer mon mot de passe")}</a></p>
    ${gestion ? "" : bandeauStatut(moi)}`;
}

// ---------- Espace super administrateur ----------

const TYPES_ADMIN = { admin_employeurs: "Admin des employeurs", admin_demandeurs: "Admin des demandeurs" };

function espaceSuperAdmin(moi) {
  const n = (req, p = []) => DB.un(req, p).n;
  const admins = DB.tous(`SELECT u.*, c.nom AS createur,
      (SELECT COUNT(*) FROM users x WHERE x.decide_par = u.id) AS decisions
    FROM users u LEFT JOIN users c ON c.id = u.cree_par
    WHERE u.role IN ('admin_employeurs', 'admin_demandeurs') ORDER BY u.role, u.nom`);

  // Le mot de passe temporaire n'est montré qu'une fois, puis oublié.
  const mdp = mdpTemporaire;
  mdpTemporaire = null;
  const bandeauMdp = mdp ? `
    <div class="bandeau bandeau-mdp">
      🔑 <b>Mot de passe temporaire de ${e(mdp.nom)} :</b> <code class="mdp">${e(mdp.mdp)}</code>
      <br>Note-le et transmets-le à la personne de façon sûre (en main propre ou par téléphone). Il ne sera plus affiché.
      À sa première connexion, elle devra choisir son propre mot de passe.
    </div>` : "";

  const lignes = admins.map((a) => `
    <tr>
      <td><b>${e(a.nom)}</b><br><small>${e(a.email)}</small></td>
      <td>${e(TYPES_ADMIN[a.role])}</td>
      <td>${a.statut_compte === "suspendu" ? '<span class="statut statut-compte-suspendu">Désactivé</span>' : '<span class="statut statut-compte-valide">Actif</span>'}
        ${a.doit_changer_mdp ? '<br><small>🔑 mot de passe temporaire</small>' : ""}</td>
      <td>${a.decisions}</td>
      <td><small>${e(a.createur || "—")}<br>${depuis(a.cree_le)}</small></td>
      <td><div class="actions-admin">
        ${a.statut_compte === "suspendu"
          ? `<button class="btn btn-petit" data-gerer-admin="reactiver" data-id="${a.id}">Réactiver</button>`
          : `<button class="btn btn-petit btn-rouge" data-gerer-admin="desactiver" data-id="${a.id}">Désactiver</button>`}
        <button class="btn btn-petit btn-blanc" data-gerer-admin="reinitialiser" data-id="${a.id}">Nouveau mot de passe</button>
      </div></td>
    </tr>`).join("");

  return `
    ${enTeteEspace(moi, "Super admin 👑", `<span class="sous">Connecté : ${e(moi.nom)}</span>`)}
    ${bandeauMdp}
    <p>Tu crées et gères les comptes des administrateurs. Chaque administrateur traite ensuite les dossiers de sa catégorie.</p>

    <section class="stats">
      <div class="stat"><b>${n("SELECT COUNT(*) AS n FROM users WHERE role = 'employeur' AND statut_compte = 'en_attente'")}</b><span>employeurs en attente</span></div>
      <div class="stat"><b>${n("SELECT COUNT(*) AS n FROM users WHERE role = 'demandeur' AND statut_compte = 'en_attente'")}</b><span>demandeurs en attente</span></div>
      <div class="stat"><b>${n("SELECT COUNT(*) AS n FROM users WHERE role IN ('admin_employeurs', 'admin_demandeurs') AND statut_compte = 'actif'")}</b><span>administrateurs actifs</span></div>
    </section>

    <h2 class="section">Les administrateurs</h2>
    <div class="carte table-scroll">
      ${admins.length ? `<table><tr><th>Administrateur</th><th>Type</th><th>État</th><th>Décisions</th><th>Créé par</th><th></th></tr>${lignes}</table>`
        : '<p class="vide">Aucun administrateur pour le moment.</p>'}
    </div>

    <h2 class="section">Créer un administrateur</h2>
    <form class="carte" data-form="creer-admin">
      ${noteObl()}
      <div class="deux-col">
        <div><label for="nom">Nom complet${OBL}</label><input id="nom" name="nom" required maxlength="100"></div>
        <div><label for="email">E-mail${OBL}</label><input id="email" name="email" type="email" required></div>
      </div>
      <label for="type">Type d'administrateur${OBL}</label>
      <select id="type" name="type" required>
        <option value="">Choisir…</option>
        ${Object.entries(TYPES_ADMIN).map(([k, v]) => `<option value="${k}">${e(v)}</option>`).join("")}
      </select>
      <p class="sous">Un mot de passe temporaire sera créé automatiquement et affiché une seule fois.</p>
      <button class="btn btn-rouge">Créer l'administrateur</button>
    </form>`;
}

// Formulaire de dossier pour un compte pas encore validé (en attente, refusé ou suspendu).
function formulaireDossier(moi, contenu) {
  const modifiable = moi.statut_compte === "en_attente" || moi.statut_compte === "refuse";
  return `
    <h2 class="section">${t("Mon dossier de vérification")}</h2>
    <form class="carte" data-form="dossier">
      <fieldset ${modifiable ? "" : "disabled"} class="bloc-role">
        ${blocCriteres(moi.role)}
        ${noteObl()}
        <div class="deux-col">
          <div><label for="ville">${t("Ville")}${OBL}</label><select id="ville" name="ville" required>${options(VILLES, moi.ville)}</select></div>
          <div><label for="telephone">${t("Téléphone")}${OBL}</label><input id="telephone" name="telephone" value="${e(moi.telephone)}" placeholder="+243…" required></div>
        </div>
        ${contenu}
        ${modifiable ? `<button class="btn btn-rouge" style="margin-top:16px">${moi.statut_compte === "refuse" ? t("Renvoyer mon dossier") : t("Mettre à jour mon dossier")}</button>` : ""}
      </fieldset>
    </form>`;
}

function ficheEmployeur(ent) {
  return fiche([
    ["N° RCCM", ent.rccm], ["N° Id. Nat.", ent.id_nat], ["N° Impôt (NIF)", ent.nif],
    ["Adresse du siège", ent.adresse], ["Responsable", [ent.responsable, ent.fonction_responsable].filter(Boolean).join(", ")],
  ]);
}

function ficheDemandeur(p) {
  const ans = age(p.date_naissance);
  return fiche([
    ["Date de naissance", `${dateFr(p.date_naissance)}${ans !== null ? ` (${t("{n} ans", { n: ans })})` : ""}`],
    ["Pièce d'identité", [p.type_piece && t(p.type_piece), p.numero_piece].filter(Boolean).join(" n° ")],
    ["Adresse", p.adresse], ["Niveau d'études", p.niveau_etudes && t(p.niveau_etudes)],
    ["Métier recherché", p.titre], ["Compétences", p.competences],
  ]);
}

function fiche(lignes) {
  return `<dl class="fiche">${lignes.map(([k, v]) => `<dt>${e(t(k))}</dt><dd>${e(v || "—")}</dd>`).join("")}</dl>`;
}

// ---------- Espaces personnels ----------

function espaceDemandeur(moi) {
  const p = DB.un("SELECT * FROM profils WHERE user_id = ?", [moi.id]) || {};
  const titre = e(t("Bonjour {nom} 👋", { nom: moi.nom.split(" ")[0] }));

  if (moi.statut_compte !== "valide") {
    return enTeteEspace(moi, titre) + formulaireDossier(moi, `
      ${champsDemandeur(p)}
      <label for="bio">${t("À propos de moi (facultatif)")}</label>
      <textarea id="bio" name="bio" placeholder="${e(t("Qui es-tu ? Qu'est-ce qui te motive ?"))}">${e(p.bio)}</textarea>
      <label for="experience">${t("Expérience (facultatif)")}</label>
      <textarea id="experience" name="experience" placeholder="${e(t("Tes emplois, stages, projets…"))}">${e(p.experience)}</textarea>`);
  }

  const cands = DB.tous(`SELECT c.*, o.titre, o.ville, u.nom AS entreprise FROM candidatures c
    JOIN offres o ON o.id = c.offre_id JOIN users u ON u.id = o.employeur_id
    WHERE c.demandeur_id = ? ORDER BY c.cree_le DESC`, [moi.id]);
  return `
    ${enTeteEspace(moi, titre, `<a class="btn" href="#/talent/${moi.id}">${t("Voir mon profil public")}</a>`)}

    <h2 class="section">${t("Mes candidatures")}</h2>
    <div class="carte table-scroll">
      ${cands.length ? `<table><tr><th>${t("Offre")}</th><th>${t("Entreprise")}</th><th>${t("Envoyée le")}</th><th>${t("Statut")}</th></tr>
        ${cands.map((c) => `<tr><td><a href="#/offre/${c.offre_id}">${e(c.titre)}</a></td><td>${e(c.entreprise)}</td><td>${depuis(c.cree_le)}</td><td><span class="statut statut-${e(c.statut)}">${e(t(STATUTS[c.statut]))}</span></td></tr>`).join("")}
      </table>` : `<p class="vide">${t("Tu n'as pas encore postulé.")} <a href="#/offres">${t("Découvre les offres")}</a> !</p>`}
    </div>

    <h2 class="section">${t("Mon profil")}</h2>
    <form class="carte" data-form="profil">
      <div class="deux-col">
        <div><label for="titre">${t("Mon métier")}</label><input id="titre" name="titre" value="${e(p.titre)}" placeholder="Ex : Comptable"></div>
        <div><label for="ville">${t("Ville")}</label><select id="ville" name="ville">${options(VILLES, moi.ville)}</select></div>
        <div><label for="telephone">${t("Téléphone")}</label><input id="telephone" name="telephone" value="${e(moi.telephone)}"></div>
        <div><label for="niveau_etudes">${t("Niveau d'études")}</label><select id="niveau_etudes" name="niveau_etudes">${options(NIVEAUX, p.niveau_etudes)}</select></div>
      </div>
      <label for="bio">${t("À propos de moi")}</label>
      <textarea id="bio" name="bio" placeholder="${e(t("Qui es-tu ? Qu'est-ce qui te motive ?"))}">${e(p.bio)}</textarea>
      <label for="competences">${t("Compétences (séparées par des virgules)")}</label>
      <input id="competences" name="competences" value="${e(p.competences)}" placeholder="Ex : Excel, Anglais, Vente">
      <label for="experience">${t("Expérience")}</label>
      <textarea id="experience" name="experience" placeholder="${e(t("Tes emplois, stages, projets…"))}">${e(p.experience)}</textarea>
      <label class="coche"><input type="checkbox" name="disponible" ${p.disponible !== 0 ? "checked" : ""}> ${t("Je suis disponible pour un emploi")}</label>
      <button class="btn btn-rouge" style="margin-top:16px">${t("Enregistrer mon profil")}</button>
    </form>

    <h2 class="section">${t("Dossier vérifié ✔")}</h2>
    <div class="carte">
      ${ficheDemandeur(p)}
      <p class="sous">${t("Ton identité est vérifiée. Pour la modifier, contacte l'administrateur des demandeurs : elle sera vérifiée à nouveau.")}</p>
    </div>`;
}

function espaceEmployeur(moi) {
  const ent = DB.un("SELECT * FROM entreprises WHERE user_id = ?", [moi.id]) || {};
  const titre = `${e(moi.nom)} 🏢`;

  if (moi.statut_compte !== "valide") {
    return enTeteEspace(moi, titre) + formulaireDossier(moi, `
      ${champsEmployeur(ent)}
      <label for="description">${t("Présentation de l'entreprise")}</label>
      <textarea id="description" name="description" placeholder="${e(t("Que fait ton entreprise ?"))}">${e(ent.description)}</textarea>
      <label for="site">${t("Site web (facultatif)")}</label>
      <input id="site" name="site" value="${e(ent.site)}" placeholder="https://…">`);
  }

  const offres = DB.tous(`SELECT o.*, (SELECT COUNT(*) FROM candidatures c WHERE c.offre_id = o.id) AS nb
    FROM offres o WHERE o.employeur_id = ? ORDER BY o.cree_le DESC, o.id DESC`, [moi.id]);
  return `
    ${enTeteEspace(moi, titre, `<a class="btn btn-rouge" href="#/espace/nouvelle-offre">${t("+ Publier une offre")}</a>`)}

    <h2 class="section">${t("Mes offres")}</h2>
    <div class="carte table-scroll">
      ${offres.length ? `<table><tr><th>${t("Offre")}</th><th>${t("Ville")}</th><th>${t("Candidats")}</th><th>${t("État")}</th><th></th></tr>
        ${offres.map((o) => `<tr>
          <td><a href="#/offre/${o.id}">${e(o.titre)}</a><br><small>${e(t(o.type_contrat))} · ${depuis(o.cree_le)}</small></td>
          <td>${e(o.ville)}</td>
          <td><a href="#/espace/candidats/${o.id}">${t("{n} candidat(s)", { n: `<b>${o.nb}</b>` })}</a></td>
          <td>${o.active ? `<span class="statut statut-retenue">${t("En ligne")}</span>` : `<span class="statut statut-envoyee">${t("Fermée")}</span>`}</td>
          <td><button class="btn btn-petit btn-blanc" data-basculer="${o.id}">${o.active ? t("Fermer") : t("Rouvrir")}</button></td>
        </tr>`).join("")}
      </table>` : `<p class="vide">${t("Aucune offre publiée. Lance-toi !")}</p>`}
    </div>

    <h2 class="section">${t("Mon entreprise")}</h2>
    <form class="carte" data-form="entreprise">
      <div class="deux-col">
        <div><label for="ville">${t("Ville")}</label><select id="ville" name="ville">${options(VILLES, moi.ville)}</select></div>
        <div><label for="telephone">${t("Téléphone")}</label><input id="telephone" name="telephone" value="${e(moi.telephone)}"></div>
      </div>
      <label for="site">${t("Site web")}</label>
      <input id="site" name="site" value="${e(ent.site)}" placeholder="https://…">
      <label for="description">${t("Présentation")}</label>
      <textarea id="description" name="description" placeholder="${e(t("Que fait ton entreprise ?"))}">${e(ent.description)}</textarea>
      <button class="btn btn-rouge" style="margin-top:16px">${t("Enregistrer")}</button>
    </form>

    <h2 class="section">${t("Dossier vérifié ✔")}</h2>
    <div class="carte">
      <p><b>${t("Secteur :")}</b> ${e(ent.secteur ? t(ent.secteur) : "—")}</p>
      ${ficheEmployeur(ent)}
      <p class="sous">${t("Pour modifier ces informations, contacte l'administrateur des employeurs : elles seront vérifiées à nouveau.")}</p>
    </div>`;
}

// ---------- Espace administrateur ----------

// Contrôles automatiques : ils aident l'administrateur à repérer les erreurs et les doublons.
function controlesAuto(u) {
  const autres = DB.tous("SELECT telephone FROM users WHERE id != ? AND role IN ('employeur', 'demandeur')", [u.id]);
  const telDouble = autres.some((a) => chiffres(a.telephone) && chiffres(a.telephone) === chiffres(u.telephone));
  const controles = [
    { ok: chiffres(u.telephone).length >= 9, texte: "Téléphone : au moins 9 chiffres" },
    { ok: !telDouble, texte: telDouble ? "Téléphone déjà utilisé par un autre compte" : "Téléphone utilisé par aucun autre compte" },
  ];
  if (u.role === "employeur") {
    const rccmDouble = DB.tous("SELECT rccm FROM entreprises WHERE user_id != ?", [u.id]).some((a) => normaliser(a.rccm) === normaliser(u.rccm));
    controles.unshift(
      { ok: /RCCM/i.test(u.rccm || ""), texte: "N° RCCM au bon format (contient « RCCM »)" },
      { ok: !rccmDouble, texte: rccmDouble ? "N° RCCM déjà utilisé par une autre entreprise" : "N° RCCM utilisé par aucune autre entreprise" },
    );
  } else {
    const ans = age(u.date_naissance);
    const pieceDouble = DB.tous("SELECT type_piece, numero_piece FROM profils WHERE user_id != ?", [u.id])
      .some((a) => a.type_piece === u.type_piece && normaliser(a.numero_piece) === normaliser(u.numero_piece));
    controles.unshift(
      { ok: ans !== null && ans >= AGE_MINIMUM, texte: ans === null ? "Date de naissance invalide" : `Âge : ${ans} ans (minimum ${AGE_MINIMUM})` },
      { ok: !pieceDouble, texte: pieceDouble ? "Pièce d'identité déjà utilisée par un autre compte !" : "Pièce d'identité utilisée par aucun autre compte" },
      { ok: !!String(u.titre || "").trim() && !!tags(u.competences), texte: "Métier et compétences renseignés" },
    );
  }
  return controles;
}

function espaceAdmin(moi, params) {
  const conf = ADMINS[moi.role];
  const filtre = Object.hasOwn(STATUTS_COMPTE, params.get("filtre")) ? params.get("filtre") : "en_attente";
  const compte = (s) => DB.un("SELECT COUNT(*) AS n FROM users WHERE role = ? AND statut_compte = ?", [conf.cible, s]).n;
  const jointure = conf.cible === "employeur" ? "JOIN entreprises x ON x.user_id = u.id" : "JOIN profils x ON x.user_id = u.id";
  const liste = DB.tous(`SELECT x.*, u.*, d.nom AS decideur FROM users u ${jointure}
    LEFT JOIN users d ON d.id = u.decide_par
    WHERE u.role = ? AND u.statut_compte = ? ORDER BY u.dossier_envoye_le ASC, u.id ASC`, [conf.cible, filtre]);

  const onglets = Object.entries(STATUTS_COMPTE).map(([s, nom]) =>
    `<a class="onglet ${s === filtre ? "actif" : ""}" href="#/espace?filtre=${s}">${e(nom)} <b>${compte(s)}</b></a>`).join("");

  const carte = (u) => {
    const controles = controlesAuto(u);
    const alertes = controles.filter((c) => !c.ok).length;
    let actions = "";
    if (u.statut_compte === "en_attente") {
      actions = `
        <form data-form="decision" data-compte="${u.id}">
          <p><b>Contrôle des critères</b> (tous doivent être cochés pour valider) :</p>
          ${conf.criteres.map((c) => `<label class="coche"><input type="checkbox" name="critere_${c.cle}"> ${e(c.texte)}</label>`).join("")}
          <label for="motif-${u.id}">Motif (obligatoire pour refuser)</label>
          <textarea id="motif-${u.id}" name="motif" maxlength="500" placeholder="Ex : le n° de la pièce d'identité est illisible ou incorrect."></textarea>
          <div class="actions">
            <button class="btn" name="decision" value="valider">✔ Valider</button>
            <button class="btn btn-rouge" name="decision" value="refuser">✖ Refuser</button>
          </div>
        </form>`;
    } else if (u.statut_compte === "valide") {
      actions = `
        <form data-form="decision" data-compte="${u.id}">
          <label for="motif-${u.id}">Motif de suspension</label>
          <textarea id="motif-${u.id}" name="motif" maxlength="500" placeholder="Ex : informations fausses signalées."></textarea>
          <div class="actions"><button class="btn btn-rouge" name="decision" value="suspendre">⛔ Suspendre</button></div>
        </form>`;
    } else if (u.statut_compte === "suspendu") {
      actions = `
        <form data-form="decision" data-compte="${u.id}">
          <div class="actions"><button class="btn" name="decision" value="reactiver">↩ Réactiver</button></div>
        </form>`;
    }
    const sousTitre = conf.cible === "employeur" ? (u.secteur || "Secteur ?") : (u.titre || "Métier ?");
    return `
      <div class="carte dossier">
        <div class="ligne" style="justify-content:space-between;flex-wrap:wrap">
          <div>
            <h3>${e(u.nom)}</h3>
            <p class="sous" style="margin:0">${e(sousTitre)} · ${e(u.ville)} · dossier envoyé ${u.dossier_envoye_le ? depuis(u.dossier_envoye_le) : "—"}</p>
          </div>
          <span class="statut statut-compte-${e(u.statut_compte)}">${e(STATUTS_COMPTE[u.statut_compte])}</span>
        </div>
        ${conf.cible === "employeur" ? ficheEmployeur(u) : ficheDemandeur(u)}
        ${fiche([["Contact", `📧 ${u.email} · 📞 ${u.telephone || "—"}`]].concat(
          conf.cible === "employeur" && u.description ? [["Présentation", u.description]] : [],
          u.decide_le ? [["Dernière décision", `${depuis(u.decide_le)} par ${u.decideur || "?"}${u.motif ? ` — « ${u.motif} »` : ""}`]] : [],
        ))}
        <div class="controles ${alertes ? "controles-alerte" : ""}">
          <b>🤖 Contrôles automatiques ${alertes ? `· ${alertes} alerte(s)` : "· tout est correct"}</b>
          <ul>${controles.map((c) => `<li>${c.ok ? "✅" : "⚠️"} ${e(c.texte)}</li>`).join("")}</ul>
        </div>
        ${actions}
      </div>`;
  };

  return `
    ${enTeteEspace(moi, `${e(conf.titre)} 🛡️`, `<span class="sous">Connecté : ${e(moi.nom)}</span>`)}
    <p>Vérifie chaque dossier de ${e(conf.pluriel)} avant validation. Les contrôles automatiques t'aident à repérer les erreurs et les doublons, mais c'est toi qui décides.</p>
    <nav class="onglets">${onglets}</nav>
    <div class="liste-dossiers">${liste.map(carte).join("") || `<p class="vide">Aucun dossier « ${e(STATUTS_COMPTE[filtre].toLowerCase())} ».</p>`}</div>`;
}

// ---------- Formulaires ----------

const formulaires = {
  recherche(form) {
    const d = donneesForm(form);
    aller("#/offres?" + new URLSearchParams(d).toString());
  },

  filtres(form) {
    aller("#/offres?" + new URLSearchParams(donneesForm(form)).toString());
  },

  "filtres-talents"(form) {
    aller("#/talents?" + new URLSearchParams(donneesForm(form)).toString());
  },

  async connexion(form) {
    const d = donneesForm(form);
    const u = DB.un("SELECT * FROM users WHERE lower(email) = lower(?)", [String(d.email || "").trim()]);
    if (!u || !await verifierMotDePasse(String(d.mdp || ""), u.mot_de_passe)) {
      toast("E-mail ou mot de passe incorrect.");
      return;
    }
    if (estAdmin(u) && u.statut_compte === "suspendu") {
      toast("Ce compte administrateur a été désactivé par le super admin.");
      return;
    }
    // Un compte créé avant la mise à jour passe au nouveau format, plus sûr.
    if (ancienFormat(u.mot_de_passe)) {
      DB.executer("UPDATE users SET mot_de_passe = ? WHERE id = ?", [await hacherMotDePasse(d.mdp), u.id]);
    }
    connecter(u.id);
    toast(`Bienvenue ${u.role === "demandeur" ? u.nom.split(" ")[0] : u.nom} !`);
    // Mot de passe temporaire : il faut d'abord en choisir un nouveau.
    if (u.doit_changer_mdp) return aller("#/mot-de-passe");
    const retour = form.dataset.retour;
    aller(retour && retour.startsWith("#/") ? retour : "#/espace");
  },

  async "otp-email"(form) {
    const d = donneesForm(form);
    const email = String(d.email || "").trim().toLowerCase();
    // Un humain ne voit pas le champ piège : s'il est rempli, c'est un robot.
    if (d.site_web) return toast("Envoi impossible.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return toast("Cette adresse e-mail n'est pas valide.");
    if (DB.un("SELECT id FROM users WHERE lower(email) = ?", [email])) return toast("Cet e-mail a déjà un compte. Connecte-toi !");
    try {
      await OTP.envoyer(email);
    } catch (err) {
      return toast(err.message);
    }
    toast("Code envoyé 📩");
    afficher();
    document.getElementById("otp-code")?.focus();
  },

  async "otp-code"(form) {
    const erreur = await OTP.verifier(donneesForm(form).code);
    if (erreur) {
      toast(erreur);
      // Code expiré ou trop d'essais : on revient à l'étape 1.
      if (!OTP.enCours) afficher();
      return;
    }
    toast("E-mail vérifié ✅ Continue ton inscription.");
    afficher();
  },

  async inscription(form) {
    const d = donneesForm(form);
    const nom = String(d.nom || "").trim();
    const email = String(d.email || "").trim();
    const mdp = String(d.mdp || "");
    // L'adresse doit être celle qui a été vérifiée par code (même si la page a été modifiée).
    if (!OTP.estVerifie(email)) {
      OTP.reinitialiser();
      toast("Vérifie d'abord ton adresse e-mail avec le code.");
      return afficher();
    }
    // Les règles sont vérifiées ici aussi : le formulaire seul peut être contourné.
    // On ne peut pas s'inscrire comme administrateur.
    if (!["demandeur", "employeur"].includes(d.role)) return toast("Choisis demandeur ou employeur.");
    if (!nom || nom.length > 100) return toast("Indique un nom (100 caractères maximum).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("Cet e-mail n'est pas valide.");
    if (mdp.length < 8) return toast("Le mot de passe doit faire au moins 8 caractères.");
    const erreur = erreurDossier(d.role, d);
    if (erreur) return toast(erreur);
    if (DB.un("SELECT id FROM users WHERE lower(email) = lower(?)", [email])) {
      toast("Cet e-mail a déjà un compte. Connecte-toi !");
      return;
    }
    // Tout nouveau compte commence « en attente » : seul un administrateur peut le valider.
    const id = DB.executer("INSERT INTO users (role, nom, email, mot_de_passe, ville, telephone, statut_compte) VALUES (?, ?, ?, ?, ?, ?, 'en_attente')",
      [d.role, nom, email, await hacherMotDePasse(mdp), d.ville || "", String(d.telephone || "").trim()]);
    DB.executer(d.role === "employeur" ? "INSERT INTO entreprises (user_id) VALUES (?)" : "INSERT INTO profils (user_id) VALUES (?)", [id]);
    enregistrerDossier(d.role, id, d);
    connecter(id);
    OTP.reinitialiser();
    toast("Dossier envoyé ! Un administrateur va le vérifier 🔎");
    aller("#/espace");
  },

  dossier(form) {
    const moi = utilisateur();
    if (!moi || (moi.role !== "employeur" && moi.role !== "demandeur")) return aller("#/connexion");
    if (moi.statut_compte !== "en_attente" && moi.statut_compte !== "refuse") return toast("Ton dossier ne peut plus être modifié.");
    const d = donneesForm(form);
    const erreur = erreurDossier(moi.role, d);
    if (erreur) return toast(erreur);
    DB.executer("UPDATE users SET ville = ?, telephone = ? WHERE id = ?", [d.ville || "", String(d.telephone).trim(), moi.id]);
    if (moi.role === "employeur") {
      DB.executer("UPDATE entreprises SET description = ?, site = ? WHERE user_id = ?", [d.description || "", d.site || "", moi.id]);
    } else {
      DB.executer("UPDATE profils SET bio = ?, experience = ? WHERE user_id = ?", [d.bio || "", d.experience || "", moi.id]);
    }
    enregistrerDossier(moi.role, moi.id, d);
    toast("Dossier envoyé à l'administrateur 🔎");
    afficher();
  },

  async "mot-de-passe"(form) {
    const moi = utilisateur();
    if (!moi) return aller("#/connexion");
    const d = donneesForm(form);
    const minimum = estAdmin(moi) || estSuperAdmin(moi) ? 10 : 8;
    const nouveau = String(d.nouveau || "");
    if (!await verifierMotDePasse(String(d.actuel || ""), moi.mot_de_passe)) return toast("Le mot de passe actuel est incorrect.");
    if (nouveau.length < minimum) return toast(`Le nouveau mot de passe doit faire au moins ${minimum} caractères.`);
    if (nouveau !== d.confirmation) return toast("Les deux nouveaux mots de passe ne sont pas identiques.");
    if (nouveau === d.actuel) return toast("Choisis un mot de passe différent de l'actuel.");
    DB.executer("UPDATE users SET mot_de_passe = ?, doit_changer_mdp = 0 WHERE id = ?", [await hacherMotDePasse(nouveau), moi.id]);
    toast("Mot de passe changé ✅");
    aller("#/espace");
  },

  async "creer-admin"(form) {
    const chef = utilisateur();
    if (!estSuperAdmin(chef)) {
      toast("Réservé au super admin.");
      return aller("#/connexion");
    }
    const d = donneesForm(form);
    const nom = String(d.nom || "").trim();
    const email = String(d.email || "").trim();
    // Le super admin ne peut créer que les deux types d'administrateurs (jamais un autre super admin).
    if (!Object.hasOwn(TYPES_ADMIN, d.type)) return toast("Choisis le type d'administrateur.");
    if (!nom || nom.length > 100) return toast("Indique le nom de l'administrateur.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("Cet e-mail n'est pas valide.");
    if (DB.un("SELECT id FROM users WHERE lower(email) = lower(?)", [email])) return toast("Cet e-mail est déjà utilisé.");
    const mdp = genererMotDePasse();
    DB.executer(`INSERT INTO users (role, nom, email, mot_de_passe, ville, statut_compte, cree_par, doit_changer_mdp)
      VALUES (?, ?, ?, ?, 'Kinshasa', 'actif', ?, 1)`, [d.type, nom, email, await hacherMotDePasse(mdp), chef.id]);
    mdpTemporaire = { nom, mdp };
    toast(`${TYPES_ADMIN[d.type]} créé : ${nom}`);
    afficher();
  },

  decision(form, bouton) {
    const admin = utilisateur();
    if (!estAdmin(admin)) {
      toast("Réservé aux administrateurs.");
      return aller("#/connexion");
    }
    const conf = ADMINS[admin.role];
    // Chaque administrateur ne peut décider que pour sa catégorie de comptes.
    const cible = DB.un("SELECT * FROM users WHERE id = ? AND role = ?", [Number(form.dataset.compte), conf.cible]);
    if (!cible) return toast("Ce dossier ne fait pas partie de ton périmètre.");
    const decision = bouton && bouton.value;
    const d = donneesForm(form);
    const motif = String(d.motif || "").trim().slice(0, 500);

    // Chaque décision n'est possible qu'à partir de certains statuts.
    const regles = {
      valider: { depuis: ["en_attente"], vers: "valide" },
      refuser: { depuis: ["en_attente"], vers: "refuse" },
      suspendre: { depuis: ["valide"], vers: "suspendu" },
      reactiver: { depuis: ["suspendu"], vers: "valide" },
    };
    const regle = regles[decision];
    if (!regle || !regle.depuis.includes(cible.statut_compte)) return toast("Action impossible pour ce compte.");
    if (decision === "valider" && !conf.criteres.every((c) => d["critere_" + c.cle])) {
      return toast("Coche tous les critères avant de valider.");
    }
    if ((decision === "refuser" || decision === "suspendre") && motif.length < 5) {
      return toast("Écris un motif pour expliquer ta décision.");
    }
    DB.executer("UPDATE users SET statut_compte = ?, motif = ?, decide_le = datetime('now'), decide_par = ? WHERE id = ?",
      [regle.vers, motif || null, admin.id, cible.id]);
    const messages = { valider: "Dossier validé ✅", refuser: "Dossier refusé", suspendre: "Compte suspendu", reactiver: "Compte réactivé ✅" };
    toast(`${messages[decision]} : ${cible.nom}`);
    afficher();
  },

  postuler(form) {
    const moi = exigerValide("demandeur");
    if (!moi) return;
    const offre = DB.un(`SELECT o.id FROM offres o JOIN users u ON u.id = o.employeur_id
      WHERE o.id = ? AND o.active = 1 AND u.statut_compte = 'valide'`, [Number(form.dataset.offre)]);
    if (!offre) return toast("Cette offre n'est plus disponible.");
    DB.executer("INSERT OR IGNORE INTO candidatures (offre_id, demandeur_id, message) VALUES (?, ?, ?)",
      [offre.id, moi.id, donneesForm(form).message]);
    toast("Candidature envoyée ! Bonne chance 🍀");
    afficher();
  },

  profil(form) {
    const moi = exigerValide("demandeur");
    if (!moi) return;
    const d = donneesForm(form);
    if (!NIVEAUX.includes(d.niveau_etudes)) return toast("Choisis ton niveau d'études.");
    const erreur = erreurTelephone(d.telephone);
    if (erreur) return toast(erreur);
    DB.executer("UPDATE users SET ville = ?, telephone = ? WHERE id = ?", [d.ville, String(d.telephone).trim(), moi.id]);
    DB.executer(`UPDATE profils SET titre = ?, bio = ?, competences = ?, experience = ?, niveau_etudes = ?, disponible = ? WHERE user_id = ?`,
      [d.titre || "", d.bio || "", d.competences || "", d.experience || "", d.niveau_etudes, d.disponible ? 1 : 0, moi.id]);
    toast("Profil enregistré ✅");
  },

  entreprise(form) {
    const moi = exigerValide("employeur");
    if (!moi) return;
    const d = donneesForm(form);
    const erreur = erreurTelephone(d.telephone);
    if (erreur) return toast(erreur);
    DB.executer("UPDATE users SET ville = ?, telephone = ? WHERE id = ?", [d.ville, String(d.telephone).trim(), moi.id]);
    DB.executer("UPDATE entreprises SET description = ?, site = ? WHERE user_id = ?", [d.description || "", d.site || "", moi.id]);
    toast("Entreprise enregistrée ✅");
  },

  offre(form) {
    const moi = exigerValide("employeur");
    if (!moi) return;
    const d = donneesForm(form);
    const titre = String(d.titre || "").trim();
    const description = String(d.description || "").trim();
    if (!titre || !description) return toast("Le titre et la description sont obligatoires.");
    const id = DB.executer(`INSERT INTO offres (employeur_id, titre, secteur, ville, type_contrat, salaire, description, competences)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [moi.id, titre, d.secteur || "", d.ville || "", d.type_contrat || "", d.salaire || "", description, d.competences || ""]);
    toast("Offre publiée 🚀");
    aller("#/offre/" + id);
  },
};

document.addEventListener("submit", (ev) => {
  const nom = ev.target.dataset.form;
  if (nom && formulaires[nom]) {
    ev.preventDefault();
    prolongerSession();
    Promise.resolve()
      .then(() => formulaires[nom](ev.target, ev.submitter))
      .catch((err) => {
        console.error(err);
        toast(err.message && err.message.startsWith("Musala") ? err.message : "Oups, une erreur est survenue.");
      });
  }
});

// Le super admin désactive, réactive ou donne un nouveau mot de passe à un administrateur.
async function gererAdmin(action, id) {
  const chef = utilisateur();
  if (!estSuperAdmin(chef)) {
    toast("Réservé au super admin.");
    return aller("#/connexion");
  }
  const admin = DB.un("SELECT * FROM users WHERE id = ? AND role IN ('admin_employeurs', 'admin_demandeurs')", [Number(id)]);
  if (!admin) return toast("Administrateur introuvable.");
  if (action === "desactiver") {
    DB.executer("UPDATE users SET statut_compte = 'suspendu' WHERE id = ?", [admin.id]);
    toast(`${admin.nom} est désactivé`);
  } else if (action === "reactiver") {
    DB.executer("UPDATE users SET statut_compte = 'actif' WHERE id = ?", [admin.id]);
    toast(`${admin.nom} est réactivé ✅`);
  } else if (action === "reinitialiser") {
    const mdp = genererMotDePasse();
    DB.executer("UPDATE users SET mot_de_passe = ?, doit_changer_mdp = 1 WHERE id = ?", [await hacherMotDePasse(mdp), admin.id]);
    mdpTemporaire = { nom: admin.nom, mdp };
    toast(`Nouveau mot de passe créé pour ${admin.nom}`);
  } else {
    return;
  }
  afficher();
}

document.addEventListener("click", (ev) => {
  prolongerSession();
  const gestion = ev.target.closest("[data-gerer-admin]");
  if (gestion) {
    gererAdmin(gestion.dataset.gererAdmin, gestion.dataset.id).catch((err) => {
      console.error(err);
      toast("Oups, une erreur est survenue.");
    });
    return;
  }
  const cible = ev.target.closest("[data-action], [data-basculer]");
  if (!cible) return;
  if (cible.dataset.action === "deconnexion") deconnecter();
  if (cible.dataset.action === "otp-recommencer") {
    ev.preventDefault();
    OTP.reinitialiser();
    afficher();
  }
  if (cible.dataset.action === "otp-renvoyer" && OTP.enCours) {
    OTP.envoyer(OTP.enCours.email)
      .then(() => { toast("Nouveau code envoyé 📩"); afficher(); })
      .catch((err) => toast(err.message));
  }
  if (cible.dataset.basculer) {
    const moi = exigerValide("employeur");
    if (!moi) return;
    DB.executer("UPDATE offres SET active = 1 - active WHERE id = ? AND employeur_id = ?", [Number(cible.dataset.basculer), moi.id]);
    afficher();
  }
});

document.addEventListener("change", (ev) => {
  // Inscription : affiche le dossier qui correspond au rôle choisi.
  // Le dossier caché est aussi désactivé, pour que ses champs ne soient pas envoyés.
  if (ev.target.name === "role" && ev.target.closest("[data-form=inscription]")) {
    for (const [id, role] of [["champsDemandeur", "demandeur"], ["champsEmployeur", "employeur"]]) {
      const bloc = document.getElementById(id);
      bloc.hidden = bloc.disabled = ev.target.value !== role;
    }
    return;
  }
  const id = ev.target.dataset.statut;
  if (!id) return;
  const moi = exigerValide("employeur");
  if (!moi || !Object.hasOwn(STATUTS, ev.target.value)) return;
  prolongerSession();
  DB.executer(`UPDATE candidatures SET statut = ? WHERE id = ?
    AND offre_id IN (SELECT id FROM offres WHERE employeur_id = ?)`, [ev.target.value, Number(id), moi.id]);
  toast("Statut mis à jour");
});

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

// ---------- Routeur ----------

function afficher() {
  const [chemin, recherche] = (location.hash.slice(1) || "/").split("?");
  const params = new URLSearchParams(recherche || "");
  const morceaux = chemin.split("/").filter(Boolean);
  // Tant qu'un mot de passe temporaire n'est pas changé, seule la page « mot de passe » est accessible.
  const moi = utilisateur();
  if (moi && moi.doit_changer_mdp && morceaux[0] !== "mot-de-passe") {
    aller("#/mot-de-passe");
    return;
  }
  let html;
  switch (morceaux[0]) {
    case undefined: html = pages.accueil(); break;
    case "mot-de-passe": html = pages.motDePasse(); break;
    case "offres": html = pages.offres(params); break;
    case "offre": html = pages.offre(params, morceaux[1]); break;
    case "talents": html = pages.talents(params); break;
    case "talent": html = pages.talent(params, morceaux[1]); break;
    case "connexion": html = pages.connexion(params); break;
    case "inscription": html = pages.inscription(params); break;
    case "espace":
      if (morceaux[1] === "nouvelle-offre") html = pages.nouvelleOffre();
      else if (morceaux[1] === "candidats") html = pages.candidats(params, morceaux[2]);
      else html = pages.espace(params);
      break;
    default: html = pages.introuvable();
  }
  if (html) app.innerHTML = html;
  majNav();
  document.getElementById("nav").classList.remove("open");
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", afficher);

appliquerReglages();
enregistrerHorsLigne();

DB.init()
  .then(afficher)
  .catch((err) => {
    console.error(err);
    app.innerHTML = `<div class="vide"><h1>Oups !</h1><p>Musala n'a pas pu démarrer. Recharge la page.</p></div>`;
  });
