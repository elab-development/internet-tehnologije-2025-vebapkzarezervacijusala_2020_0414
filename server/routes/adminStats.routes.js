import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getAdminStats } from '../controllers/adminStats.controller.js';

const router = Router();

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard stats (KPIs + chart datasets)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema: { type: integer, example: 30, minimum: 1, maximum: 365 }
 *         description: Number of days for reservationsPerDay chart (default 30, max 365)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AdminStatsResponse' }
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized (missing/invalid cookie)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Forbidden (ADMIN only)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/stats', requireAuth, requireRole('ADMIN'), getAdminStats);

export default router;
