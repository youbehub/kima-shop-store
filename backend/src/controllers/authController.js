const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');

const register = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('password_confirm').custom((value, { req }) => value === req.body.password).withMessage('Les mots de passe ne correspondent pas'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await User.findByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      const passwordHash = await hashPassword(req.body.password);
      const userId = await User.create(req.body.name, req.body.email, passwordHash);
      const user = await User.findById(userId);

      res.status(201).json({
        message: 'Inscription réussie',
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  }
];

const login = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findByEmail(req.body.email);
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const isValidPassword = await comparePassword(req.body.password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const token = generateToken(user);
      res.json({
        message: 'Connexion réussie',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  }
];

const forgotPassword = [
  body('email').isEmail().withMessage('Email invalide'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findByEmail(req.body.email);
      
      if (!user) {
        // Ne pas révéler si l'email existe ou non pour la sécurité
        return res.json({
          message: 'Si cet email est associé à un compte, vous recevrez un email de réinitialisation'
        });
      }

      // En production, générer un token et l'envoyer par email
      // Pour ce prototype, on simule juste l'envoi
      const resetToken = generateToken(user);
      
      console.log(`📧 Email de réinitialisation pour ${user.email}: ${resetToken}`);

      res.json({
        message: 'Email de réinitialisation envoyé'
      });

    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la réinitialisation' });
    }
  }
];

module.exports = {
  register,
  login,
  forgotPassword
};
