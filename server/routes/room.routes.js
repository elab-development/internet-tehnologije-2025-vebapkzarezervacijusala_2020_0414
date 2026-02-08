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
 * Public routes
 */
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

/**
 * Admin routes
 */
router.post('/', requireAuth, requireRole('ADMIN'), createRoom);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateRoom);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteRoom);

export default router;
