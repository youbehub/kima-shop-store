# 🏗️ Architecture & Design Patterns

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────┐
│                  NAVIGATEUR (Frontend)              │
│  ┌─────────────────────────────────────────────┐   │
│  │  HTML/CSS/JS Vanilla - Responsive Design    │   │
│  │  - index.html, pages/* (shop, product, etc) │   │
│  │  - css/style.css (Palette blanc & or)       │   │
│  │  - js/app.js (Cart, Auth, API calls)        │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────┘
                   │ JSON/REST via Fetch API
                   ↓
┌─────────────────────────────────────────────────────┐
│              BACKEND (Node.js/Express)              │
│  ┌─────────────────────────────────────────────┐   │
│  │  Routes:  /api/(auth|products|orders|admin) │   │
│  │  ┌───────────────────────────────────────┐  │   │
│  │  │ Controllers → Logic                   │  │   │
│  │  │  - authController                     │  │   │
│  │  │  - productController                  │  │   │
│  │  │  - orderController                    │  │   │
│  │  └───────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────┐  │   │
│  │  │ Models → Data Layer                   │  │   │
│  │  │  - User.js, Product.js, Order.js      │  │   │
│  │  │  - Database abstraction               │  │   │
│  │  └───────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────┐  │   │
│  │  │ Middleware                            │  │   │
│  │  │  - JWT auth, validation, error       │  │   │
│  │  │  - CORS, rate-limiting                │  │   │
│  │  └───────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────┘
                   │ SQL Queries
                   ↓
       ┌───────────────────────────┐
       │   SQLite Database         │
       │  ┌─────────────────────┐  │
       │  │ 9 tables:           │  │
       │  │ • users             │  │
       │  │ • products          │  │
       │  │ • product_variants  │  │
       │  │ • product_images    │  │
       │  │ • categories        │  │
       │  │ • orders            │  │
       │  │ • order_items       │  │
       │  │ • carts             │  │
       │  │ • cart_items        │  │
       │  └─────────────────────┘  │
       └───────────────────────────┘
```

---

## 🎯 Design Patterns Utilisés

### 1. **MVC** (Model-View-Controller)
- **Models** : `src/models/` → Couche données (database, queries)
- **Controllers** : `src/controllers/` → Logique métier
- **Views** : Frontend HTML/JS → Affichage et interaction

### 2. **Repository Pattern**
```javascript
// Exemple : User.js
const User = {
  findByEmail: async (email) => { ... },
  create: async (name, email, hash) => { ... },
  update: async (id, data) => { ... }
};
```

### 3. **Middleware Pattern**
```javascript
// Exemple : auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Vérifier token
  next();
};

// Utilisation : router.get('/protected', authenticate, controller);
```

### 4. **Factory Pattern** (Classes utilitaires)
```javascript
// helpers.js
const hashPassword = async (pwd) => { ... };
const generateToken = (user) => { ... };
const generateOrderNumber = () => { ... };
```

### 5. **Singleton Pattern**
```javascript
// database.js
class Database { ... }
module.exports = new Database(); // Instance unique
```

---

## 📊 Flux de Données

### Authentification
```
User Input (form)
    ↓
Frontend validation (email, password)
    ↓
POST /api/auth/login
    ↓
authController.login()
    ↓
User.findByEmail() → fetch user
    ↓
comparePassword() → validate
    ↓
generateToken() → JWT
    ↓
Response + token
    ↓
Frontend : localStorage.setItem('token')
```

### Achat d'un Produit
```
Browse products (page shop)
    ↓
GET /api/products?search=...&filters=...
    ↓
productController.getAll()
    ↓
Product.findAll() → query DB
    ↓
Response : array de produits
    ↓
Frontend : render product cards
    ↓
Add to cart → localStorage
    ↓
Checkout form
    ↓
POST /api/orders
    ↓
orderController.createOrder()
    ↓
Order.create() + Order.addItem() × N
    ↓
Response : order confirmation
    ↓
Frontend : show order number
```

---

## 🔐 Sécurité - Couches

### 1. Frontend
- ✅ Validation HTML5 sur inputs
- ✅ Sanitization des données
- ✅ Token stocké en localStorage (HttpOnly idéalement en prod)

### 2. Backend - Middleware
```javascript
// server.js
app.use(helmet());              // HTTP headers sécurisés
app.use(rateLimit(...));        // Rate limiting
app.use(cors({ origin: ... })); // CORS restreint
app.use(express.json());        // JSON parsing
```

### 3. Routes - Authentification
```javascript
// routes/orders.js
router.post('/', orderController.createOrder);     // Public
router.get('/my-orders', authenticate, ...);       // Authentifié
// routes/admin.js
router.use(authenticate);                          // Auth requis
router.use(authorize(['admin']));                  // Admin requis
```

### 4. Models - SQL Injection Prevention
```javascript
// ✅ Parameterized queries (sûr)
db.run('SELECT * FROM users WHERE email = ?', [email]);

// ❌ String concatenation (dangereux)
db.run(`SELECT * FROM users WHERE email = '${email}'`);
```

### 5. Données - Hashage
```javascript
// Passwords
const hash = await bcrypt.hash(password, 10); // salt rounds

// Vérification
const isValid = await bcrypt.compare(inputPassword, hash);
```

---

## 🗂️ Structure des Routes API

```
/api
├── /auth
│   ├── POST /register
│   └── POST /login
├── /products
│   ├── GET /              (search, filter, sort, pagination)
│   ├── GET /featured      (produits en vedette)
│   └── GET /:id           (détails produit)
├── /categories
│   ├── GET /              (toutes)
│   └── GET /:slug         (une catégorie)
├── /orders
│   ├── POST /             (créer commande)
│   ├── GET /my-orders     (mes commandes - auth)
│   └── GET /:order_number (détail - auth)
├── /cart
│   └── GET /              (status)
└── /admin
    ├── /orders
    │   ├── GET /          (toutes)
    │   └── PATCH /:id     (statut)
    ├── /products
    │   ├── GET /          (toutes)
    │   ├── POST /         (créer)
    │   ├── PUT /:id       (modifier)
    │   └── DELETE /:id    (supprimer)
    ├── /categories
    │   ├── GET /          (toutes)
    │   └── POST /         (créer)
    └── /upload
        └── POST /         (image)
```

---

## 📦 Gestion de l'État Frontend

### localStorage
```javascript
// Cart (persistant)
localStorage.setItem('cart', JSON.stringify(items));
const items = JSON.parse(localStorage.getItem('cart'));

// Auth
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

### Class Cart
```javascript
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
  }
  
  add(product, variant, quantity) { ... }
  remove(key) { ... }
  update(key, quantity) { ... }
  clear() { ... }
  getTotal() { ... }
}
```

### Class Auth
```javascript
class Auth {
  getToken() { ... }
  setToken(token) { ... }
  getUser() { ... }
  isAuthenticated() { ... }
  isAdmin() { ... }
}
```

---

## 🎨 Architecture CSS

```
style.css (une seule feuille pour simplicité)
├── Reset & Base
│   ├── * { margin, padding, box-sizing }
│   ├── body { font-family, colors, line-height }
│   └── h1-h3 { font-family, font-weight }
├── Layout
│   ├── .container { max-width, margin, padding }
│   └── .navbar { sticky, flexbox }
├── Composants
│   ├── .btn { padding, colors, transitions }
│   ├── .product-card { grid, shadow, hover effects }
│   ├── .product-grid { CSS Grid }
│   └── .form-group { inputs, labels, validation }
├── Animations
│   ├── @keyframes loading { skeleton loaders }
│   ├── @keyframes slideIn { toasts }
│   ├── @keyframes fadeIn { modals }
│   └── Transitions { 0.3s cubic-bezier }
├── Responsive
│   ├── @media (max-width: 768px) { mobile }
│   └── Mobile-first approach
└── Utilitaires
    ├── .spinner { loader }
    ├── .toast { notifications }
    ├── .modal { dialogs }
    └── .error-text { validation }
```

---

## 🔄 Cycle de Vie d'une Page

### Page Shop
```
1. DOMContentLoaded
2. loadCategories() → GET /api/categories
3. loadProducts() → GET /api/products
4. Render product grid
5. Add event listeners (filters, search)
6. User interact → loadProducts() again
```

### Page Admin
```
1. DOMContentLoaded
2. Check auth.isAdmin() → redirect if not
3. loadOrders() → GET /api/admin/orders
4. loadProducts() → GET /api/admin/products
5. loadCategories() → GET /api/categories
6. Render tables & forms
7. User actions (update status, add product, etc)
```

---

## 📈 Performances

### Frontend
- ✅ Aucun build step (vanille)
- ✅ CSS critiques en ligne (pas de FOUT)
- ✅ Lazy load images (`onerror` fallback)
- ✅ Pagination (12 produits/page)
- ✅ Skeleton loaders (perceived performance)

### Backend
- ✅ SQL indexes sur colonnes clés
- ✅ Pagination des API responses
- ✅ Compression GZIP via nginx (en prod)
- ✅ Caching headers (future: Redis)

### Base de Données
- ✅ Foreign keys + cascades
- ✅ Indexes stratégiques
- ✅ SELECT optimisées (colonnes, JOINs)

---

## 🛠️ Étendre l'App

### Ajouter une Nouvelle Page
1. Créer `frontend/pages/new-page.html`
2. Importer `js/app.js` + créer `js/pages/new-page.js`
3. Ajouter link dans navbar

### Ajouter une Nouvelle Route
1. Créer `backend/src/controllers/newController.js`
2. Créer `backend/src/routes/new.js`
3. Importer dans `server.js` : `app.use('/api/new', newRoutes)`

### Ajouter une Table
1. Ajouter CREATE TABLE dans `database/schema.sql`
2. Ajouter INSERT dans `database/seed.sql`
3. Créer model `backend/src/models/New.js`
4. Utiliser dans controllers

---

**Architecture robuste & scalable ! 🚀**
