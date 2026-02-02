import bcrypt from 'bcryptjs';

// Simulation d'une base de données en mémoire (pour demo)
// En production, utilisez une vraie base de données comme PlanetScale, Supabase, etc.
const users = new Map();

export default async function handler(req, res) {
  // Ajouter les headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { name, email, password, password_confirm } = req.body;

    // Validation
    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Le nom est requis (minimum 2 caractères)' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    if (password !== password_confirm) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
    }

    // Vérifier si l'email existe déjà
    if (users.has(email)) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = {
      id: Date.now(),
      name,
      email,
      password_hash: passwordHash,
      role: 'customer',
      created_at: new Date().toISOString()
    };

    users.set(email, user);

    return res.status(201).json({
      message: 'Inscription réussie',
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
}
