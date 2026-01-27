/**
 * routes/reservations.js
 *
 * Endpoints MVP "reservations".
 *
 * Endpoints:
 * - GET   /api/reservations        -> liste des réservations de l'utilisateur
 * - POST  /api/reservations        -> créer une réservation
 * - PATCH /api/reservations/:id    -> modifier / annuler
 *
 * NOTE:
 * - Ces endpoints sont prêts pour React Query (GET = query, POST/PATCH = mutations).
 *
 * TODO (plus tard):
 * - Brancher DB et logique métier (vérif dispo, pricing, statuts)
 * - Ajouter validation (zod) et gestion d'erreurs structurée
 */

import { Router } from 'express';
import { optionalAuth, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/reservations', optionalAuth, (req, res) => {
  // Plus tard: SELECT * FROM reservations WHERE userId = req.user.id
  // Tant que le login n'est pas branché, on renvoie une liste vide si non authentifié.
  if (!req.user) return res.json({ items: [] });
  res.json({ items: [] });
});

router.post('/reservations', requireAuth, (req, res) => {
  // Body attendu (exemple):
  // { parkingId, startAt, endAt, vehiclePlate }
  // Plus tard: validation + création en DB

  const now = new Date().toISOString();

  res.status(201).json({
    reservation: {
      id: 'res_1',
      userId: req.user.id,
      status: 'confirmed',
      createdAt: now,
      ...req.body,
    },
  });
});

router.patch('/reservations/:id', requireAuth, (req, res) => {
  // Plus tard: update en DB + règles métier (annulation, extension, etc.)

  res.json({
    reservation: {
      id: req.params.id,
      userId: req.user.id,
      ...req.body,
      updatedAt: new Date().toISOString(),
    },
  });
});

export default router;
