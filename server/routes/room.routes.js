import { Router } from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/room.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * /api/rooms:
 *   get:
 *     tags: [Rooms]
 *     summary: List rooms (public) with optional filters
 *     parameters:
 *       - in: query
 *         name: buildingId
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: roomTypeId
 *         schema: { type: integer, example: 2 }
 *       - in: query
 *         name: minCapacity
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: maxCapacity
 *         schema: { type: integer, example: 50 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rooms:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Room' }
 *       400:
 *         description: Invalid filters
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/', getAllRooms);

/**
 * @openapi
 * /api/rooms/{id}:
 *   get:
 *     tags: [Rooms]
 *     summary: Get room by id (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 10 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room: { $ref: '#/components/schemas/Room' }
 *       400:
 *         description: Invalid id
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:id', getRoomById);

/**
 * @openapi
 * /api/rooms:
 *   post:
 *     tags: [Rooms]
 *     summary: Create room (ADMIN only)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateRoomRequest' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room: { $ref: '#/components/schemas/Room' }
 */
router.post('/', requireAuth, requireRole('ADMIN'), createRoom);

/**
 * @openapi
 * /api/rooms/{id}:
 *   put:
 *     tags: [Rooms]
 *     summary: Update room (ADMIN only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 10 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateRoomRequest' }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room: { $ref: '#/components/schemas/Room' }
 */
router.put('/:id', requireAuth, requireRole('ADMIN'), updateRoom);

/**
 * @openapi
 * /api/rooms/{id}:
 *   delete:
 *     tags: [Rooms]
 *     summary: Delete room (ADMIN only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 10 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Room deleted successfully. }
 */
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteRoom);

export default router;
