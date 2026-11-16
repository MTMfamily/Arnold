// Musala : le réseau pro de la RDC.
// Chaque page est une fonction qui renvoie du HTML, choisie selon l'adresse (#/...).

const VILLES = ["Kinshasa", "Lubumbashi", "Goma", "Bukavu", "Kisangani", "Mbuji-Mayi", "Kananga", "Matadi", "Kolwezi", "Bunia", "Mbandaka", "Kikwit"];
const SECTEURS = ["Informatique & Tech", "Mines", "Agriculture", "Santé", "Éducation", "Commerce", "BTP", "Banque & Finance", "Télécoms", "ONG & Humanitaire", "Transport & Logistique", "Hôtellerie"];
const CONTRATS = ["CDI", "CDD", "Stage", "Freelance", "Temps partiel"];
const STATUTS = {
  envoyee: "Envoyée",
  vue: "Vue",
  entretien: "Entretien",
  retenue: "Retenue",
  refusee: "Non retenue",
};
const SESSION_KEY = "musala_session";

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

function options(liste, choisi, vide) {
  const premier = vide ? `<option value="">${e(vide)}</option>` : "";
  return premier + liste.map((v) => `<option ${v === choisi ? "selected" : ""}>${e(v)}</option>`).join("");
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
  if (jours <= 0) return "aujourd'hui";
  if (jours === 1) return "hier";
  return `il y a ${jours} jours`;
}

function toast(message) {
  const t = document.getElementById("toast");
  t.textContent = message;
  t.classList.add("visible");
  clearTimeout(toast.minuteur);
  toast.minuteur = setTimeout(() => t.classList.remove("visible"), 2600);
}

function aller(route) {
  if (location.hash === route) afficher();
  else location.hash = route;
}

function donneesForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

// ---------- Session ----------

function utilisateur() {
  let id = null;
  try { id = localStorage.getItem(SESSION_KEY); } catch (err) { /* rien */ }
  return id ? DB.un("SELECT * FROM users WHERE id = ?", [Number(id)]) : null;
}

function connecter(id) {
  try { localStorage.setItem(SESSION_KEY, String(id)); } catch (err) { /* rien */ }
}

function deconnecter() {
  try { localStorage.removeItem(SESSION_KEY); } catch (err) { /* rien */ }
  toast("À bientôt sur Musala !");
  aller("#/");
}

function majNav() {
  const moi = utilisateur();
  document.getElementById("navUser").innerHTML = moi
    ? `<a href="#/espace">Mon espace</a>
       <button class="btn btn-petit btn-blanc" data-action="deconnexion">Déconnexion</button>`
    : `<a href="#/connexion">Connexion</a>
       <a href="#/inscription" class="btn btn-petit btn-rouge">S'inscrire</a>`;
}

// ---------- Cartes réutilisables ----------

function carteOffre(o) {
  return `
    <a class="carte carte-lien" href="#/offre/${o.id}">
      <h3>${e(o.titre)}</h3>
      <p class="sous">${e(o.entreprise)} · ${e(o.ville)}</p>
      <div class="tags">
        <span class="tag tag-rouge">${e(o.type_contrat)}</span>
        <span class="tag">${e(o.secteur)}</span>
      </div>
      <small>${o.salaire ? "💰 " + e(o.salaire) + " · " : ""}${depuis(o.cree_le)}</small>
    </a>`;
}

function carteTalent(t) {
  return `
    <a class="carte carte-lien" href="#/talent/${t.id}">
      <div class="ligne">
        <div class="avatar">${initiales(t.nom)}</div>
        <div>
          <h3>${e(t.nom)}</h3>
          <p class="sous" style="margin:0">${e(t.titre || "Membre Musala")} · ${e(t.ville)}</p>
        </div>
      </div>
      <div class="tags">${tags(t.competences)}</div>
    </a>`;
}

const REQ_OFFRES = `
  SELECT o.*, u.nom AS entreprise FROM offres o
  JOIN users u ON u.id = o.employeur_id
  WHERE o.active = 1`;

const REQ_TALENTS = `
  SELECT u.id, u.nom, u.ville, p.titre, p.competences, p.bio FROM users u
  JOIN profils p ON p.user_id = u.id
  WHERE u.role = 'demandeur'`;

// ---------- Pages ----------

const pages = {
  accueil() {
    const nbOffres = DB.un("SELECT COUNT(*) AS n FROM offres WHERE active = 1").n;
    const nbTalents = DB.un("SELECT COUNT(*) AS n FROM users WHERE role = 'demandeur'").n;
    const nbEntreprises = DB.un("SELECT COUNT(*) AS n FROM users WHERE role = 'employeur'").n;
    const recentes = DB.tous(REQ_OFFRES + " ORDER BY o.cree_le DESC, o.id DESC LIMIT 3");
    return `
      <section class="hero">
        <h1>Ton talent mérite d'être vu. 🇨🇩</h1>
        <p>Musala connecte les demandeurs d'emploi et les employeurs de toute la RDC, de Kinshasa à Lubumbashi, de Goma à Matadi.</p>
        <form class="recherche" data-form="recherche">
          <input name="q" placeholder="Métier, compétence…">
          <select name="ville">${options(VILLES, "", "Toutes les villes")}</select>
          <button class="btn btn-rouge">Chercher</button>
        </form>
        <div class="hero-actions">
          <a href="#/inscription?role=demandeur" class="btn btn-blanc">Je cherche un emploi</a>
          <a href="#/inscription?role=employeur" class="btn btn-rouge">Je recrute</a>
        </div>
      </section>

      <section class="stats">
        <div class="stat"><b>${nbOffres}</b><span>offres d'emploi</span></div>
        <div class="stat"><b>${nbTalents}</b><span>talents inscrits</span></div>
        <div class="stat"><b>${nbEntreprises}</b><span>employeurs</span></div>
      </section>

      <h2 class="section">Offres récentes</h2>
      <div class="grille">${recentes.map(carteOffre).join("") || '<p class="vide">Aucune offre pour le moment.</p>'}</div>
      <p style="text-align:center;margin-top:20px"><a href="#/offres" class="btn">Voir toutes les offres</a></p>`;
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
    return `
      <div class="page-titre"><h1>Offres d'emploi</h1><span class="sous">${liste.length} résultat(s)</span></div>
      <form class="filtres" data-form="filtres">
        <input name="q" placeholder="Métier, compétence, entreprise…" value="${e(q)}">
        <select name="ville">${options(VILLES, ville, "Toutes les villes")}</select>
        <select name="secteur">${options(SECTEURS, secteur, "Tous les secteurs")}</select>
        <select name="contrat">${options(CONTRATS, contrat, "Tous les contrats")}</select>
        <button class="btn">Filtrer</button>
      </form>
      <div class="grille">${liste.map(carteOffre).join("") || '<p class="vide">Aucune offre ne correspond. Essaie d\'autres filtres !</p>'}</div>`;
  },

  offre(params, id) {
    const o = DB.un(`SELECT o.*, u.nom AS entreprise, en.description AS desc_entreprise FROM offres o
      JOIN users u ON u.id = o.employeur_id LEFT JOIN entreprises en ON en.user_id = u.id WHERE o.id = ?`, [Number(id)]);
    if (!o) return pages.introuvable();
    const moi = utilisateur();
    let action = `<a class="btn btn-rouge" href="#/connexion?retour=${encodeURIComponent("#/offre/" + o.id)}">Se connecter pour postuler</a>`;
    if (moi && moi.role === "employeur") {
      action = moi.id === o.employeur_id
        ? `<a class="btn" href="#/espace/candidats/${o.id}">Voir les candidats</a>`
        : `<p class="sous">Connecte-toi avec un compte demandeur pour postuler.</p>`;
    } else if (moi) {
      const deja = DB.un("SELECT statut FROM candidatures WHERE offre_id = ? AND demandeur_id = ?", [o.id, moi.id]);
      action = deja
        ? `<p>✅ Tu as déjà postulé. Statut : <span class="statut statut-${e(deja.statut)}">${e(STATUTS[deja.statut])}</span></p>`
        : `<form data-form="postuler" data-offre="${o.id}">
             <label for="message">Ton message à l'employeur</label>
             <textarea id="message" name="message" placeholder="Présente-toi en quelques lignes et dis pourquoi ce poste t'intéresse." required></textarea>
             <button class="btn btn-rouge" style="margin-top:12px">Postuler</button>
           </form>`;
    }
    return `
      <div class="detail carte">
        <a href="#/offres">← Toutes les offres</a>
        <h1>${e(o.titre)}</h1>
        <p class="sous">${e(o.entreprise)} · ${e(o.ville)} · publiée ${depuis(o.cree_le)}</p>
        <div class="tags">
          <span class="tag tag-rouge">${e(o.type_contrat)}</span>
          <span class="tag">${e(o.secteur)}</span>
          ${o.salaire ? `<span class="tag">💰 ${e(o.salaire)}</span>` : ""}
        </div>
        <h3>Le poste</h3>
        <p class="description">${e(o.description)}</p>
        ${o.competences ? `<h3>Compétences recherchées</h3><div class="tags">${tags(o.competences)}</div>` : ""}
        ${o.desc_entreprise ? `<h3>À propos de ${e(o.entreprise)}</h3><p>${e(o.desc_entreprise)}</p>` : ""}
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
    return `
      <div class="page-titre"><h1>Talents</h1><span class="sous">${liste.length} profil(s)</span></div>
      <form class="filtres" data-form="filtres-talents">
        <input name="q" placeholder="Nom, métier, compétence…" value="${e(q)}">
        <select name="ville">${options(VILLES, ville, "Toutes les villes")}</select>
        <button class="btn">Filtrer</button>
      </form>
      <div class="grille">${liste.map(carteTalent).join("") || '<p class="vide">Aucun talent trouvé.</p>'}</div>`;
  },

  talent(params, id) {
    const t = DB.un(`SELECT u.*, p.* FROM users u JOIN profils p ON p.user_id = u.id
      WHERE u.id = ? AND u.role = 'demandeur'`, [Number(id)]);
    if (!t) return pages.introuvable();
    const moi = utilisateur();
    const contact = moi && moi.role === "employeur"
      ? `<p>📧 <a href="mailto:${e(t.email)}">${e(t.email)}</a>${t.telephone ? ` · 📞 ${e(t.telephone)}` : ""}</p>`
      : `<p class="sous">Les coordonnées sont visibles par les employeurs connectés.</p>`;
    return `
      <div class="detail carte">
        <a href="#/talents">← Tous les talents</a>
        <div class="ligne" style="margin-top:16px">
          <div class="avatar avatar-grand">${initiales(t.nom)}</div>
          <div>
            <h1 style="margin:0">${e(t.nom)}</h1>
            <p class="sous" style="margin:0">${e(t.titre || "Membre Musala")} · ${e(t.ville)}</p>
            ${t.disponible ? '<span class="tag">🟢 Disponible</span>' : ""}
          </div>
        </div>
        ${t.bio ? `<h3>À propos</h3><p class="description">${e(t.bio)}</p>` : ""}
        ${t.competences ? `<h3>Compétences</h3><div class="tags">${tags(t.competences)}</div>` : ""}
        ${t.experience ? `<h3>Expérience</h3><p class="description">${e(t.experience)}</p>` : ""}
        ${t.niveau_etudes ? `<h3>Études</h3><p>${e(t.niveau_etudes)}</p>` : ""}
        <h3>Contact</h3>${contact}
      </div>`;
  },

  connexion(params) {
    const retour = params.get("retour") || "#/espace";
    return `
      <form class="form carte" data-form="connexion" data-retour="${e(retour)}">
        <h1>Connexion</h1>
        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" required autocomplete="email">
        <label for="mdp">Mot de passe</label>
        <input id="mdp" name="mdp" type="password" required autocomplete="current-password">
        <button class="btn">Se connecter</button>
        <p style="text-align:center">Pas encore de compte ? <a href="#/inscription">Inscris-toi</a></p>
        <div class="astuce">💡 Pour tester : <b>grace@exemple.cd</b> (demandeuse) ou <b>contact@kindigital.cd</b> (employeur), mot de passe <b>musala123</b>.</div>
      </form>`;
  },

  inscription(params) {
    const role = params.get("role") === "employeur" ? "employeur" : "demandeur";
    return `
      <form class="form carte" data-form="inscription">
        <h1>Rejoins Musala</h1>
        <label>Je suis…</label>
        <div class="choix-role">
          <label><input type="radio" name="role" value="demandeur" ${role === "demandeur" ? "checked" : ""}><span>👤 Demandeur d'emploi</span><small>Je cherche un travail</small></label>
          <label><input type="radio" name="role" value="employeur" ${role === "employeur" ? "checked" : ""}><span>🏢 Employeur</span><small>Je recrute</small></label>
        </div>
        <label for="nom">Nom complet ou nom de l'entreprise</label>
        <input id="nom" name="nom" required>
        <div class="deux-col">
          <div>
            <label for="ville">Ville</label>
            <select id="ville" name="ville">${options(VILLES, "Kinshasa")}</select>
          </div>
          <div>
            <label for="telephone">Téléphone</label>
            <input id="telephone" name="telephone" placeholder="+243…">
          </div>
        </div>
        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" required autocomplete="email">
        <label for="mdp">Mot de passe (6 caractères minimum)</label>
        <input id="mdp" name="mdp" type="password" minlength="6" required autocomplete="new-password">
        <button class="btn btn-rouge">Créer mon compte</button>
        <p style="text-align:center">Déjà inscrit ? <a href="#/connexion">Connecte-toi</a></p>
      </form>`;
  },

  espace() {
    const moi = utilisateur();
    if (!moi) { aller("#/connexion"); return ""; }
    return moi.role === "employeur" ? espaceEmployeur(moi) : espaceDemandeur(moi);
  },

  nouvelleOffre() {
    const moi = utilisateur();
    if (!moi || moi.role !== "employeur") { aller("#/connexion"); return ""; }
    return `
      <form class="form carte" data-form="offre">
        <a href="#/espace">← Mon espace</a>
        <h1>Publier une offre</h1>
        <label for="titre">Intitulé du poste</label>
        <input id="titre" name="titre" required placeholder="Ex : Développeur web junior">
        <div class="deux-col">
          <div><label for="secteur">Secteur</label><select id="secteur" name="secteur">${options(SECTEURS, "")}</select></div>
          <div><label for="ville">Ville</label><select id="ville" name="ville">${options(VILLES, moi.ville)}</select></div>
          <div><label for="type_contrat">Contrat</label><select id="type_contrat" name="type_contrat">${options(CONTRATS, "CDI")}</select></div>
          <div><label for="salaire">Salaire (facultatif)</label><input id="salaire" name="salaire" placeholder="Ex : 600 $ / mois"></div>
        </div>
        <label for="description">Description du poste</label>
        <textarea id="description" name="description" required placeholder="Missions, horaires, avantages…"></textarea>
        <label for="competences">Compétences (séparées par des virgules)</label>
        <input id="competences" name="competences" placeholder="Ex : Excel, Français, Permis B">
        <button class="btn btn-rouge">Publier l'offre</button>
      </form>`;
  },

  candidats(params, id) {
    const moi = utilisateur();
    if (!moi || moi.role !== "employeur") { aller("#/connexion"); return ""; }
    const o = DB.un("SELECT * FROM offres WHERE id = ? AND employeur_id = ?", [Number(id), moi.id]);
    if (!o) return pages.introuvable();
    const liste = DB.tous(`SELECT c.*, u.nom, u.email, u.telephone, u.ville, p.titre FROM candidatures c
      JOIN users u ON u.id = c.demandeur_id LEFT JOIN profils p ON p.user_id = u.id
      WHERE c.offre_id = ? ORDER BY c.cree_le DESC`, [o.id]);
    const lignes = liste.map((c) => `
      <tr>
        <td><a href="#/talent/${c.demandeur_id}"><b>${e(c.nom)}</b></a><br><small>${e(c.titre || "")} · ${e(c.ville)}</small><br><small>${e(c.email)}</small></td>
        <td style="white-space:pre-line">${e(c.message)}</td>
        <td><select data-statut="${c.id}">${Object.entries(STATUTS).map(([k, v]) => `<option value="${k}" ${k === c.statut ? "selected" : ""}>${v}</option>`).join("")}</select></td>
      </tr>`).join("");
    return `
      <div class="page-titre"><h1>Candidats</h1><a href="#/espace">← Mon espace</a></div>
      <p class="sous">Pour l'offre « ${e(o.titre)} » · ${liste.length} candidature(s)</p>
      <div class="carte table-scroll">
        ${liste.length ? `<table><tr><th>Candidat</th><th>Message</th><th>Statut</th></tr>${lignes}</table>` : '<p class="vide">Pas encore de candidat. Partage ton offre !</p>'}
      </div>`;
  },

  introuvable() {
    return `<div class="vide"><h1>Oups ! 🤔</h1><p>Cette page n'existe pas.</p><a class="btn" href="#/">Retour à l'accueil</a></div>`;
  },
};

function espaceDemandeur(moi) {
  const p = DB.un("SELECT * FROM profils WHERE user_id = ?", [moi.id]) || {};
  const cands = DB.tous(`SELECT c.*, o.titre, o.ville, u.nom AS entreprise FROM candidatures c
    JOIN offres o ON o.id = c.offre_id JOIN users u ON u.id = o.employeur_id
    WHERE c.demandeur_id = ? ORDER BY c.cree_le DESC`, [moi.id]);
  return `
    <div class="page-titre"><h1>Bonjour ${e(moi.nom.split(" ")[0])} 👋</h1><a class="btn" href="#/talent/${moi.id}">Voir mon profil public</a></div>

    <h2 class="section">Mes candidatures</h2>
    <div class="carte table-scroll">
      ${cands.length ? `<table><tr><th>Offre</th><th>Entreprise</th><th>Envoyée</th><th>Statut</th></tr>
        ${cands.map((c) => `<tr><td><a href="#/offre/${c.offre_id}">${e(c.titre)}</a></td><td>${e(c.entreprise)}</td><td>${depuis(c.cree_le)}</td><td><span class="statut statut-${e(c.statut)}">${e(STATUTS[c.statut])}</span></td></tr>`).join("")}
      </table>` : '<p class="vide">Tu n\'as pas encore postulé. <a href="#/offres">Découvre les offres</a> !</p>'}
    </div>

    <h2 class="section">Mon profil</h2>
    <form class="carte" data-form="profil">
      <div class="deux-col">
        <div><label for="titre">Mon métier</label><input id="titre" name="titre" value="${e(p.titre)}" placeholder="Ex : Comptable"></div>
        <div><label for="ville">Ville</label><select id="ville" name="ville">${options(VILLES, moi.ville)}</select></div>
        <div><label for="telephone">Téléphone</label><input id="telephone" name="telephone" value="${e(moi.telephone)}"></div>
        <div><label for="niveau_etudes">Études</label><input id="niveau_etudes" name="niveau_etudes" value="${e(p.niveau_etudes)}" placeholder="Ex : Licence en économie"></div>
      </div>
      <label for="bio">À propos de moi</label>
      <textarea id="bio" name="bio" placeholder="Qui es-tu ? Qu'est-ce qui te motive ?">${e(p.bio)}</textarea>
      <label for="competences">Compétences (séparées par des virgules)</label>
      <input id="competences" name="competences" value="${e(p.competences)}" placeholder="Ex : Excel, Anglais, Vente">
      <label for="experience">Expérience</label>
      <textarea id="experience" name="experience" placeholder="Tes emplois, stages, projets…">${e(p.experience)}</textarea>
      <label><input type="checkbox" name="disponible" style="width:auto" ${p.disponible !== 0 ? "checked" : ""}> Je suis disponible pour un emploi</label>
      <button class="btn btn-rouge" style="margin-top:16px">Enregistrer mon profil</button>
    </form>`;
}

function espaceEmployeur(moi) {
  const ent = DB.un("SELECT * FROM entreprises WHERE user_id = ?", [moi.id]) || {};
  const offres = DB.tous(`SELECT o.*, (SELECT COUNT(*) FROM candidatures c WHERE c.offre_id = o.id) AS nb
    FROM offres o WHERE o.employeur_id = ? ORDER BY o.cree_le DESC, o.id DESC`, [moi.id]);
  return `
    <div class="page-titre"><h1>${e(moi.nom)} 🏢</h1><a class="btn btn-rouge" href="#/espace/nouvelle-offre">+ Publier une offre</a></div>

    <h2 class="section">Mes offres</h2>
    <div class="carte table-scroll">
      ${offres.length ? `<table><tr><th>Offre</th><th>Ville</th><th>Candidats</th><th>État</th><th></th></tr>
        ${offres.map((o) => `<tr>
          <td><a href="#/offre/${o.id}">${e(o.titre)}</a><br><small>${e(o.type_contrat)} · ${depuis(o.cree_le)}</small></td>
          <td>${e(o.ville)}</td>
          <td><a href="#/espace/candidats/${o.id}"><b>${o.nb}</b> candidat(s)</a></td>
          <td>${o.active ? '<span class="statut statut-retenue">En ligne</span>' : '<span class="statut statut-envoyee">Fermée</span>'}</td>
          <td><button class="btn btn-petit btn-blanc" data-basculer="${o.id}">${o.active ? "Fermer" : "Rouvrir"}</button></td>
        </tr>`).join("")}
      </table>` : '<p class="vide">Aucune offre publiée. Lance-toi !</p>'}
    </div>

    <h2 class="section">Mon entreprise</h2>
    <form class="carte" data-form="entreprise">
      <div class="deux-col">
        <div><label for="secteur">Secteur</label><select id="secteur" name="secteur">${options(SECTEURS, ent.secteur, "Choisir…")}</select></div>
        <div><label for="ville">Ville</label><select id="ville" name="ville">${options(VILLES, moi.ville)}</select></div>
        <div><label for="telephone">Téléphone</label><input id="telephone" name="telephone" value="${e(moi.telephone)}"></div>
        <div><label for="site">Site web</label><input id="site" name="site" value="${e(ent.site)}" placeholder="https://…"></div>
      </div>
      <label for="description">Présentation</label>
      <textarea id="description" name="description" placeholder="Que fait ton entreprise ?">${e(ent.description)}</textarea>
      <button class="btn btn-rouge" style="margin-top:16px">Enregistrer</button>
    </form>`;
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
    const u = DB.un("SELECT * FROM users WHERE lower(email) = lower(?)", [d.email.trim()]);
    if (!u || u.mot_de_passe !== await hacher(d.mdp)) {
      toast("E-mail ou mot de passe incorrect.");
      return;
    }
    connecter(u.id);
    toast(`Bienvenue ${u.nom.split(" ")[0]} !`);
    const retour = form.dataset.retour;
    aller(retour && retour.startsWith("#/") ? retour : "#/espace");
  },

  async inscription(form) {
    const d = donneesForm(form);
    if (DB.un("SELECT id FROM users WHERE lower(email) = lower(?)", [d.email.trim()])) {
      toast("Cet e-mail a déjà un compte. Connecte-toi !");
      return;
    }
    const id = DB.executer("INSERT INTO users (role, nom, email, mot_de_passe, ville, telephone) VALUES (?, ?, ?, ?, ?, ?)",
      [d.role, d.nom.trim(), d.email.trim(), await hacher(d.mdp), d.ville, d.telephone]);
    if (d.role === "employeur") DB.executer("INSERT INTO entreprises (user_id) VALUES (?)", [id]);
    else DB.executer("INSERT INTO profils (user_id) VALUES (?)", [id]);
    connecter(id);
    toast("Compte créé ! Complète ton profil 🎉");
    aller("#/espace");
  },

  postuler(form) {
    const moi = utilisateur();
    if (!moi) return aller("#/connexion");
    DB.executer("INSERT OR IGNORE INTO candidatures (offre_id, demandeur_id, message) VALUES (?, ?, ?)",
      [Number(form.dataset.offre), moi.id, donneesForm(form).message]);
    toast("Candidature envoyée ! Bonne chance 🍀");
    afficher();
  },

  profil(form) {
    const moi = utilisateur();
    const d = donneesForm(form);
    DB.executer("UPDATE users SET ville = ?, telephone = ? WHERE id = ?", [d.ville, d.telephone, moi.id]);
    DB.executer(`INSERT INTO profils (user_id, titre, bio, competences, experience, niveau_etudes, disponible)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET titre = excluded.titre, bio = excluded.bio, competences = excluded.competences,
        experience = excluded.experience, niveau_etudes = excluded.niveau_etudes, disponible = excluded.disponible`,
      [moi.id, d.titre, d.bio, d.competences, d.experience, d.niveau_etudes, d.disponible ? 1 : 0]);
    toast("Profil enregistré ✅");
  },

  entreprise(form) {
    const moi = utilisateur();
    const d = donneesForm(form);
    DB.executer("UPDATE users SET ville = ?, telephone = ? WHERE id = ?", [d.ville, d.telephone, moi.id]);
    DB.executer(`INSERT INTO entreprises (user_id, secteur, description, site) VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET secteur = excluded.secteur, description = excluded.description, site = excluded.site`,
      [moi.id, d.secteur, d.description, d.site]);
    toast("Entreprise enregistrée ✅");
  },

  offre(form) {
    const moi = utilisateur();
    const d = donneesForm(form);
    const id = DB.executer(`INSERT INTO offres (employeur_id, titre, secteur, ville, type_contrat, salaire, description, competences)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [moi.id, d.titre, d.secteur, d.ville, d.type_contrat, d.salaire, d.description, d.competences]);
    toast("Offre publiée 🚀");
    aller("#/offre/" + id);
  },
};

document.addEventListener("submit", (ev) => {
  const nom = ev.target.dataset.form;
  if (nom && formulaires[nom]) {
    ev.preventDefault();
    formulaires[nom](ev.target);
  }
});

document.addEventListener("click", (ev) => {
  const cible = ev.target.closest("[data-action], [data-basculer]");
  if (!cible) return;
  if (cible.dataset.action === "deconnexion") deconnecter();
  if (cible.dataset.basculer) {
    const moi = utilisateur();
    DB.executer("UPDATE offres SET active = 1 - active WHERE id = ? AND employeur_id = ?", [Number(cible.dataset.basculer), moi.id]);
    afficher();
  }
});

document.addEventListener("change", (ev) => {
  const id = ev.target.dataset.statut;
  if (!id) return;
  const moi = utilisateur();
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
  let html;
  switch (morceaux[0]) {
    case undefined: html = pages.accueil(); break;
    case "offres": html = pages.offres(params); break;
    case "offre": html = pages.offre(params, morceaux[1]); break;
    case "talents": html = pages.talents(params); break;
    case "talent": html = pages.talent(params, morceaux[1]); break;
    case "connexion": html = pages.connexion(params); break;
    case "inscription": html = pages.inscription(params); break;
    case "espace":
      if (morceaux[1] === "nouvelle-offre") html = pages.nouvelleOffre();
      else if (morceaux[1] === "candidats") html = pages.candidats(params, morceaux[2]);
      else html = pages.espace();
      break;
    default: html = pages.introuvable();
  }
  if (html) app.innerHTML = html;
  majNav();
  document.getElementById("nav").classList.remove("open");
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", afficher);

DB.init()
  .then(afficher)
  .catch((err) => {
    console.error(err);
    app.innerHTML = `<div class="vide"><h1>Oups !</h1><p>Musala n'a pas pu démarrer. Recharge la page.</p></div>`;
  });
