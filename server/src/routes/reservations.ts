import { Router, Request, Response } from 'express';
import { reservations } from '../data/mock';
import { protect } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const reservationSchema = z.object({
    parkingId: z.string(),
    parkingName: z.string(),
    spotId: z.string(),
    spotNumber: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    totalPrice: z.number(),
    vehiclePlate: z.string(),
    isEv: z.boolean().optional().default(false),
});

router.get('/', protect, (req: Request, res: Response) => {
    // Filter by user ID from token
    const userReservations = reservations.filter(r => r.userId === req.user?.id);
    res.json(userReservations);
});

router.post('/', protect, (req: Request, res: Response) => {
    try {
        const validatedData = reservationSchema.parse(req.body);

        // Simple conflict check (mock)
        const hasConflict = reservations.some(r =>
            r.spotId === validatedData.spotId &&
            r.status !== 'cancelled' &&
            ((new Date(validatedData.startTime) < new Date(r.endTime)) &&
                (new Date(validatedData.endTime) > new Date(r.startTime)))
        );

        if (hasConflict) {
            return res.status(400).json({ message: 'Spot is already booked for this time range' });
        }

        const newReservation = {
            id: 'r' + (reservations.length + 1),
            userId: req.user?.id as string,
            ...validatedData,
            status: 'pending'
        };

        reservations.push(newReservation as any);
        res.status(201).json(newReservation);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
