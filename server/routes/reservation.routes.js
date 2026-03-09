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
 * @openapi
 * /api/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Get reservations for room and date (auth required)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: roomId
 *         required: true
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, example: '2026-02-23' }
 *         description: Date only (YYYY-MM-DD) in UTC
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Reservation' }
 *       400:
 *         description: Missing/invalid query params
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/', requireAuth, getReservationsByRoomAndDate);

/**
 * @openapi
 * /api/reservations/my-upcoming:
 *   get:
 *     tags: [Reservations]
 *     summary: Get upcoming reservations for current user (auth required)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Reservation' }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/my-upcoming', requireAuth, getMyUpcomingReservations);

/**
 * @openapi
 * /api/reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Create reservation (USER only)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateReservationRequest' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation: { $ref: '#/components/schemas/Reservation' }
 *       400:
 *         description: Validation error (time range, working hours, etc.)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Overlap conflict
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Forbidden (USER role required)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/', requireAuth, requireRole('USER'), createReservation);

/**
 * @openapi
 * /api/reservations/{id}:
 *   put:
 *     tags: [Reservations]
 *     summary: Update reservation time (USER only, own reservation)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 100 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateReservationRequest' }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation: { $ref: '#/components/schemas/Reservation' }
 *       403:
 *         description: Not owner
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Overlap conflict
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.put('/:id', requireAuth, requireRole('USER'), updateReservationTime);

/**
 * @openapi
 * /api/reservations/{id}:
 *   delete:
 *     tags: [Reservations]
 *     summary: Delete reservation (USER only, own reservation)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 100 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Reservation deleted successfully. }
 *       403:
 *         description: Not owner
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.delete('/:id', requireAuth, requireRole('USER'), deleteReservation);

export default router;
