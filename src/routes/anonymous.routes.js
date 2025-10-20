import express from 'express';
import { anonymousController } from '../controllers/anonymousController.js';

const router = express.Router();

router.post('/export', anonymousController.exportPortfolio);
router.post('/import', anonymousController.importPortfolio);

export default router;
