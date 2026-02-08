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
 * Public routes
 */
router.get('/', getAllRoomTypes);
router.get('/:id', getRoomTypeById);

/**
 * Admin routes
 */
router.post('/', requireAuth, requireRole('ADMIN'), createRoomType);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateRoomType);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteRoomType);

export default router;
