import express from 'express';
import { transactionsController } from '../controllers/transactionsController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate, transactionSchema } from '../utils/validators.js';

const router = express.Router();

router.post('/', authenticateToken, validate(transactionSchema), transactionsController.addTransaction);
router.get('/:portfolioId', authenticateToken, transactionsController.getTransactions);
router.put('/:id', authenticateToken, validate(transactionSchema), transactionsController.updateTransaction);
router.delete('/:id', authenticateToken, transactionsController.deleteTransaction);

export default router;
