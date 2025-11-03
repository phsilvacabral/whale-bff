import express from 'express';
import { anonymousController } from './anonymous.controller.js';

const router = express.Router();

router.post('/export', anonymousController.exportPortfolio);
router.post('/import', anonymousController.importPortfolio);

export default router;
