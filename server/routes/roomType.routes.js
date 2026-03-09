import { Router } from 'express';
import {
  getAllRoomTypes,
  getRoomTypeById,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from '../controllers/roomType.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * /api/room-types:
 *   get:
 *     tags: [RoomTypes]
 *     summary: List room types (public)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomTypes:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/RoomType' }
 */
router.get('/', getAllRoomTypes);

/**
 * @openapi
 * /api/room-types/{id}:
 *   get:
 *     tags: [RoomTypes]
 *     summary: Get room type by id (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomType: { $ref: '#/components/schemas/RoomType' }
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
router.get('/:id', getRoomTypeById);

/**
 * @openapi
 * /api/room-types:
 *   post:
 *     tags: [RoomTypes]
 *     summary: Create room type (ADMIN only)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateRoomTypeRequest' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomType: { $ref: '#/components/schemas/RoomType' }
 *       409:
 *         description: Duplicate name
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/', requireAuth, requireRole('ADMIN'), createRoomType);

/**
 * @openapi
 * /api/room-types/{id}:
 *   put:
 *     tags: [RoomTypes]
 *     summary: Update room type (ADMIN only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateRoomTypeRequest' }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomType: { $ref: '#/components/schemas/RoomType' }
 *       409:
 *         description: Duplicate name
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.put('/:id', requireAuth, requireRole('ADMIN'), updateRoomType);

/**
 * @openapi
 * /api/room-types/{id}:
 *   delete:
 *     tags: [RoomTypes]
 *     summary: Delete room type (ADMIN only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Room type deleted successfully. }
 */
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteRoomType);

export default router;
