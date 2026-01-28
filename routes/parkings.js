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

function normalize(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function buildSuggestions() {
  const map = new Map();

  const add = (item) => {
    if (!item || !item.value) return;
    map.set(item.id, item);
  };

  for (const p of parkings) {
    add({
      id: `parking:${p.id}`,
      type: 'parking',
      value: p.nameFr,
      labelFr: p.nameFr,
      labelEn: p.nameEn,
      subtitleFr: p.locationFr,
      subtitleEn: p.locationEn,
      parkingId: p.id,
      priceFr: p.priceFr,
      priceEn: p.priceEn,
      available: p.available,
      hasEV: p.hasEV,
    });

    add({
      id: `district:fr:${p.locationFr}`,
      type: 'district',
      value: p.locationFr,
      labelFr: p.locationFr,
      labelEn: p.locationEn,
    });
  }

  // Exemple de structuration "city" en attendant une vraie DB.
  add({ id: 'city:Paris', type: 'city', value: 'Paris', labelFr: 'Paris', labelEn: 'Paris' });

  // Exemples "place" (landmarks) en attendant une vraie DB géographique.
  add({
    id: 'place:fr:Gare de Lyon',
    type: 'place',
    value: 'Gare de Lyon',
    labelFr: 'Gare de Lyon',
    labelEn: 'Gare de Lyon',
    subtitleFr: 'Paris',
    subtitleEn: 'Paris',
  });
  add({
    id: 'place:fr:Aéroport CDG',
    type: 'place',
    value: 'Aéroport CDG',
    labelFr: 'Aéroport CDG',
    labelEn: 'CDG Airport',
    subtitleFr: 'Paris',
    subtitleEn: 'Paris',
  });

  return Array.from(map.values());
}

const suggestionsIndex = buildSuggestions();

router.get('/parkings/suggestions', (req, res) => {
  const rawQuery = typeof req.query.query === 'string' ? req.query.query : '';
  const q = normalize(rawQuery);

  if (!q || q.length < 2) {
    return res.json({ items: [], query: rawQuery });
  }

  const scored = suggestionsIndex
    .map((s) => {
      const label = normalize(`${s.labelFr || ''} ${s.labelEn || ''} ${s.subtitleFr || ''} ${s.subtitleEn || ''}`);
      if (!label) return null;
      let score = 0;
      if (label.startsWith(q)) score += 3;
      if (label.includes(q)) score += 1;
      return score > 0 ? { s, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || String(a.s.labelFr).length - String(b.s.labelFr).length);

  const items = scored.slice(0, 8).map(({ s }) => s);
  return res.json({ items, query: rawQuery });
});

router.get('/parkings', (req, res) => {
  const rawQuery = typeof req.query.query === 'string' ? req.query.query : '';
  const query = rawQuery.trim().toLowerCase();

  const items = !query
    ? parkings
    : parkings.filter((p) => {
        const haystack = [p.nameEn, p.nameFr, p.locationEn, p.locationFr]
          .filter(Boolean)
          .join(' | ')
          .toLowerCase();
        return haystack.includes(query);
      });

  // Plus tard: récupérer depuis la DB (avec recherche serveur, pagination, etc.)
  res.json({ items, query: rawQuery, total: items.length });
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
