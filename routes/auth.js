import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// Secret JWT (en production, utiliser une variable d'environnement)
const JWT_SECRET = process.env.JWT_SECRET || 'smartpark-secret-key-change-in-production';

// Base de données temporaire en mémoire (remplacer par une vraie DB plus tard)
const users = [];

// Validation des champs selon le rôle
function validateRegisterData(data, role) {
  const errors = [];
  
  // Champs communs
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Le nom complet doit contenir au moins 2 caractères');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('L\'email n\'est pas valide');
  }
  
  if (!data.password || data.password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  if (data.password !== data.confirmPassword) {
    errors.push('Les mots de passe ne correspondent pas');
  }
  
  // Champs spécifiques au rôle
  if (role === 'client') {
    if (!data.vehiclePlate || data.vehiclePlate.trim().length < 2) {
      errors.push('La plaque d\'immatriculation est requise');
    }
    if (!data.vehicleType || data.vehicleType.trim().length < 2) {
      errors.push('Le type de véhicule est requis');
    }
  } else if (role === 'user') {
    if (!data.businessName || data.businessName.trim().length < 2) {
      errors.push('Le nom de l\'entreprise est requis');
    }
    if (!data.phone || data.phone.trim().length < 6) {
      errors.push('Le numéro de téléphone est requis');
    }
    if (!data.country || data.country.trim().length < 2) {
      errors.push('Le pays est requis');
    }
    if (!data.city || data.city.trim().length < 2) {
      errors.push('La ville est requise');
    }
  }
  
  return errors;
}

// Vérifier si un email existe déjà
function findUserByEmail(email) {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Créer un token JWT
function createToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

router.post('/auth/login', (req, res) => {
  const { email } = req.body ?? {};

  const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

  const role = normalizedEmail.includes('admin')
    ? 'admin'
    : normalizedEmail.includes('client') || normalizedEmail.includes('manager')
      ? 'client'
      : 'user';

  const token = `${role}_${Date.now()}`;

  res.json({
    token,
    user: {
      id: 'user_1',
      email: normalizedEmail || 'user@example.com',
      name: 'SmartPark User',
      role,
    },
  });
});

router.post('/auth/register', async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      password,
      confirmPassword,
      phone,
      country,
      city,
      businessName,
      vehiclePlate,
      vehicleType,
      evDriver
    } = req.body;

    // Validation des données
    const errors = validateRegisterData(req.body, role);
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }

    // Vérifier si l'email existe déjà
    if (findUserByEmail(email)) {
      return res.status(409).json({ 
        error: 'Email already exists' 
      });
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer l'utilisateur
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      // Champs spécifiques au rôle
      ...(role === 'client' && {
        vehiclePlate: vehiclePlate.trim(),
        vehicleType: vehicleType.trim(),
        evDriver: Boolean(evDriver)
      }),
      ...(role === 'user' && {
        businessName: businessName.trim(),
        phone: phone.trim(),
        country: country.trim(),
        city: city.trim()
      })
    };

    // Sauvegarder l'utilisateur (en mémoire pour l'instant)
    users.push(user);

    // Créer le token JWT
    const token = createToken(user);

    // Retourner la réponse sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router;
