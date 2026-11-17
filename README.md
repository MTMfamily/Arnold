# Musala 🇨🇩

**Le réseau pro de la RDC.** *Musala* veut dire « le travail » en lingala.

Musala connecte les **demandeurs d'emploi** et les **employeurs** de toute la République démocratique du Congo.

Projet d'Arnold · atelier Code en Famille.

## Ce qu'on peut faire

- 👤 **Demandeurs d'emploi** : créer son profil (métier, compétences, études, expérience), chercher des offres et postuler, puis suivre ses candidatures.
- 🏢 **Employeurs** : une fois **vérifiés**, présenter son entreprise, publier des offres, voir les candidats et changer leur statut (vue, entretien, retenue…).
- 🛡️ **Administrateur** : vérifier le dossier de chaque employeur, puis le valider, le refuser (avec un motif), le suspendre ou le réactiver.
- 🔎 Chercher les offres par mot-clé, ville, secteur et contrat, et parcourir les talents.

## La validation des employeurs

Pour protéger les demandeurs contre les fausses offres, un employeur doit être **validé par un administrateur** avant de recruter.

1. À l'inscription, l'employeur remplit un **dossier de vérification** : n° RCCM, n° Id. Nat., n° d'impôt (NIF), adresse du siège, responsable du recrutement (nom et fonction), téléphone.
2. Son compte est **en attente** : il ne peut pas publier d'offres ni voir les coordonnées des talents.
3. L'administrateur contrôle chaque critère (cases à cocher) puis **valide** le compte, ou le **refuse** avec un motif.
4. Un employeur refusé voit le motif, corrige son dossier et le renvoie.
5. Un employeur validé reçoit le badge **✔ Vérifié** sur ses offres. S'il triche, l'administrateur peut le **suspendre** : ses offres disparaissent tout de suite.

Les critères sont dans `js/app.js` (liste `CRITERES`) et peuvent être modifiés.

## La base de données embarquée

Musala utilise **SQLite** directement dans le navigateur, grâce à [sql.js](https://github.com/sql-js/sql.js) (fichiers dans `vendor/`).
La base est sauvegardée dans le stockage local du navigateur : pas besoin de serveur.

Les tables sont dans `js/db.js` : `users` (avec le rôle et le statut du compte), `profils`, `entreprises` (avec le dossier de vérification), `offres`, `candidatures`.

> ⚠️ Chaque navigateur a **sa propre copie** de la base. Pour que tout le monde partage les mêmes offres et profils, il faudra plus tard une base en ligne (par exemple sur Vercel).

## Sécurité

- **Mots de passe** : jamais gardés en clair. Musala garde une empreinte PBKDF2-SHA256 (210 000 tours) avec un sel aléatoire pour chaque compte. La règle des 8 caractères minimum est aussi vérifiée dans le code. Les comptes créés avec l'ancien format sont mis à jour à la connexion.
- **Rôles** : chaque action vérifie que tu as le bon rôle et le bon statut (seul un employeur validé publie une offre, seul un demandeur postule, seul l'administrateur valide les employeurs…). Personne ne peut s'inscrire comme administrateur.
- **Session** : déconnexion automatique après 30 minutes sans activité, pour les ordinateurs partagés.
- **Injections** : tout le texte est « échappé » avant d'être affiché (contre le XSS), et toutes les requêtes SQL utilisent des paramètres `?`.
- **En-têtes de sécurité** : `vercel.json` ajoute une politique CSP, l'anti-clickjacking et d'autres protections.

> ⚠️ **Limite importante** : tout se passe dans le navigateur, que l'utilisateur contrôle. Une personne qui sait utiliser les outils du navigateur peut toujours modifier sa copie locale. Avant d'accueillir de vrais utilisateurs avec des données partagées, il faudra un **serveur** qui vérifie la connexion et les droits.

## Comptes de test

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Demandeuse | `grace@exemple.cd` | `musala123` |
| Employeur validé | `contact@kindigital.cd` | `musala123` |
| Employeur en attente | `rh@congobatiment.cd` | `musala123` |
| Administrateur | `admin@musala.cd` | `admin-musala` |

> ⚠️ Avant une vraie mise en service, change le mot de passe de l'administrateur : il est écrit ici pour les tests.

Les entreprises et personnes d'exemple sont inventées.

## Lancer le site sur ton ordinateur

```bash
python3 -m http.server 8080
```

Puis ouvre http://localhost:8080.

## Mettre en ligne

C'est un site statique : il suffit de connecter ce dépôt à **Vercel**, sans réglage particulier.

## Les fichiers

```
index.html      la page principale
vercel.json     les en-têtes de sécurité pour Vercel
css/style.css   les couleurs et le style (bleu, blanc, rouge)
js/db.js        la base de données SQLite embarquée
js/app.js       les pages et les actions
vendor/         SQLite pour le navigateur (sql.js, licence MIT)
```
