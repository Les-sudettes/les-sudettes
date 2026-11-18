
# Les Sudettes

Site des Sudettes : événements lifestyle, bien-être et solidaires à Marseille. Le projet comprend un site vitrine, la consultation et la réservation d'événements, une galerie photo, un formulaire de contact et un espace d'administration.

## Stack technique

| Partie | Technologies |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS 4 |
| Navigation | React Router |
| Backend | Node.js, Express 5, TypeScript |
| Base de données | PostgreSQL 17 (Docker) |
| ORM | Prisma 7 |
| Validation | Zod |
| Emails | Nodemailer + SMTP, Mailpit en local |
| Images | Multer, Sharp, heic-convert |
| Sécurité | Helmet, sessions admin par cookie signé |
| Paiement en ligne | Stripe prévu, intégration non finalisée |

## Prérequis à installer

| Outil | Lien | Vérification |
|---|---|---|
| Node.js (version LTS) | https://nodejs.org | `node -v` |
| npm | Inclus avec Node.js | `npm -v` |
| Git | https://git-scm.com | `git --version` |
| Docker Desktop | https://www.docker.com/products/docker-desktop | `docker --version` |
| VS Code (conseillé) | https://code.visualstudio.com | — |

Docker Desktop doit être démarré pour lancer PostgreSQL et Mailpit.

### Windows : autorisation des scripts npm

Si PowerShell affiche une erreur indiquant que l'exécution des scripts est désactivée, exécuter une fois :

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Configurer Git avec son compte GitHub :

```bash
git config --global user.name "Votre Nom"
git config --global user.email "email-de-votre-compte-github"
```

## Récupérer et lancer le projet

Toutes les commandes ci-dessous sont à exécuter depuis la racine du projet (`les-sudettes/`), et non depuis `frontend/` ou `backend/`.

### Première installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/<organisation>/les-sudettes.git
cd les-sudettes

# 2. Se placer sur la branche de développement
git checkout dev

# 3. Installer les dépendances du frontend et du backend
npm install
```

Créer ensuite `backend/.env` à partir du modèle :

**Windows**
```powershell
Copy-Item backend/.env.example backend/.env
```

**Mac / Linux**
```bash
cp backend/.env.example backend/.env
```

Vérifier les valeurs locales de `backend/.env`, notamment `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL` et `ADMIN_PASSWORD`.

Continuer l'installation :

```bash
# 4. Démarrer PostgreSQL et Mailpit
npm run db:up

# 5. Créer / mettre à jour les tables de la base
npm run db:migrate

# 6. Créer le compte administrateur et les données de démonstration
npm run db:seed

# 7. Démarrer le frontend et le backend
npm run dev
```

### Accès en local

| Service | Adresse | Utilité |
|---|---|---|
| Site | http://localhost:5173 | Site public |
| Administration | http://localhost:5173/admin | Gestion du site |
| API | http://localhost:3000 | Serveur backend |
| Vérification API | http://localhost:3000/api/health | Vérifier le serveur |
| Mailpit | http://localhost:8025 | Consultation des emails |
| Prisma Studio | `npm run db:studio` | Gestion de la base |

Les identifiants de l'administration sont ceux définis par `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans `backend/.env`.

Pour arrêter les serveurs : `Ctrl + C`.

Pour arrêter les conteneurs Docker :

```bash
npm run db:down
```

## Les jours suivants

Pour récupérer le travail de l'équipe et relancer le projet :

```bash
git checkout dev
git pull
npm install
npm run db:up
npm run db:migrate
npm run dev
```

Relancer `npm run db:seed` uniquement si nécessaire.

## Commandes disponibles

| Commande | Fonction |
|---|---|
| `npm run dev` | Lance le backend et le frontend en parallèle |
| `npm run build` | Compile le backend puis construit le frontend |
| `npm run db:up` | Démarre PostgreSQL et Mailpit avec Docker |
| `npm run db:down` | Arrête les conteneurs |
| `npm run db:migrate` | Applique les migrations Prisma |
| `npm run db:studio` | Ouvre Prisma Studio |
| `npm run db:seed` | Crée le compte admin et des données d'exemple |
| `npm run admin:set` | Crée ou met à jour le compte admin |
| `npm run photos:import -- "CHEMIN_DU_DOSSIER"` | Importe des photos dans la galerie |

### Importer des photos

Les formats JPG, JPEG, PNG, WebP, GIF, HEIC et HEIF sont pris en charge.

```bash
# Importer les photos
npm run photos:import -- "C:\Users\VotreNom\Pictures\Photos"

# Associer les photos à un événement
npm run photos:import -- "C:\Users\VotreNom\Pictures\Photos" --event garden-party

# Choisir une catégorie
npm run photos:import -- "C:\Users\VotreNom\Pictures\Photos" --category FOOD

# Prévisualiser sans importer
npm run photos:import -- "C:\Users\VotreNom\Pictures\Photos" --dry
```

L'import convertit les images HEIC en JPEG, corrige leur orientation, réduit leur taille à 2000 px maximum et supprime les métadonnées, notamment les coordonnées GPS.

### Ajouter une dépendance

Toujours depuis la racine :

```bash
npm install <paquet> -w frontend
npm install <paquet> -w backend
npm install -D <paquet> -w backend
```

## Structure du projet

```text
les-sudettes/
├── package.json
├── package-lock.json
├── docker-compose.yml
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── assets/
│       ├── components/
│       ├── lib/
│       └── pages/
│           ├── Home.tsx
│           ├── Events.tsx
│           ├── EventDetail.tsx
│           ├── Gallery.tsx
│           ├── About.tsx
│           ├── Contact.tsx
│           ├── NotFound.tsx
│           └── admin/
│               ├── Admin.tsx
│               ├── EventForm.tsx
│               └── ImagePicker.tsx
└── backend/
    ├── .env.example
    ├── prisma.config.ts
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    └── src/
        ├── index.ts
        ├── seed.ts
        ├── generated/prisma/
        ├── lib/
        │   ├── auth.ts
        │   ├── prisma.ts
        │   ├── places.ts
        │   ├── autoClose.ts
        │   ├── images.ts
        │   ├── emails.ts
        │   ├── mailer.ts
        │   └── formspree.ts
        ├── routes/
        │   ├── auth.ts
        │   ├── events.ts
        │   ├── reservations.ts
        │   ├── waitlist.ts
        │   ├── gallery.ts
        │   ├── uploads.ts
        │   └── contact.ts
        ├── scripts/
        │   ├── importPhotos.ts
        │   └── setAdmin.ts
        └── uploads/
```

## Configuration du backend

Le fichier `backend/.env` est créé localement à partir de `backend/.env.example`.

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Adresse de connexion PostgreSQL |
| `API_PORT` | Port de l'API |
| `FRONTEND_URL` | Origine du frontend |
| `SESSION_SECRET` | Clé secrète des sessions |
| `ADMIN_EMAIL` | Adresse du compte administrateur |
| `ADMIN_PASSWORD` | Mot de passe administrateur |
| `SMTP_HOST` | Serveur SMTP |
| `SMTP_PORT` | Port SMTP |
| `SMTP_SECURE` | Connexion SMTP sécurisée |
| `SMTP_USER` / `SMTP_PASS` | Identifiants SMTP |
| `MAIL_FROM` | Adresse d'expéditeur |
| `TEAM_EMAIL` | Adresse de réception des messages |
| `FORMSPREE_ENDPOINT` | Endpoint Formspree facultatif |

Configuration PostgreSQL locale :

```env
DATABASE_URL="postgresql://sudettes:sudettes@localhost:5434/sudettes"
API_PORT=3000
FRONTEND_URL="http://localhost:5173"
```

Ne jamais publier le vrai fichier `.env`, ses mots de passe ou ses identifiants.

## Base de données

La base utilise PostgreSQL et Prisma.

| Modèle / table | Contenu |
|---|---|
| `User` / `users` | Comptes administrateurs |
| `Event` / `event` | Événements, dates, prix, places, catégorie et statut |
| `Reservation` / `reservation` | Réservations liées à un événement |
| `GalleryPhoto` / `gallery_photo` | Photos de galerie |
| `ContactMessage` / `contact_message` | Messages du formulaire de contact |
| `WaitlistEntry` / `waitlist` | Inscriptions en liste d'attente |

### Catégories et statuts

**Catégories d'événements :**

- `SPORT`
- `FOOD`
- `SOLIDAIRE`
- `VOYAGE`
- `LIFESTYLE`

**Statuts des événements :**

- `DRAFT` : brouillon.
- `UPCOMING` : événement à venir.
- `OPEN` : réservations ouvertes.
- `CLOSED` : événement terminé ou clôturé.

**Statuts des réservations :**

- `PENDING` : réservation en attente.
- `PAID` : réservation payée.
- `CANCELLED` : réservation annulée.

Les prix sont enregistrés en centimes : `3500` correspond à `35,00 €`.

### Informations complémentaires d'un événement

Les événements peuvent aussi contenir :

- `level` : niveau ou difficulté ;
- `dress_code` : tenue conseillée ;
- `programme` : programme, avec une activité par ligne ;
- `prestataires` : prestataires, un par ligne, au format « Nom — rôle ».

### Disponibilité des places et clôture automatique

Les réservations `PENDING` sont prises en compte dans le calcul des places restantes.

La création d'une réservation utilise une transaction en isolation `Serializable` afin d'éviter les conflits lorsque plusieurs personnes réservent les dernières places.

Les disponibilités publiques sont :

- `available` : disponibilité normale ;
- `few` : dernières places ;
- `full` : événement complet, inscription à la liste d'attente proposée.

Les événements `OPEN` ou `UPCOMING` dont la date est dépassée passent automatiquement en `CLOSED`. La vérification est effectuée au démarrage du serveur puis toutes les minutes.

### Modifier la base de données

1. Modifier `backend/prisma/schema.prisma`.
2. Lancer `npm run db:migrate`.
3. Donner un nom explicite à la migration.
4. Vérifier les fichiers créés dans `backend/prisma/migrations/`.
5. Ajouter et committer la migration avec le code.

## Routes de l'API

Toutes les routes commencent par `/api`. En local, le frontend utilise le proxy Vite et peut appeler les routes avec des chemins relatifs, par exemple `fetch("/api/events")`.

**Accès :** Public = accessible sans connexion administrateur ; Admin = nécessite une session administrateur valide.

### Santé

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Vérifie que le serveur répond et renvoie `{"ok":true}` |

### Événements

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/events` | Public | Liste les événements à venir ; filtres `?when=upcoming`, `?when=past` et `?category=SPORT` |
| GET | `/api/events/:slug` | Public | Détail d'un événement et disponibilité |
| GET | `/api/events/admin/all` | Admin | Liste tous les événements, brouillons compris |
| POST | `/api/events` | Admin | Crée un événement |
| PUT | `/api/events/:id` | Admin | Modifie un événement |
| DELETE | `/api/events/:id` | Admin | Supprime un événement sans réservation |

### Réservations

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/reservations` | Public | Crée une réservation en attente |
| GET | `/api/reservations` | Admin | Liste toutes les réservations |
| PATCH | `/api/reservations/:id` | Admin | Modifie le statut d'une réservation |

Exemple de création d'une réservation :

```http
POST /api/reservations
Content-Type: application/json
```

```json
{
  "id_event": 1,
  "first_name": "Léa",
  "last_name": "Martin",
  "email": "lea@example.com",
  "quantity": 2
}
```

La quantité doit être comprise entre 1 et 10. Une réponse `409` est renvoyée si l'événement n'est pas réservable ou s'il ne reste pas assez de places.

### Liste d'attente

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/waitlist` | Public | Inscrit une personne à la liste d'attente |
| GET | `/api/waitlist` | Admin | Liste les inscriptions |
| POST | `/api/waitlist/:id/notify` | Admin | Envoie un email pour prévenir qu'une place s'est libérée |
| DELETE | `/api/waitlist/:id` | Admin | Supprime une inscription |

Une seule inscription par adresse email et par événement est autorisée.

### Galerie

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/gallery` | Public | Liste les photos ; filtres `?category=FOOD` et `?event=3` |
| POST | `/api/gallery` | Admin | Ajoute une photo |
| DELETE | `/api/gallery/:id` | Admin | Supprime une photo |

### Envoi et gestion des images

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/uploads` | Admin | Envoie une ou plusieurs images |

L'envoi utilise le champ multipart `images`. Jusqu'à 20 fichiers peuvent être envoyés dans une requête, avec une limite de 25 Mo par fichier.

Les formats pris en charge sont JPG, PNG, WebP, GIF et HEIC/HEIF.

Les images sont traitées avant stockage : conversion si nécessaire, orientation corrigée, réduction et suppression des métadonnées.

### Contact

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/contact` | Public | Enregistre un message et prévient l'équipe |
| GET | `/api/contact` | Admin | Liste les messages reçus |
| PATCH | `/api/contact/:id` | Admin | Marque un message comme lu ou non lu |
| POST | `/api/contact/:id/reply` | Admin | Envoie une réponse par email |

Les messages sont conservés dans la base même si l'envoi d'un email échoue.

### Authentification administrateur

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Connexion avec email et mot de passe |
| POST | `/api/auth/logout` | Public | Déconnexion |
| GET | `/api/auth/me` | Admin | Informations de l'administrateur connecté |

L'authentification utilise un cookie HTTP-only signé. Les routes d'administration sont protégées par le middleware `requireAdmin`.

## Emails

Les modèles des emails sont centralisés dans `backend/src/lib/emails.ts` et l'envoi est géré par `backend/src/lib/mailer.ts`.

| Événement | Email |
|---|---|
| Création d'une réservation | Confirmation de l'enregistrement |
| Réservation passée à `PAID` | Confirmation de la réservation |
| Réservation passée à `CANCELLED` | Email d'annulation |
| Inscription à la liste d'attente | Email avec la position |
| Place libérée | Notification envoyée depuis l'administration |
| Nouveau message de contact | Notification à l'équipe |
| Réponse à un message | Email de réponse |

### En local : Mailpit

Les emails sont capturés localement et consultables sur :

http://localhost:8025

Ils ne sont pas envoyés aux vraies adresses des destinataires.

### En production

Configurer les variables SMTP dans `backend/.env` avec les identifiants du fournisseur choisi, ainsi que `MAIL_FROM` et `TEAM_EMAIL`.

Ne jamais committer ces identifiants.

## Charte graphique

La charte est définie dans `frontend/src/index.css`. Les polices Fraunces et Caveat sont intégrées au frontend.

| Élément | Utilisation |
|---|---|
| Bordeaux | Titres et boutons principaux |
| Rose | Boutons secondaires et accents |
| Rose clair / crème | Fonds et cartes |
| Fraunces | Titres |
| Caveat | Éléments manuscrits et touches décoratives |

Se référer aux variables et classes réellement définies dans `frontend/src/index.css` pour les valeurs exactes.

## Contribuer au projet

### Branches

- `main` : branche de production ; ne pas pousser directement dessus.
- `dev` : branche d'intégration.
- `feature/...` : branche dédiée à une fonctionnalité.
- `fix/...` : branche dédiée à une correction.

### Workflow d'une tâche

1. Prendre une tâche dans le tableau de suivi et se l'assigner.
2. Se mettre à jour depuis `dev` :

```bash
git checkout dev
git pull
```

3. Créer une branche :

```bash
git checkout -b feature/ma-tache
```

4. Développer et tester les changements.
5. Commiter régulièrement :

```bash
git add .
git commit -m "feat: ajoute une fonctionnalité"
```

6. Envoyer la branche :

```bash
git push -u origin feature/ma-tache
```

7. Ouvrir une Pull Request vers `dev`, faire relire le code puis fusionner après validation.

Lorsqu'une route API ou le schéma de données change, mettre à jour ce README dans la même Pull Request.

### Messages de commit

| Préfixe | Utilisation |
|---|---|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction d'un bug |
| `style:` | Changement visuel |
| `refactor:` | Réorganisation du code |
| `docs:` | Documentation |
| `chore:` | Configuration ou dépendances |

Ne jamais committer : `.env`, mots de passe, clés ou identifiants SMTP, `node_modules/`, ni les fichiers d'uploads locaux.

## Problèmes fréquents

### Erreur PostgreSQL `P1000` ou connexion impossible

Vérifier que Docker Desktop est démarré et que `backend/.env` contient :

```env
DATABASE_URL="postgresql://sudettes:sudettes@localhost:5434/sudettes"
```

Le projet utilise le port local `5434` pour éviter les conflits avec une installation PostgreSQL locale utilisant déjà le port `5432`.

Puis relancer :

```bash
npm run db:up
npm run db:migrate
```

**Attention :** `docker compose down -v` supprime le volume de données PostgreSQL. À n'utiliser que si l'on accepte de perdre les données locales.

### `npm error No workspaces found` ou `Missing script`

La commande est probablement lancée depuis `frontend/` ou `backend/`. Revenir à la racine du dépôt `les-sudettes/`.

### Le port 5173 ou 3000 est déjà utilisé

Un ancien serveur frontend ou backend est encore lancé, ou une autre application utilise le port. Arrêter le processus concerné puis relancer `npm run dev`.

### Les emails ne s'affichent pas dans Mailpit

Vérifier que le conteneur Mailpit est démarré :

```bash
npm run db:up
```

Ouvrir ensuite http://localhost:8025 et vérifier les paramètres SMTP locaux dans `backend/.env`.

### Le compte administrateur ne fonctionne pas

Vérifier `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans `backend/.env`, puis exécuter :

```bash
npm run admin:set
```

### Une photo ne s'importe pas

Vérifier le format du fichier, son intégrité et sa taille. Les formats acceptés sont JPG, JPEG, PNG, WebP, GIF, HEIC et HEIF.

### Les modifications Prisma ne sont pas prises en compte

Après une modification du schéma, créer et appliquer une migration :

```bash
npm run db:migrate
```

Vérifier que le dossier de migration est bien présent dans `backend/prisma/migrations/` et qu'il est ajouté au commit.

---

**Important :** le paiement Stripe est une évolution à venir. Le webhook Stripe n'est pas implémenté ni monté dans le serveur actuel.
