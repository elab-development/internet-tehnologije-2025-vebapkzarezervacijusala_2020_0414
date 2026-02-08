import { Router } from 'express';
import {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from '../controllers/building.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

/**
 * Public routes
 */
router.get('/', getAllBuildings);
router.get('/:id', getBuildingById);

/**
 * Admin routes
 */
router.post('/', requireAuth, requireRole('ADMIN'), createBuilding);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateBuilding);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteBuilding);

export default router;
