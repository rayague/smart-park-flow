/**
 * routes/users.js
 *
 * Endpoints MVP "users".
 *
 * Endpoint:
 * - GET /api/users/me -> infos utilisateur connecté
 *
 * TODO (plus tard):
 * - Brancher auth réelle (JWT/session) + DB
 * - Ajouter update profile, véhicules, préférences, etc.
 */

import { Router } from 'express';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/users/me', optionalAuth, (req, res) => {
  // Plus tard: charger l'utilisateur depuis la DB via req.user.id
  if (!req.user) return res.json({ user: null });

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: 'SmartPark User',
      role: req.user.role || 'user',
    },
  });
});

export default router;
