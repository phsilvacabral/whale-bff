import express from 'express';
import { aggregationController } from '../controllers/aggregationController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard/:portfolioId', authenticateToken, aggregationController.getDashboard);

export default router;
