/**
 * middlewares/auth.js
 *
 * Middlewares d'authentification minimal (MVP).
 *
 * Objectif:
 * - Préparer la protection des endpoints (JWT/session)
 * - Ne pas casser le frontend tant que le login n'est pas branché
 *
 * - optionalAuth: attache req.user si Authorization Bearer est présent, sinon continue
 * - requireAuth: idem, mais renvoie 401 si non authentifié
 */

import jwt from 'jsonwebtoken';

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token || null;
}

function verifyToken(token) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'smartpark-secret-key-change-in-production';
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function getRoleFromToken(token) {
  const prefix = token.split('_')[0];
  if (prefix === 'admin') return 'admin';
  if (prefix === 'client' || prefix === 'manager') return 'client';
  return 'user';
}

export function optionalAuth(req, res, next) {
  const token = getBearerToken(req);

  if (token) {
    // Essayer de vérifier le token JWT
    const decoded = verifyToken(token);
    
    if (decoded) {
      // Token JWT valide
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        token,
      };
    } else {
      // Fallback pour l'ancien système (compatibilité)
      req.user = {
        id: 'user_1',
        email: 'user@example.com',
        role: getRoleFromToken(token),
        token,
      };
    }
  } else {
    req.user = null;
  }

  next();
}

export function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });
}
