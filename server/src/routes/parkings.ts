import { Router, Request, Response } from 'express';
import { parkings } from '../data/mock';
import { protect, authorize } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const statusUpdateSchema = z.object({
    status: z.enum(['active', 'maintenance']),
});

router.get('/', (req: Request, res: Response) => {
    res.json(parkings);
});

router.get('/:id', (req: Request, res: Response) => {
    const parking = parkings.find(p => p.id === req.params.id);
    if (!parking) return res.status(404).json({ message: 'Parking not found' });
    res.json(parking);
});

// Protected manager routes
router.put('/:id/status', protect, authorize('manager', 'admin'), (req: Request, res: Response) => {
    try {
        const { status } = statusUpdateSchema.parse(req.body);
        const parking = parkings.find(p => p.id === req.params.id);

        if (!parking) return res.status(404).json({ message: 'Parking not found' });

        // In real app, check if manager owns this parking
        parking.status = status;

        res.json({ message: 'Status updated successfully', parking });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
