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

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token || null;
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
    // NOTE: Pour l'instant on ne valide pas le token (pas de DB / auth réelle).
    // Plus tard: vérifier JWT + charger user depuis la DB.
    req.user = {
      id: 'user_1',
      email: 'user@example.com',
      role: getRoleFromToken(token),
      token,
    };
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
