/**
 * routes/index.js
 *
 * Routeur central du backend.
 *
 * Ici on enregistre toutes les routes /api de manière organisée.
 *
 * Exemple d'extension future:
 * - import parkingsRouter from './parkings.js'
 * - router.use(parkingsRouter)
 */

import { Router } from 'express';

import authRouter from './auth.js';
import healthRouter from './health.js';
import parkingsRouter from './parkings.js';
import reservationsRouter from './reservations.js';
import usersRouter from './users.js';

const router = Router();

// Routes techniques
router.use(healthRouter);

// Auth (MVP)
router.use(authRouter);

// Routes MVP "smart parking"
router.use(parkingsRouter);
router.use(reservationsRouter);
router.use(usersRouter);

export default router;
