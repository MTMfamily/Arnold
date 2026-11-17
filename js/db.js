// Base de données embarquée de Musala.
// On utilise SQLite (via sql.js) directement dans le navigateur,
// et on sauvegarde la base dans le stockage local (localStorage).

const DB_KEY = "musala_db_v1";

const DB = {
  sql: null,

  async init() {
    const SQL = await initSqlJs({ locateFile: (f) => "vendor/" + f });
    const sauvegarde = lireStockage(DB_KEY);
    if (sauvegarde) {
      try {
        this.sql = new SQL.Database(base64EnOctets(sauvegarde));
        return;
      } catch (e) {
        console.warn("Base illisible, on repart de zéro.", e);
      }
    }
    this.sql = new SQL.Database();
    this.creerTables();
    await this.remplirExemples();
    this.sauver();
  },

  creerTables() {
    this.sql.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL CHECK (role IN ('demandeur', 'employeur')),
        nom TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        mot_de_passe TEXT NOT NULL,
        ville TEXT,
        telephone TEXT,
        cree_le TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE profils (
        user_id INTEGER PRIMARY KEY REFERENCES users(id),
        titre TEXT,
        bio TEXT,
        competences TEXT,
        experience TEXT,
        niveau_etudes TEXT,
        disponible INTEGER DEFAULT 1
      );
      CREATE TABLE entreprises (
        user_id INTEGER PRIMARY KEY REFERENCES users(id),
        secteur TEXT,
        description TEXT,
        site TEXT
      );
      CREATE TABLE offres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeur_id INTEGER NOT NULL REFERENCES users(id),
        titre TEXT NOT NULL,
        secteur TEXT,
        ville TEXT,
        type_contrat TEXT,
        salaire TEXT,
        description TEXT,
        competences TEXT,
        active INTEGER DEFAULT 1,
        cree_le TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE candidatures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        offre_id INTEGER NOT NULL REFERENCES offres(id),
        demandeur_id INTEGER NOT NULL REFERENCES users(id),
        message TEXT,
        statut TEXT DEFAULT 'envoyee',
        cree_le TEXT DEFAULT (datetime('now')),
        UNIQUE (offre_id, demandeur_id)
      );
    `);
  },

  // Quelques exemples (fictifs) pour que la plateforme ne soit pas vide.
  async remplirExemples() {
    // Chaque compte d'exemple a son propre sel, comme un vrai compte.
    const mdps = await Promise.all(Array.from({ length: 6 }, () => hacherMotDePasse("musala123")));
    const employeurs = [
      ["Kin Digital", "contact@kindigital.cd", "Kinshasa", "Informatique & Tech", "Agence web et mobile qui aide les entreprises congolaises à passer au numérique."],
      ["Katanga Mining Services", "rh@kms.cd", "Lubumbashi", "Mines", "Services techniques et logistiques pour les sites miniers du Haut-Katanga."],
      ["Kivu Agri Coop", "jobs@kivuagri.cd", "Goma", "Agriculture", "Coopérative qui accompagne les petits producteurs de café et de légumes du Kivu."],
    ];
    for (const [nom, email, ville, secteur, desc] of employeurs) {
      this.sql.run("INSERT INTO users (role, nom, email, mot_de_passe, ville) VALUES ('employeur', ?, ?, ?, ?)", [nom, email, mdps.pop(), ville]);
      this.sql.run("INSERT INTO entreprises (user_id, secteur, description) VALUES (last_insert_rowid(), ?, ?)", [secteur, desc]);
    }

    const offres = [
      [1, "Développeur web junior", "Informatique & Tech", "Kinshasa", "CDI", "800 $ / mois", "Rejoins notre équipe pour créer des sites et applications pour nos clients.\n\nTu travailleras avec HTML, CSS, JavaScript et tu seras accompagné par un développeur senior.", "HTML, CSS, JavaScript"],
      [1, "Stagiaire community manager", "Informatique & Tech", "Kinshasa", "Stage", "200 $ / mois", "Anime les réseaux sociaux de nos clients : publications, photos, réponses aux messages.", "Réseaux sociaux, Rédaction, Canva"],
      [2, "Technicien de maintenance", "Mines", "Lubumbashi", "CDD", "1 200 $ / mois", "Entretien des engins et des équipements sur site. Travail en équipe, respect strict des règles de sécurité.", "Mécanique, Électricité, Sécurité"],
      [2, "Chauffeur poids lourd", "Transport & Logistique", "Kolwezi", "CDI", "700 $ / mois", "Transport de matériel entre Lubumbashi et Kolwezi. Permis C obligatoire.", "Permis C, Ponctualité"],
      [3, "Agronome de terrain", "Agriculture", "Goma", "CDI", "900 $ / mois", "Accompagne les producteurs de la coopérative : conseils, formations, suivi des récoltes.", "Agronomie, Swahili, Formation"],
      [3, "Comptable", "Banque & Finance", "Bukavu", "Temps partiel", "500 $ / mois", "Tenue des comptes de la coopérative et préparation des rapports mensuels.", "Comptabilité, Excel"],
    ];
    for (const o of offres) {
      this.sql.run("INSERT INTO offres (employeur_id, titre, secteur, ville, type_contrat, salaire, description, competences) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", o);
    }

    const demandeurs = [
      ["Grâce Mbuyi", "grace@exemple.cd", "Kinshasa", "Développeuse web", "Passionnée de code depuis le lycée, je crée des sites modernes et rapides.", "HTML, CSS, JavaScript, React", "Licence en informatique"],
      ["Patrick Ilunga", "patrick@exemple.cd", "Lubumbashi", "Électromécanicien", "5 ans d'expérience dans la maintenance industrielle.", "Électricité, Mécanique, Soudure", "Graduat technique"],
      ["Esther Kahindo", "esther@exemple.cd", "Goma", "Agronome", "J'aide les agriculteurs à produire plus et mieux.", "Agronomie, Swahili, Gestion de projet", "Master en agronomie"],
    ];
    for (const [nom, email, ville, titre, bio, comp, etudes] of demandeurs) {
      this.sql.run("INSERT INTO users (role, nom, email, mot_de_passe, ville) VALUES ('demandeur', ?, ?, ?, ?)", [nom, email, mdps.pop(), ville]);
      this.sql.run("INSERT INTO profils (user_id, titre, bio, competences, niveau_etudes) VALUES (last_insert_rowid(), ?, ?, ?, ?)", [titre, bio, comp, etudes]);
    }
  },

  // Lire des lignes : renvoie une liste d'objets.
  tous(requete, params = []) {
    const stmt = this.sql.prepare(requete);
    stmt.bind(params);
    const lignes = [];
    while (stmt.step()) lignes.push(stmt.getAsObject());
    stmt.free();
    return lignes;
  },

  un(requete, params = []) {
    return this.tous(requete, params)[0] || null;
  },

  // Écrire : exécute puis sauvegarde la base.
  executer(requete, params = []) {
    this.sql.run(requete, params);
    const id = this.un("SELECT last_insert_rowid() AS id").id;
    this.sauver();
    return id;
  },

  sauver() {
    ecrireStockage(DB_KEY, octetsEnBase64(this.sql.export()));
  },

  reinitialiser() {
    try { localStorage.removeItem(DB_KEY); } catch (e) { /* rien */ }
  },
};

// ---------- Mots de passe ----------
// On ne garde jamais le mot de passe lui-même, seulement une « empreinte ».
// PBKDF2 est volontairement lent, et chaque compte a son propre sel (aléatoire) :
// deux comptes avec le même mot de passe n'ont donc pas la même empreinte.

const PBKDF2_ITERATIONS = 210000;

function cryptoDisponible() {
  if (!(window.crypto && crypto.subtle)) {
    throw new Error("Musala doit être ouvert en https (ou sur localhost) pour protéger les mots de passe.");
  }
}

function enHex(octets) {
  return Array.from(new Uint8Array(octets)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function depuisHex(texte) {
  return new Uint8Array(texte.match(/../g).map((h) => parseInt(h, 16)));
}

async function pbkdf2(motDePasse, sel, iterations) {
  const cle = await crypto.subtle.importKey("raw", new TextEncoder().encode(motDePasse), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: sel, iterations }, cle, 256);
  return enHex(bits);
}

// Renvoie "pbkdf2$iterations$sel$empreinte".
async function hacherMotDePasse(motDePasse) {
  cryptoDisponible();
  const sel = crypto.getRandomValues(new Uint8Array(16));
  return ["pbkdf2", PBKDF2_ITERATIONS, enHex(sel), await pbkdf2(motDePasse, sel, PBKDF2_ITERATIONS)].join("$");
}

// Vérifie un mot de passe. Accepte aussi l'ancien format (SHA-256 simple),
// pour que les comptes déjà créés puissent se connecter et être mis à jour.
async function verifierMotDePasse(motDePasse, stocke) {
  cryptoDisponible();
  const attenduBrut = String(stocke || "");
  const morceaux = attenduBrut.split("$");
  let calcule;
  let attendu;
  if (morceaux[0] === "pbkdf2" && morceaux.length === 4) {
    calcule = await pbkdf2(motDePasse, depuisHex(morceaux[2]), Number(morceaux[1]));
    attendu = morceaux[3];
  } else {
    calcule = enHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("musala:" + motDePasse)));
    attendu = attenduBrut;
  }
  // Comparaison qui prend toujours le même temps.
  let difference = calcule.length ^ attendu.length;
  for (let i = 0; i < calcule.length; i++) difference |= calcule.charCodeAt(i) ^ attendu.charCodeAt(i);
  return difference === 0;
}

function ancienFormat(stocke) {
  return !String(stocke || "").startsWith("pbkdf2$");
}

function lireStockage(cle) {
  try { return localStorage.getItem(cle); } catch (e) { return null; }
}

function ecrireStockage(cle, valeur) {
  try { localStorage.setItem(cle, valeur); } catch (e) { console.warn("Sauvegarde impossible", e); }
}

function octetsEnBase64(octets) {
  let binaire = "";
  for (let i = 0; i < octets.length; i += 0x8000) {
    binaire += String.fromCharCode.apply(null, octets.subarray(i, i + 0x8000));
  }
  return btoa(binaire);
}

function base64EnOctets(texte) {
  const binaire = atob(texte);
  const octets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets;
}
