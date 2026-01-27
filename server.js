/**
 * server.js
 *
 * Point d'entrée du backend Express (isolé du frontend Next.js).
 *
 * Objectifs:
 * - Démarrer un serveur Express minimal et sûr
 * - Exposer des routes sous /api
 * - Autoriser le frontend Next.js via CORS (configurable)
 * - Préparer une structure propre pour ajouter plus tard:
 *   - Connexion base de données (ex: Prisma/Sequelize/Mongoose)
 *   - Endpoints: /api/parkings, /api/reservations, /api/users
 *
 * Démarrage:
 * - node server.js
 * - ou: npm run api
 *
 * Variables d'environnement (recommandé):
 * - PORT=4000
 * - CORS_ORIGIN=http://localhost:8080 (ou l'URL du frontend en prod)
 */

import express from 'express';
import cors from 'cors';

import { requestLogger } from './middlewares/logger.js';
import apiRouter from './routes/index.js';

const app = express();

// --- Config ---
const port = Number(process.env.PORT) || 4000;

// IMPORTANT:
// - En prod, mets ici ton domaine Next.js (ex: https://smartpark.example.com)
// - En dev, par défaut le Next tourne chez toi sur http://localhost:8080
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:8080';

// --- Middlewares ---
app.disable('x-powered-by');

// Logs des requêtes entrantes
app.use(requestLogger);

// JSON body parser (pour futurs POST/PUT/PATCH)
app.use(express.json({ limit: '1mb' }));

// CORS (minimal + sûr)
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// --- Routes ---
// Routes API (centralisées)
app.use('/api', apiRouter);

// 404 JSON pour les routes /api inconnues
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// --- Start ---
app.listen(port, () => {
  console.log(`[api] Express server listening on http://localhost:${port}`);
  console.log(`[api] Health check: http://localhost:${port}/api/health`);
  console.log(`[api] Parkings: http://localhost:${port}/api/parkings`);
  console.log(`[api] Reservations: http://localhost:${port}/api/reservations`);
  console.log(`[api] Me: http://localhost:${port}/api/users/me`);
  console.log(`[api] CORS allowed origin: ${corsOrigin}`);
});
