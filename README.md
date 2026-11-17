# Musala 🇨🇩

**Le réseau pro de la RDC.** *Musala* veut dire « le travail » en lingala.

Musala connecte les **demandeurs d'emploi** et les **employeurs** de toute la République démocratique du Congo.

Projet d'Arnold · atelier Code en Famille.

## Ce qu'on peut faire

- 👤 **Demandeurs d'emploi** : une fois **vérifiés**, apparaître dans les talents, postuler aux offres et suivre ses candidatures.
- 🏢 **Employeurs** : une fois **vérifiés**, présenter son entreprise, publier des offres, voir les candidats et changer leur statut (vue, entretien, retenue…).
- 👑 **Super admin** : le seul qui crée les comptes des administrateurs. Il peut aussi les désactiver, les réactiver et leur donner un nouveau mot de passe. Il ne valide pas de dossiers lui-même.
- 🛡️ **Administrateurs**, chacun avec sa propre file de dossiers :
  - l'**admin des employeurs** traite seulement les dossiers des entreprises ;
  - l'**admin des demandeurs** traite seulement les dossiers des demandeurs.
- 🔎 Chercher les offres par mot-clé, ville, secteur et contrat, et parcourir les talents.

## Le super admin

1. Le super admin crée un administrateur : nom, e-mail et type (employeurs ou demandeurs).
2. Musala génère un **mot de passe temporaire** de 12 caractères, affiché **une seule fois**. Le super admin le transmet à la personne de façon sûre.
3. À sa première connexion, le nouvel administrateur **doit choisir son propre mot de passe** (10 caractères minimum) avant d'accéder à quoi que ce soit.
4. Le super admin voit la liste des administrateurs, leur nombre de décisions et qui les a créés. Il peut **désactiver** un administrateur (il est déconnecté immédiatement et ne peut plus se connecter), le **réactiver**, ou lui donner un **nouveau mot de passe** temporaire.

Il n'y a qu'un seul super admin, et personne ne peut en créer un autre depuis le site.

## La vérification de l'e-mail (code OTP)

Avant de créer un compte employeur ou demandeur, il faut prouver que l'adresse e-mail est la sienne et qu'on n'est pas un robot :

1. **Ton e-mail** : on indique son adresse. Un champ piège invisible bloque les robots qui remplissent tout automatiquement.
2. **Le code reçu** : un code de **6 chiffres** est envoyé. Il est valable **10 minutes**, avec **5 essais** au maximum. On peut demander un nouveau code au bout d'**1 minute**.
3. **Ton dossier** : le formulaire s'ouvre avec l'adresse vérifiée, qui ne peut plus être modifiée.

Le code est tiré au hasard avec `crypto.getRandomValues`, et seule son empreinte (SHA-256 avec sel) est gardée, en mémoire uniquement.

> 📬 **Mode démo** : un site sans serveur ne peut pas envoyer d'e-mails. Pour l'instant (`OTP.MODE = "demo"` dans `js/otp.js`), l'e-mail s'affiche dans une « boîte mail de démonstration » sur la page. Pour envoyer de vrais e-mails, il faudra un **serveur** (par exemple une fonction Vercel) et un **service d'envoi d'e-mails** (Brevo, Resend…), puis brancher la fonction `envoyerVraiEmail`. La clé secrète du service ne doit jamais être mise dans le code du site.

## La validation des comptes

Tout nouveau compte, employeur ou demandeur, doit être **validé par un administrateur** avant de pouvoir agir.

1. À l'inscription, on remplit un **dossier de vérification**. Les champs obligatoires sont marqués d'une étoile rouge **\***. Le navigateur bloque l'envoi s'il en manque un, et le code vérifie aussi chaque champ (on ne peut pas tricher en modifiant la page).
2. Le compte est **en attente** : un employeur ne peut pas publier d'offres ni voir les coordonnées des talents ; un demandeur ne peut pas postuler et n'apparaît pas dans les talents.
3. L'administrateur concerné voit le dossier avec des **contrôles automatiques** (âge, doublons de pièce d'identité, de RCCM ou de téléphone…). Il coche chaque critère puis **valide**, ou **refuse** avec un motif.
4. Un compte refusé voit le motif, corrige son dossier et le renvoie.
5. Un compte validé reçoit le badge **✔ Vérifié**. En cas de triche, l'administrateur peut le **suspendre** : ses offres ou son profil disparaissent tout de suite.

### Dossier d'un demandeur (tous les champs sont obligatoires, sauf « À propos » et « Expérience »)

Nom complet (comme sur la pièce d'identité), ville, téléphone, e-mail, mot de passe, date de naissance (**18 ans minimum**), niveau d'études, type de pièce d'identité (carte d'électeur, passeport ou permis de conduire), n° de la pièce, adresse de résidence, métier recherché, au moins une compétence.

### Dossier d'un employeur (tous les champs sont obligatoires, sauf la présentation et le site web)

Nom de l'entreprise, ville, téléphone, e-mail, mot de passe, secteur, n° RCCM, n° Id. Nat., n° d'impôt (NIF), adresse du siège, nom et fonction du responsable du recrutement.

Les critères sont dans `js/app.js` (listes `CRITERES_DEMANDEUR` et `CRITERES_EMPLOYEUR`, et constante `AGE_MINIMUM`) et peuvent être modifiés.

## Les langues 🗣️

Musala est disponible en **français, lingala, swahili, tshiluba et kikongo**. On choisit sa langue en haut de la page ; le choix est retenu sur l'appareil.

- Toutes les pages des visiteurs, des demandeurs et des employeurs sont traduites, ainsi que les messages et l'e-mail du code de vérification. Les pages d'administration restent en français.
- Les offres et les profils restent dans la langue où ils ont été écrits.
- Toutes les traductions sont dans **`js/i18n.js`**. Chaque phrase française y est suivie de ses 4 traductions, dans l'ordre **[lingala, swahili, tshiluba, kikongo]**. Une phrase sans traduction reste en français.

> ⚠️ **Les traductions ont été préparées par une IA et doivent être relues par des personnes qui parlent chaque langue**, surtout le tshiluba et le kikongo. Un bandeau le rappelle sur le site quand on choisit une autre langue que le français.

## Le mode léger 📶

Pour économiser les données mobiles, qui coûtent cher :

- **Musala reste dans le téléphone** après la 1re visite (fichier `sw.js`, un « service worker »). Les visites suivantes ne téléchargent presque rien, et le site s'ouvre **même sans Internet**. Mesuré : environ 870 Ko à la 1re visite (dont 690 Ko pour SQLite), puis seulement une petite vérification de mise à jour aux visites suivantes.
- Le bouton **📶** active le **mode léger** : pas d'effets visuels (dégradés, ombres, animations), des listes plus courtes (6 éléments, puis « Voir plus »), et un **compteur** en bas de page qui montre ce que la visite a consommé.
- Le mode léger s'active **tout seul** si le téléphone est réglé en « économie de données ».

## Partager et installer 📲

- **Partager une offre** : sur chaque offre, un bouton **« Partager sur WhatsApp »** prépare un message avec le poste, l'entreprise, la ville, le salaire et le lien, dans la langue choisie. Sur téléphone, le bouton **« Partager… »** ouvre aussi la fenêtre de partage habituelle (SMS, Facebook, Telegram…).
- **Installer Musala** comme une application : quand le navigateur le permet, un bouton **« 📲 Installer Musala »** apparaît en bas de page. Musala a alors son icône sur l'écran d'accueil et s'ouvre en plein écran, même sans Internet. Les icônes sont dans `icones/` et la carte d'identité de l'application dans `manifest.webmanifest`.

> ⚠️ Tant que Musala n'a pas de serveur, une offre créée sur un téléphone n'existe que sur ce téléphone : la personne qui reçoit le lien voit le message WhatsApp, mais pas forcément l'offre sur le site.

## La base de données embarquée

Musala utilise **SQLite** directement dans le navigateur, grâce à [sql.js](https://github.com/sql-js/sql.js) (fichiers dans `vendor/`).
La base est sauvegardée dans le stockage local du navigateur : pas besoin de serveur.

Les tables sont dans `js/db.js` : `users` (avec le rôle et le statut du compte), `profils`, `entreprises` (avec le dossier de vérification), `offres`, `candidatures`.

> ⚠️ Chaque navigateur a **sa propre copie** de la base. Pour que tout le monde partage les mêmes offres et profils, il faudra plus tard une base en ligne (par exemple sur Vercel).

## Sécurité

- **Mots de passe** : jamais gardés en clair. Musala garde une empreinte PBKDF2-SHA256 (210 000 tours) avec un sel aléatoire pour chaque compte. La règle des 8 caractères minimum est aussi vérifiée dans le code. Les comptes créés avec l'ancien format sont mis à jour à la connexion.
- **Rôles** : chaque action vérifie que tu as le bon rôle et le bon statut (seul un employeur validé publie une offre, seul un demandeur validé postule, chaque administrateur ne traite que les dossiers de sa catégorie, seul le super admin crée des administrateurs…). Personne ne peut s'inscrire comme administrateur.
- **Session** : déconnexion automatique après 30 minutes sans activité, pour les ordinateurs partagés.
- **Injections** : tout le texte est « échappé » avant d'être affiché (contre le XSS), et toutes les requêtes SQL utilisent des paramètres `?`.
- **En-têtes de sécurité** : `vercel.json` ajoute une politique CSP, l'anti-clickjacking et d'autres protections.

> ⚠️ **Limite importante** : tout se passe dans le navigateur, que l'utilisateur contrôle. Une personne qui sait utiliser les outils du navigateur peut toujours modifier sa copie locale. Avant d'accueillir de vrais utilisateurs avec des données partagées, il faudra un **serveur** qui vérifie la connexion et les droits.

## Comptes de test

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Demandeuse validée | `grace@exemple.cd` | `musala123` |
| Demandeuse en attente | `merveille@exemple.cd` | `musala123` |
| Demandeur en attente (pièce d'identité en double) | `jonathan@exemple.cd` | `musala123` |
| Employeur validé | `contact@kindigital.cd` | `musala123` |
| Employeur en attente | `rh@congobatiment.cd` | `musala123` |
| Admin des employeurs | `admin.employeurs@musala.cd` | `admin-employeurs` |
| Admin des demandeurs | `admin.demandeurs@musala.cd` | `admin-demandeurs` |
| Super admin | `superadmin@musala.cd` | `super-musala` |

> ⚠️ Avant une vraie mise en service, change les mots de passe du super admin et des administrateurs (lien « 🔑 Changer mon mot de passe » dans chaque espace) : ils sont écrits ici pour les tests.

Les entreprises, les personnes et tous les numéros d'exemple (RCCM, pièces d'identité, téléphones…) sont inventés.

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
css/style.css   les couleurs et le style (bleu azur, blanc, rouge)
js/db.js        la base de données SQLite embarquée
js/otp.js       la vérification de l'e-mail par code (OTP)
js/i18n.js      les traductions (français, lingala, swahili, tshiluba, kikongo)
sw.js           garde Musala dans le téléphone (mode hors ligne)
manifest.webmanifest  la carte d'identité de l'application (nom, couleurs, icônes)
icones/         les icônes de l'application
js/app.js       les pages et les actions
vendor/         SQLite pour le navigateur (sql.js, licence MIT)
```
