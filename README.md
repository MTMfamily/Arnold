# Musala 🇨🇩

**Le réseau pro de la RDC.** *Musala* veut dire « le travail » en lingala.

Musala connecte les **demandeurs d'emploi** et les **employeurs** de toute la République démocratique du Congo.

Projet d'Arnold · atelier Code en Famille.

## Ce qu'on peut faire

- 👤 **Demandeurs d'emploi** : créer son profil (métier, compétences, études, expérience), chercher des offres et postuler, puis suivre ses candidatures.
- 🏢 **Employeurs** : présenter son entreprise, publier des offres, voir les candidats et changer leur statut (vue, entretien, retenue…).
- 🔎 Chercher les offres par mot-clé, ville, secteur et contrat, et parcourir les talents.

## La base de données embarquée

Musala utilise **SQLite** directement dans le navigateur, grâce à [sql.js](https://github.com/sql-js/sql.js) (fichiers dans `vendor/`).
La base est sauvegardée dans le stockage local du navigateur : pas besoin de serveur.

Les tables sont dans `js/db.js` : `users`, `profils`, `entreprises`, `offres`, `candidatures`.

> ⚠️ Chaque navigateur a **sa propre copie** de la base. Pour que tout le monde partage les mêmes offres et profils, il faudra plus tard une base en ligne (par exemple sur Vercel).

## Sécurité

- **Mots de passe** : jamais gardés en clair. Musala garde une empreinte PBKDF2-SHA256 (210 000 tours) avec un sel aléatoire pour chaque compte. La règle des 8 caractères minimum est aussi vérifiée dans le code. Les comptes créés avec l'ancien format sont mis à jour à la connexion.
- **Rôles** : chaque action vérifie que tu as le bon rôle (seul un employeur publie une offre, seul un demandeur postule…).
- **Session** : déconnexion automatique après 30 minutes sans activité, pour les ordinateurs partagés.
- **Injections** : tout le texte est « échappé » avant d'être affiché (contre le XSS), et toutes les requêtes SQL utilisent des paramètres `?`.
- **En-têtes de sécurité** : `vercel.json` ajoute une politique CSP, l'anti-clickjacking et d'autres protections.

> ⚠️ **Limite importante** : tout se passe dans le navigateur, que l'utilisateur contrôle. Une personne qui sait utiliser les outils du navigateur peut toujours modifier sa copie locale. Avant d'accueillir de vrais utilisateurs avec des données partagées, il faudra un **serveur** qui vérifie la connexion et les droits.

## Comptes de test

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Demandeuse | `grace@exemple.cd` | `musala123` |
| Employeur | `contact@kindigital.cd` | `musala123` |

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
