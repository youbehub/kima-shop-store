# 🚀 DÉMARRAGE RAPIDE

## ⚡ En 5 minutes

### 1. Backend (Terminal 1)
```bash
cd backend
npm install
npm run db:init
npm run db:seed
npm run dev
```
✅ Serveur sur http://localhost:3000

### 2. Frontend (Terminal 2)
```bash
cd frontend
python -m http.server 8000
```
✅ App sur http://localhost:8000

---

## 🔑 Identifiants de Test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@fashionstore.com` | `password` |
| Client | `marie@example.com` | `password` |

---

## 📍 URLs Principales

| Page | URL |
|------|-----|
| Accueil | http://localhost:8000 |
| Boutique | http://localhost:8000/pages/shop.html |
| Panier | http://localhost:8000/pages/cart.html |
| Admin | http://localhost:8000/pages/admin.html |
| Auth | http://localhost:8000/pages/auth.html |

---

## 🎨 Preview

- **Palette** : Blanc cassé + Or métallique ✨
- **Font** : Georgia (headers) + Segoe UI (body)
- **Animations** : Smooth, 300ms transitions
- **Responsive** : Mobile-first design

---

## 📞 Problèmes ?

- Backend refuse de démarrer ? → `rm database/fashion_store.db` puis réinitialisez
- Frontend vide ? → Vérifier DevTools (F12) → Network → erreurs CORS
- Panier vide ? → Vérifier localStorage (F12) → Application → localStorage

---

**Prêt ! Commencez à développer 🎉**
