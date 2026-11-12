# Les Sudettes

Site des **Sudettes** : événements lifestyle, bien-être et solidaires à Marseille.
Site vitrine, réservation en ligne et espace admin pour gérer les événements et la galerie.

Tâches : [tableau Trello](https://trello.com/b/A26cVd06/les-sudettes-site-web)

---

## Stack

| Partie | Technos |
|---|---|
| Front | React + Vite + TypeScript + Tailwind CSS |
| Back | Node.js + Express + TypeScript |
| Base de données | PostgreSQL (dans Docker) + Prisma 7 |
| Paiement (à venir) | Stripe |

---

## À installer sur votre PC (une seule fois)

| Outil | Lien | Vérifier avec |
|---|---|---|
| **Node.js** (version LTS) | https://nodejs.org | `node -v` |
| **Git** | https://git-scm.com | `git --version` |
| **Docker Desktop** (garder « Use WSL 2 » coché) | https://www.docker.com/products/docker-desktop | `docker --version` |
| **VS Code** (conseillé) | https://code.visualstudio.com | — |

> **Windows : si `npm` affiche « l'exécution de scripts est désactivée »**, lancez une fois :
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

Configurer Git avec votre compte GitHub :

```bash
git config --global user.name "Votre Nom"
git config --global user.email "email-de-votre-compte-github"
```

---

## Lancer le projet (première fois)

> Toutes les commandes se lancent **depuis la racine du projet** (`les-sudettes/`), jamais depuis `frontend/` ou `backend/`.

```bash
# 1. Cloner le repo
git clone https://github.com/<nom-de-l-orga>/les-sudettes.git
cd les-sudettes

# 2. Passer sur la branche de travail
git checkout dev

# 3. Installer toutes les dépendances (front + back en une fois)
npm install

# 4. Autoriser les scripts d'installation (npm le demande)
npm install-scripts approve esbuild prisma @prisma/engines
npm rebuild

# 5. Créer le fichier de config du backend
copy backend\.env.example backend\.env      # Windows
# cp backend/.env.example backend/.env      # Mac / Linux

# 6. Démarrer la base de données (Docker Desktop doit être ouvert)
npm run db:up

# 7. Créer les tables dans la base
npm run db:migrate

# 8. Lancer le site
npm run dev
```

Ensuite :

- **Site** : http://localhost:5173
- **API** : http://localhost:3000/api/health → doit afficher `{"ok":true}`
- **Voir la base** : `npm run db:studio`

Pour arrêter le site : **Ctrl + C** dans le terminal.

---

## Les jours suivants

```bash
git checkout dev
git pull              # récupérer le travail des autres
npm install           # si quelqu'un a ajouté une dépendance
npm run db:up         # démarrer la base
npm run db:migrate    # si quelqu'un a modifié la base
npm run dev
```

---

## Commandes

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | Lance le front (port 5173) et le back (port 3000) en même temps |
| `npm run build` | Compile le front et le back pour la mise en ligne |
| `npm run db:up` | Démarre la base PostgreSQL dans Docker |
| `npm run db:down` | Arrête la base (les données sont gardées) |
| `npm run db:migrate` | Applique les changements de `schema.prisma` à la base |
| `npm run db:studio` | Ouvre une interface web pour voir et modifier les données |

**Ajouter une dépendance** : toujours depuis la racine, en précisant la partie avec `-w`.

```bash
npm install <paquet> -w frontend
npm install <paquet> -w backend
npm install -D <paquet> -w backend    # dépendance de développement
```

---

## Structure

```
les-sudettes/
├── package.json            # scripts communs + workspaces (frontend, backend)
├── docker-compose.yml      # base PostgreSQL locale (port 5434)
├── frontend/
│   ├── vite.config.ts      # Tailwind + proxy /api → backend
│   └── src/
│       ├── index.css       # charte graphique (couleurs, polices, boutons)
│       ├── App.tsx
│       └── main.tsx
└── backend/
    ├── .env.example        # modèle de config (le vrai .env n'est jamais commit)
    ├── prisma.config.ts
    ├── prisma/
    │   ├── schema.prisma   # les tables de la base
    │   └── migrations/     # historique des changements de la base (à commit)
    └── src/
        └── index.ts        # serveur Express
```

---

## Base de données

| Table | Contenu |
|---|---|
| `users` | Comptes admin |
| `event` | Les événements (titre, dates, prix, places, catégorie, statut…) |
| `reservation` | Les réservations, liées à un événement (`id_event`) |
| `gallery_photo` | Les photos de la galerie, liées ou non à un événement |
| `contact_message` | Les messages du formulaire de contact |

- Les **prix** sont stockés **en centimes** : `3500` = 35,00 €.
- **Catégories** : `SPORT`, `FOOD`, `SOLIDAIRE`, `VOYAGE`.
- **Statut d'un événement** : `DRAFT` (brouillon), `UPCOMING` (à venir), `OPEN` (réservable), `CLOSED`.

**Modifier la base**

1. Modifier `backend/prisma/schema.prisma`.
2. Lancer `npm run db:migrate` et donner un nom clair, par exemple `add_phone_to_reservation`.
3. **Commit le dossier `prisma/migrations/`** avec votre code.

---

## Routes de l'API

Toutes les routes commencent par `/api`. En local, le front les appelle directement
(ex : `fetch("/api/events")`) grâce au proxy Vite, sans écrire `localhost:3000`.

Accès : **Public** = tout le monde, **Admin** = admin connecté.
Quand vous ajoutez ou modifiez une route, mettez à jour ce tableau dans la même Pull Request.

### Santé

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Vérifie que le serveur répond, renvoie `{"ok":true}` |

### Événements

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/events` | Public | Liste des événements visibles (filtre : `?category=SPORT`) |
| GET | `/api/events/:slug` | Public | Détail d'un événement + places restantes |
| GET | `/api/events/admin/all` | Admin | Tous les événements, brouillons compris |
| POST | `/api/events` | Admin | Créer un événement |
| PUT | `/api/events/:id` | Admin | Modifier un événement |
| DELETE | `/api/events/:id` | Admin | Supprimer un événement |

### Réservations

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/reservations` | Public | Créer une réservation (bloque les places 15 min) |
| GET | `/api/reservations` | Admin | Liste de toutes les réservations |
| POST | `/api/stripe/webhook` | Stripe | Confirme le paiement, passe la réservation en `PAID` |

### Galerie

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/gallery` | Public | Liste des photos (filtre : `?category=FOOD`) |
| POST | `/api/gallery` | Admin | Ajouter une photo |
| DELETE | `/api/gallery/:id` | Admin | Supprimer une photo |

### Contact

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/contact` | Public | Envoyer un message |
| GET | `/api/contact` | Admin | Liste des messages reçus |

### Authentification admin

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Connexion (email + mot de passe), crée le cookie de session |
| POST | `/api/auth/logout` | Admin | Déconnexion |
| GET | `/api/auth/me` | Admin | Infos de l'admin connecté |

### Exemple : créer une réservation

```http
POST /api/reservations
Content-Type: application/json

{
  "id_event": 1,
  "first_name": "Léa",
  "last_name": "Martin",
  "email": "lea@example.com",
  "quantity": 2
}
```

Réponses : `201` réservation créée · `400` données invalides · `409` plus assez de places.

---

## Charte graphique

Définie dans `frontend/src/index.css` et utilisable directement en classes Tailwind :

| Nom | Couleur | Utilisation |
|---|---|---|
| `bordeaux` | `#6B1424` | titres, boutons principaux |
| `bordeaux-dark` | `#4E0D19` | survol des boutons |
| `rose` | `#F4C6CF` | boutons secondaires, badges |
| `rose-light` | `#FBE6EA` | fond du site |
| `rose-dark` | `#E891A2` | accents |
| `cream` | `#FFF7F8` | cartes, champs de formulaire |

- **Polices** : `font-display` (titres, Fraunces), `font-script` (« Good vibes ♡ », Caveat).
- **Classes prêtes à l'emploi** : `btn-primary`, `btn-secondary`, `card`.

```tsx
<h1 className="text-5xl text-bordeaux">Nos événements ♡</h1>
<button className="btn-primary">Réserver</button>
```

---

## Contribuer au projet

**Branches**
- `main` contient ce qui est en ligne. On ne pousse **jamais** directement dessus.
- `dev` sert à l'intégration : on y fusionne les fonctionnalités terminées.
- Chaque tâche a sa propre branche, créée depuis `dev` : `feature/page-galerie`, `fix/navbar-mobile`…

**Workflow d'une tâche**
1. Prendre une carte sur Trello, s'y assigner et la mettre dans « En cours ».
2. Créer sa branche :
   ```bash
   git checkout dev
   git pull
   git checkout -b feature/ma-tache
   ```
3. Coder et commit souvent :
   ```bash
   git add .
   git commit -m "feat: ajoute les filtres de la galerie"
   ```
4. Envoyer la branche sur GitHub :
   ```bash
   git push -u origin feature/ma-tache
   ```
5. Sur GitHub, ouvrir une **Pull Request vers `dev`** et mettre la carte Trello dans « En relecture ».
6. Une autre personne relit et valide, puis on merge. La carte passe dans « Fait ».

**Messages de commit**

| Préfixe | Pour |
|---|---|
| `feat:` | une nouvelle fonctionnalité |
| `fix:` | une correction de bug |
| `style:` | un changement visuel |
| `refactor:` | du code réorganisé sans changement de comportement |
| `docs:` | la documentation |
| `chore:` | la config ou les dépendances |

**À ne jamais commit** : le fichier `.env`, des mots de passe, des clés Stripe, `node_modules/`.

---

## Problèmes fréquents

**`P1000: Authentication failed` au moment de `db:migrate`**
Un PostgreSQL est sûrement déjà installé sur votre PC (souvent avec pgAdmin) et occupe le port 5432. C'est pour ça que le projet utilise le port **5434**. Vérifiez que `backend/.env` contient bien :

```
DATABASE_URL="postgresql://sudettes:sudettes@localhost:5434/sudettes"
```

Puis réinitialisez la base Docker (elle sera vide) :

```bash
docker compose down -v
npm run db:up
npm run db:migrate
```

**`npm error No workspaces found` ou `Missing script`**
Vous n'êtes pas à la racine du projet. Faites `cd` jusqu'au dossier `les-sudettes/`.

**`Port 5173 is in use`**
Un ancien `npm run dev` tourne encore dans un autre terminal. Fermez-le, puis relancez.

**`prisma migrate dev has been replaced` ou une version 8 de Prisma**
Prisma doit rester en version **7.10.1** partout :

```bash
npm install -D prisma@7.10.1 -w backend
npm install @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1 -w backend
```

**`npm warn install-scripts ... not yet covered by allowScripts`**
Autorisez le paquet cité, par exemple : `npm install-scripts approve esbuild`.

**Les changements de Tailwind ou de TypeScript ne s'affichent pas dans VS Code**
Faites `Ctrl + Shift + P`, puis choisissez « TypeScript: Restart TS Server ».