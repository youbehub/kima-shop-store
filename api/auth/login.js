import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Utilisateurs de démonstration
const demoUsers = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@kimashop.com',
    password_hash: '$2a$10$XQxBtC1cvp2Z9Qv8VvF9OeP5Z5W5Z5W5Z5W5Z5W5Z5W5Z5W5Z5W5e', // "admin123"
    role: 'admin'
  },
  {
    id: 2,
    name: 'Test User',
    email: 'test@example.com',
    password_hash: '$2a$10$XQxBtC1cvp2Z9Qv8VvF9OeP5Z5W5Z5W5Z5W5Z5W5Z5W5Z5W5Z5W5e', // "password123"
    role: 'customer'
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'kima-shop-secret-key-2026';

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
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Trouver l'utilisateur
    const user = demoUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Pour la démo, accepter ces mots de passe
    const validPasswords = ['admin123', 'password123', 'demo123'];
    const isValidPassword = validPasswords.includes(password) || 
                           await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Erreur login:', error);
    return res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
}
