/**
 * middlewares/logger.js
 *
 * Middleware de logging minimal pour Express.
 * - Log chaque requête entrante (méthode, URL, status, durée)
 * - Utile en dev et en prod pour diagnostiquer rapidement
 */

export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl || req.url;

    // Exemple: 200 GET /api/health 2ms
    console.log(`${status} ${method} ${url} ${ms}ms`);
  });

  next();
}
