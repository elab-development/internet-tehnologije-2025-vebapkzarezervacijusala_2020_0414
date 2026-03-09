import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getAdminStats } from '../controllers/adminStats.controller.js';

const router = Router();

/**
 * Admin dashboard stats
 * GET /api/admin/stats?days=30
 */
router.get('/stats', requireAuth, requireRole('ADMIN'), getAdminStats);

export default router;
