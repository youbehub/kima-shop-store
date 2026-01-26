# 👗 Women's Fashion Store - E-Commerce Full-Stack

Une **application e-commerce haut de gamme** dédiée aux vêtements pour femmes, avec un design **luxe blanc & or** et une architecture **production-ready**.

![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20SQLite%20%7C%20Vanilla%20JS-gold)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Caractéristiques Principales

### 🛍️ Catalogue & Boutique
- ✅ Catalogue de **8+ produits** avec images multiples
- ✅ **Recherche et filtres** (prix, catégorie, taille, couleur)
- ✅ **7 catégories** (Robes, Abayas, Tops, Ensembles, Chaussures, Sacs, Bijoux)
- ✅ Variantes produits (tailles, couleurs, stock)
- ✅ Galerie d'images avec aperçus

### 🛒 Panier & Commandes
- ✅ Panier persistant (localStorage)
- ✅ Formulaire de paiement complet
- ✅ Gestion des livraisons (frais configurables)
- ✅ Confirmation de commande avec numéro de suivi
- ✅ Historique des commandes utilisateur

### 👤 Authentification
- ✅ Inscription/Connexion sécurisée (JWT)
- ✅ Hachage des mots de passe (bcrypt)
- ✅ Profil utilisateur
- ✅ Historique des commandes

### 🔧 Tableau de Bord Administrateur
- ✅ **Gestion des commandes** (statut, tracking)
- ✅ **CRUD Produits** (création, édition, suppression)
- ✅ **CRUD Catégories**
- ✅ Upload d'images de produits
- ✅ Contrôle d'accès par rôle

### 🎨 Design & UX
- ✅ **Palette luxe** : blanc (#F9F7F3) & or (#C8A24A)
- ✅ **Responsive** : mobile-first, adapté tablette/desktop
- ✅ **Animations fluides** : cartes produits, boutons, transitions
- ✅ **Accessibilité** : contraste WCAG, navigation au clavier
- ✅ **Notifications** : toasts pour feedback utilisateur
- ✅ **Skeleton loaders** pour UX optimale

### 🔒 Sécurité
- ✅ **Validation d'entrée** côté frontend & backend
- ✅ **Requêtes SQL paramétrées** (prévention SQL injection)
- ✅ **JWT** pour authentification
- ✅ **Rate limiting** (100 requêtes/15 min)
- ✅ **CORS** configuré
- ✅ **Helmet.js** pour headers de sécurité

---

## 🛠️ Stack Technique

### Backend
- **Node.js 18+** avec **Express.js 4.18**
- **SQLite 3** (base légère et embarquée)
- **JWT** (JSON Web Tokens)
- **bcryptjs** (hachage sécurisé)
- **express-validator** (validation)
- **Multer** (upload d'images)
- **Helmet** (sécurité HTTP headers)
- **CORS** (gestion cross-origin)

### Frontend
- **HTML5** sémantique
- **CSS3** (Grid, Flexbox, animations)
- **JavaScript Vanilla** (ES6+)
- **localStorage** pour le panier client-side
- **Fetch API** pour requêtes HTTP

### Base de Données
- **SQLite** avec 9 tables
- Relations parent-enfant (products ↔ variants, orders ↔ items)
- Indexes pour performances
- Seed data inclus

---

## 📂 Structure du Projet

```
store-app/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Logique métier
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   └── orderController.js
│   │   ├── routes/             # Endpoints API
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   ├── orders.js
│   │   │   ├── cart.js
│   │   │   └── admin.js
│   │   ├── models/             # Modèles de données
│   │   │   ├── database.js
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── ProductVariant.js
│   │   │   └── Order.js
│   │   ├── middleware/         # Auth, validation
│   │   │   └── auth.js
│   │   └── utils/              # Utilitaires
│   │       └── helpers.js
│   ├── database/
│   │   ├── schema.sql          # Structure des tables
│   │   └── seed.sql            # Données de test
│   ├── scripts/
│   │   ├── init-db.js
│   │   └── seed-db.js
│   ├── uploads/                # Images produits
│   ├── package.json
│   ├── server.js               # Point d'entrée
│   ├── .env                    # Variables d'environnement
│   └── .gitignore
│
├── frontend/
│   ├── index.html              # Accueil
│   ├── pages/
│   │   ├── shop.html           # Catalogue
│   │   ├── product.html        # Détail produit
│   │   ├── cart.html           # Panier
│   │   ├── checkout.html       # Paiement
│   │   ├── auth.html           # Login/Register
│   │   ├── account.html        # Mon compte
│   │   ├── admin.html          # Dashboard admin
│   │   └── order-confirmation.html
│   ├── css/
│   │   └── style.css           # Tous les styles
│   ├── js/
│   │   ├── app.js              # Utilitaires & cart
│   │   └── pages/
│   │       ├── home.js
│   │       ├── shop.js
│   │       ├── product.js
│   │       ├── cart.js
│   │       ├── checkout.js
│   │       ├── auth.js
│   │       ├── account.js
│   │       └── admin.js
│   └── assets/                 # Images, icônes
│
└── README.md
```

---

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js 18+** ([télécharger](https://nodejs.org))
- **npm** (inclus avec Node.js)
- **Terminal/CMD**

### 1️⃣ Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Initialiser la base de données
npm run db:init

# Ajouter les données de test
npm run db:seed

# Démarrer le serveur
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

### 2️⃣ Configuration du Frontend

#### Option A : Serveur Python (recommandé)
```bash
# Dans le dossier frontend
python -m http.server 8000
```
Accédez à **http://localhost:8000**

#### Option B : Live Server (VS Code)
1. Installer l'extension "Live Server" de Ritwick Dey
2. Clic droit sur `index.html` → "Open with Live Server"

#### Option C : Serveur Node simple
```bash
# Terminal depuis le dossier frontend
npx http-server -p 8000
```

---

## 📋 Données de Test

### Utilisateurs Prédéfinis

#### Admin
- **Email** : `admin@fashionstore.com`
- **Mot de passe** : `password`
- **Rôle** : `admin`

#### Client
- **Email** : `marie@example.com`
- **Mot de passe** : `password`
- **Rôle** : `customer`

### Produits Inclus
- 8 produits avec variantes (tailles, couleurs)
- Stock réaliste
- Images par défaut
- 7 catégories pré-configurées

---

## 🔌 API Endpoints

### 🔐 Authentification
```
POST   /api/auth/register    # Créer un compte
POST   /api/auth/login       # Se connecter
```

### 📦 Produits
```
GET    /api/products         # Liste (search, filters, sort, pagination)
GET    /api/products/:id     # Détails d'un produit
GET    /api/products/featured # Produits en vedette
```

**Query params** : `search`, `category_id`, `min_price`, `max_price`, `sort`, `page`, `limit`

### 📂 Catégories
```
GET    /api/categories       # Liste des catégories
GET    /api/categories/:slug # Détails d'une catégorie
```

### 🛒 Commandes
```
POST   /api/orders           # Créer une commande
GET    /api/orders/my-orders # Mes commandes (auth)
GET    /api/orders/:order_number # Détail commande (auth)
```

### ⚙️ Admin (auth + admin role requis)
```
GET    /api/admin/orders                 # Toutes les commandes
PATCH  /api/admin/orders/:id             # Mettre à jour le statut
GET    /api/admin/products               # Tous les produits
POST   /api/admin/products               # Créer un produit
PUT    /api/admin/products/:id           # Modifier un produit
DELETE /api/admin/products/:id           # Supprimer un produit
POST   /api/admin/upload                 # Upload d'image
GET    /api/admin/categories             # Toutes les catégories
POST   /api/admin/categories             # Créer une catégorie
```

---

## 🔐 Variables d'Environnement

Fichier `.env` (backend) :
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=votre_secret_super_secure_ici_changer_en_prod
DB_PATH=./database/fashion_store.db
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:8000
```

⚠️ **En production** : Changer `JWT_SECRET` et utiliser une vraie base de données

---

## 📊 Schéma Base de Données

```sql
users              # Utilisateurs (id, name, email, password_hash, role)
categories         # Catégories (id, name, slug)
products           # Produits (id, title, price, category_id, featured)
product_variants   # Variantes (id, product_id, size, color, stock)
product_images     # Images (id, product_id, url, sort_order)
orders             # Commandes (id, user_id, order_number, customer_*, total, status)
order_items        # Articles (id, order_id, product_id, quantity)
carts              # Paniers (id, user_id, session_id)
cart_items         # Articles du panier (id, cart_id, product_id)
```

---

## 🎯 Flux Utilisateur

### Visiteur → Client
1. 🏠 Accueil avec produits en vedette
2. 🔍 Parcourir la boutique (filtres/recherche)
3. 📸 Voir détails du produit
4. 🛒 Ajouter au panier (localStorage)
5. 📝 Remplir infos paiement
6. ✅ Confirmation de commande
7. 👤 Créer compte / Connexion
8. 📦 Voir historique commandes

### Admin
1. 🔑 Connexion admin
2. 📊 Dashboard
3. 📋 Gérer commandes (statut)
4. 📦 Ajouter/Modifier/Supprimer produits
5. 📂 Gérer catégories
6. 📤 Upload d'images

---

## 🎨 Styles & Couleurs

### Palette Luxe
- **Blanc cassé** : `#F9F7F3` (background principal)
- **Or métallique** : `#C8A24A` (accents, boutons, hover)
- **Or clair** : `#E8C66B` (gradients)
- **Gris foncé** : `#333` (texte principal)
- **Gris clair** : `#999`, `#ddd` (borders, secondary text)

### Typographie
- **En-têtes** : Georgia (serif) - élégance
- **Corps** : Segoe UI (sans-serif) - lisibilité
- **Boutons** : Majuscules, letter-spacing

### Composants Clés
- 🔘 Boutons au design en gradient
- 🎴 Cartes produits avec hover lift
- ✨ Animations fluides (0.3s cubic-bezier)
- 📱 Responsive: mobile-first

---

## 🧪 Fonctionnalités Testées

✅ Inscription / Connexion  
✅ Parcourir les produits (recherche, filtres, tri)  
✅ Ajouter au panier  
✅ Modifier quantités  
✅ Passer commande  
✅ Voir historique (utilisateur)  
✅ Admin : gestion commandes  
✅ Admin : CRUD produits  
✅ Sécurité : JWT, rate limiting  
✅ Responsive : mobile, tablet, desktop  

---

## 🔍 Contrôle de Qualité

### Code
- ✅ Pas de dépendances de build (vanilla JS)
- ✅ Validation côté frontend & backend
- ✅ Gestion d'erreurs complète
- ✅ Logs utiles en console

### Performance
- ✅ Skeleton loaders
- ✅ Lazy loading des images
- ✅ Pagination (12 produits/page)
- ✅ CSS optimisé (aucune framework)

### Accessibilité
- ✅ Contraste texte/fond WCAG AA
- ✅ Labels sur inputs
- ✅ Navigation au clavier
- ✅ Images avec alt text

---

## 📝 TODO / Améliorations Futures

- [ ] Panier en base de données (actuellement localStorage)
- [ ] Paiement réel (Stripe, PayPal)
- [ ] Wishlist / Favoris
- [ ] Avis clients & notes
- [ ] Système de réduction / codes promo
- [ ] Gestion des retours/remboursements
- [ ] Emailing (confirmation commande)
- [ ] Notifications real-time (WebSocket)
- [ ] Fichiers static optimisés (minification)
- [ ] Tests automatisés (Jest, Mocha)

---

## 🐛 Dépannage

### Backend ne démarre pas
```bash
# Vérifier Node.js
node --version

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Supprimer la base de données corruptée
rm database/fashion_store.db
npm run db:init
npm run db:seed
```

### Frontend ne charge pas les produits
- Vérifier que le backend tourne sur `http://localhost:3000`
- Ouvrir DevTools (F12) → Onglet Network pour voir les erreurs
- Vérifier CORS_ORIGIN dans `.env` backend

### Erreurs lors du paiement
- Vérifier que tous les champs du formulaire sont remplis
- Consulter la console navigateur (F12) pour les erreurs JavaScript

---

## 📞 Support & Contribution

Ce projet est une base **production-ready** et entièrement personnalisable.

Pour améliorer :
1. Cloner le repo
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commiter les changements (`git commit -am 'Ajout feature'`)
4. Pusher vers la branche (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT © 2024

---

## 🙏 Remerciements

Merci d'avoir choisi cette plateforme e-commerce !

**Bon développement ! 🚀**

---

**Créé avec ❤️ pour les femmes entrepreneurs** 👗✨
