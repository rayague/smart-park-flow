import { Router } from 'express';

const router = Router();

router.post('/auth/login', (req, res) => {
  const { email } = req.body ?? {};

  const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

  const role = normalizedEmail.includes('admin')
    ? 'admin'
    : normalizedEmail.includes('client') || normalizedEmail.includes('manager')
      ? 'client'
      : 'user';

  const token = `${role}_${Date.now()}`;

  res.json({
    token,
    user: {
      id: 'user_1',
      email: normalizedEmail || 'user@example.com',
      name: 'SmartPark User',
      role,
    },
  });
});

export default router;
