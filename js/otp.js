// Vérification de l'adresse e-mail par code à usage unique (OTP),
// avant de pouvoir créer un compte employeur ou demandeur.
//
// MODE "demo" : aucun e-mail n'est vraiment envoyé. Le message s'affiche dans une
//   « boîte mail de démonstration » sur la page. Parfait pour tester.
// MODE "serveur" : le code est envoyé par un vrai e-mail. Il faut pour cela un serveur
//   et un service d'envoi d'e-mails (voir envoyerVraiEmail plus bas et le README).

const OTP = {
  MODE: "demo",
  LONGUEUR: 6,
  DUREE: 10 * 60 * 1000, // le code est valable 10 minutes
  ESSAIS_MAX: 5, // après 5 codes faux, il faut en demander un nouveau
  ATTENTE_RENVOI: 60 * 1000, // 1 minute entre deux envois
  DUREE_VERIFIE: 30 * 60 * 1000, // 30 minutes pour remplir le formulaire après vérification

  // L'état reste en mémoire seulement (jamais dans le stockage du navigateur) :
  // recharger la page oblige à recommencer.
  enCours: null, // { email, sel, empreinte, expire, essais, envoyeLe }
  verifie: null, // { email, jusqua }
  boiteDemo: null, // dernier e-mail de démonstration à afficher

  async envoyer(email) {
    const maintenant = Date.now();
    if (this.enCours && this.enCours.email === email && maintenant - this.enCours.envoyeLe < this.ATTENTE_RENVOI) {
      const secondes = Math.ceil((this.ATTENTE_RENVOI - (maintenant - this.enCours.envoyeLe)) / 1000);
      throw new Error(`Attends encore ${secondes} s avant de demander un nouveau code.`);
    }
    const code = codeAleatoire(this.LONGUEUR);
    const sel = enHex(crypto.getRandomValues(new Uint8Array(16)));
    // On ne garde que l'empreinte du code, jamais le code lui-même.
    this.enCours = { email, sel, empreinte: await empreinteCode(sel, email, code), expire: maintenant + this.DUREE, essais: 0, envoyeLe: maintenant };
    this.verifie = null;
    const message = messageOtp(code);
    if (this.MODE === "demo") {
      this.boiteDemo = { a: email, ...message, code };
    } else {
      await envoyerVraiEmail(email, message);
    }
  },

  // Renvoie un message d'erreur, ou null si le code est bon.
  async verifier(code) {
    const c = this.enCours;
    if (!c) return "Demande d'abord un code.";
    if (Date.now() > c.expire) {
      this.enCours = null;
      return "Ce code a expiré. Demande un nouveau code.";
    }
    if (c.essais >= this.ESSAIS_MAX) {
      this.enCours = null;
      return "Trop d'essais. Demande un nouveau code.";
    }
    c.essais++;
    const propre = String(code || "").replace(/\s/g, "");
    if (!/^\d+$/.test(propre) || await empreinteCode(c.sel, c.email, propre) !== c.empreinte) {
      const reste = this.ESSAIS_MAX - c.essais;
      if (reste <= 0) {
        this.enCours = null;
        return "Code incorrect. Trop d'essais : demande un nouveau code.";
      }
      return `Code incorrect. Il te reste ${reste} essai(s).`;
    }
    this.verifie = { email: c.email, jusqua: Date.now() + this.DUREE_VERIFIE };
    this.enCours = null;
    this.boiteDemo = null;
    return null;
  },

  estVerifie(email) {
    return !!this.verifie && Date.now() <= this.verifie.jusqua
      && this.verifie.email.toLowerCase() === String(email || "").trim().toLowerCase();
  },

  reinitialiser() {
    this.enCours = null;
    this.verifie = null;
    this.boiteDemo = null;
  },
};

function codeAleatoire(longueur) {
  // crypto.getRandomValues : vrai hasard, impossible à deviner (contrairement à Math.random).
  return Array.from(crypto.getRandomValues(new Uint32Array(longueur)), (n) => n % 10).join("");
}

async function empreinteCode(sel, email, code) {
  return enHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${sel}:${email.toLowerCase()}:${code}`)));
}

function messageOtp(code) {
  return {
    sujet: `${code} est ton code Musala`,
    texte: `Bonjour,\n\nVoici ton code pour créer ton compte Musala : ${code}\n\nIl est valable 10 minutes. Ne le donne à personne : l'équipe Musala ne te le demandera jamais.\n\nSi tu n'as pas demandé ce code, ignore simplement cet e-mail.\n\nL'équipe Musala`,
  };
}

// À brancher plus tard : appeler ici un serveur qui envoie l'e-mail
// (par exemple une fonction Vercel qui utilise Brevo ou Resend).
// La clé secrète du service d'e-mails ne doit JAMAIS être mise dans ce fichier :
// tout le monde peut lire le code d'un site web.
async function envoyerVraiEmail(email, message) {
  throw new Error("Musala : l'envoi de vrais e-mails n'est pas encore branché. Repasse OTP.MODE sur \"demo\".");
}
