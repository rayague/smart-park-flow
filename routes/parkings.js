/**
 * routes/parkings.js
 *
 * Endpoints MVP "parkings".
 *
 * Endpoints:
 * - GET /api/parkings        -> liste des parkings
 * - GET /api/parkings/:id    -> détail d'un parking
 *
 * TODO (plus tard):
 * - Brancher la DB (ex: Prisma) et remplacer les données statiques
 * - Ajouter filtres (ville, EV, prix, dispo), pagination, tri
 * - Ajouter disponibilité temps réel (WebSocket / polling)
 */

import { Router } from 'express';

const router = Router();

// Données statiques minimalistes (pour valider la connexion frontend <-> backend).
// IMPORTANT: ce n'est pas un "mock" fonctionnel final, juste un payload stable pour l'intégration.
const parkings = [
  {
    id: '1',
    nameEn: 'Modern Underground Garage',
    nameFr: 'Garage Souterrain Moderne',
    locationEn: 'Downtown Financial District',
    locationFr: 'Quartier Financier Centre-Ville',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    priceEn: '$3.50/hr',
    priceFr: '3,50€/h',
    hasEV: true,
    available: 34,
  },
  {
    id: '2',
    nameEn: 'EV Charging Hub',
    nameFr: 'Centre de Recharge VE',
    locationEn: 'Tech Campus',
    locationFr: 'Campus Technologique',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    priceEn: '$4.00/hr',
    priceFr: '4,00€/h',
    hasEV: true,
    available: 12,
  },
  {
    id: '3',
    nameEn: 'Sunset Mall Parking',
    nameFr: 'Parking Centre Commercial',
    locationEn: 'Shopping District',
    locationFr: 'Quartier Commercial',
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    priceEn: '$2.50/hr',
    priceFr: '2,50€/h',
    hasEV: false,
    available: 89,
  },
];

router.get('/parkings', (req, res) => {
  // Plus tard: récupérer depuis la DB
  res.json({ items: parkings });
});

router.get('/parkings/:id', (req, res) => {
  const parking = parkings.find((p) => p.id === req.params.id);

  if (!parking) {
    return res.status(404).json({ error: 'Parking not found' });
  }

  // Plus tard: enrichir (ex: coordonnées GPS, tarifs détaillés, bornes EV, etc.)
  res.json({ item: parking });
});

export default router;
