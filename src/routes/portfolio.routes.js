import express from 'express';
import { portfolioController } from '../controllers/portfolioController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate, portfolioSchema } from '../utils/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/portfolio:
 *   post:
 *     summary: Criar novo portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *     responses:
 *       201:
 *         description: Portfolio criado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post('/', authenticateToken, validate(portfolioSchema), portfolioController.createPortfolio);

/**
 * @swagger
 * /api/portfolio:
 *   get:
 *     summary: Listar portfolios do usuário
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de portfolios
 */
router.get('/', authenticateToken, portfolioController.getPortfolios);

/**
 * @swagger
 * /api/portfolio/{id}:
 *   get:
 *     summary: Obter portfolio por ID
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do portfolio
 *       404:
 *         description: Portfolio não encontrado
 */
router.get('/:id', authenticateToken, portfolioController.getPortfolio);

/**
 * @swagger
 * /api/portfolio/{id}:
 *   put:
 *     summary: Atualizar portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: Portfolio atualizado com sucesso
 *       404:
 *         description: Portfolio não encontrado
 */
router.put('/:id', authenticateToken, validate(portfolioSchema), portfolioController.updatePortfolio);

/**
 * @swagger
 * /api/portfolio/{id}:
 *   delete:
 *     summary: Deletar portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portfolio deletado com sucesso
 *       404:
 *         description: Portfolio não encontrado
 */
router.delete('/:id', authenticateToken, portfolioController.deletePortfolio);

export default router;
