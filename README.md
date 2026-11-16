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
css/style.css   les couleurs et le style (bleu, blanc, rouge)
js/db.js        la base de données SQLite embarquée
js/app.js       les pages et les actions
vendor/         SQLite pour le navigateur (sql.js, licence MIT)
```
