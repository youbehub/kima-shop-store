// Produits en vedette de démonstration
const products = [
  {
    id: 1,
    title: "Robe Élégante Noire",
    slug: "robe-elegante-noire",
    description: "Une robe noire élégante parfaite pour toutes les occasions",
    price: 89.99,
    original_price: 129.99,
    images: [{ url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" }],
    category: "Robes",
    category_id: 1,
    stock: 50,
    featured: 1
  },
  {
    id: 2,
    title: "Blazer Chic Beige",
    slug: "blazer-chic-beige",
    description: "Blazer élégant pour un look professionnel",
    price: 120.00,
    original_price: 150.00,
    images: [{ url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" }],
    category: "Vestes",
    category_id: 2,
    stock: 30,
    featured: 1
  },
  {
    id: 3,
    title: "Jupe Midi Plissée",
    slug: "jupe-midi-plissee",
    description: "Jupe midi plissée tendance et confortable",
    price: 65.00,
    original_price: 85.00,
    images: [{ url: "https://images.unsplash.com/photo-1583496661160-fb5886a0afe2?w=400" }],
    category: "Jupes",
    category_id: 3,
    stock: 45,
    featured: 1
  },
  {
    id: 4,
    title: "Top Satin Ivoire",
    slug: "top-satin-ivoire",
    description: "Top en satin doux et élégant",
    price: 45.00,
    original_price: 55.00,
    images: [{ url: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400" }],
    category: "Tops",
    category_id: 4,
    stock: 60,
    featured: 1
  },
  {
    id: 5,
    title: "Pantalon Large Noir",
    slug: "pantalon-large-noir",
    description: "Pantalon large et confortable pour un style moderne",
    price: 75.00,
    original_price: 95.00,
    images: [{ url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" }],
    category: "Pantalons",
    category_id: 5,
    stock: 40,
    featured: 1
  },
  {
    id: 6,
    title: "Robe Fleurie Été",
    slug: "robe-fleurie-ete",
    description: "Robe légère à motifs floraux pour l'été",
    price: 79.00,
    original_price: 99.00,
    images: [{ url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400" }],
    category: "Robes",
    category_id: 1,
    stock: 35,
    featured: 1
  }
];

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Retourner les produits en vedette
    const featuredProducts = products.filter(p => p.featured === 1);
    return res.status(200).json(featuredProducts);
  } catch (error) {
    console.error('Erreur produits featured:', error);
    return res.status(500).json({ error: 'Erreur lors du chargement des produits en vedette' });
  }
}
