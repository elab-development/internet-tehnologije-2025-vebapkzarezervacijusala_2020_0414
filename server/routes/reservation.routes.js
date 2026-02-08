import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  getReservationsByRoomAndDate,
  createReservation,
  updateReservationTime,
  deleteReservation,
  getMyUpcomingReservations,
} from '../controllers/reservation.controller.js';

const router = Router();

/**
 * Any authenticated user can view reservations (but only by roomId+date).
 * GET /api/reservations?roomId=1&date=2026-02-07
 */
router.get('/', requireAuth, getReservationsByRoomAndDate);
router.get('/my-upcoming', requireAuth, getMyUpcomingReservations);

/**
 * Only USER role can create/update/delete (and only own reservation).
 */
router.post('/', requireAuth, requireRole('USER'), createReservation);
router.put('/:id', requireAuth, requireRole('USER'), updateReservationTime);
router.delete('/:id', requireAuth, requireRole('USER'), deleteReservation);

export default router;
