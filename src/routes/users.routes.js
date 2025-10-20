import express from 'express';
import { usersController } from '../controllers/usersController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, usersController.getProfile);
router.put('/profile', authenticateToken, usersController.updateProfile);

export default router;
