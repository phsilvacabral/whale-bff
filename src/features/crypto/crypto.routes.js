import express from 'express';
import { getTopCryptos } from './crypto.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Crypto
 *   description: Endpoints relacionados a criptomoedas
 */

// GET /api/crypto/top - Busca as principais criptomoedas
router.get('/top', getTopCryptos);

export default router;
