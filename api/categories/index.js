// Catégories de démonstration
const categories = [
  { id: 1, name: "Robes", slug: "robes", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
  { id: 2, name: "Vestes", slug: "vestes", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" },
  { id: 3, name: "Jupes", slug: "jupes", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0afe2?w=400" },
  { id: 4, name: "Tops", slug: "tops", image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400" },
  { id: 5, name: "Pantalons", slug: "pantalons", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" },
  { id: 6, name: "Accessoires", slug: "accessoires", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400" }
];

export default function handler(req, res) {
  // Ajouter les headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  return res.status(200).json({ categories });
}
