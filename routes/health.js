/**
 * routes/health.js
 *
 * Route de test pour valider que le backend Express fonctionne.
 *
 * Endpoint:
 * - GET /api/health -> { status: "ok" }
 *
 * Ajouter ici (ou dans d'autres fichiers) les futures routes:
 * - /api/parkings
 * - /api/reservations
 * - /api/users
 */

import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
