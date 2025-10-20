import axios from 'axios';

const PORTFOLIO_SERVICE_URL = process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:3002';

export const transactionsController = {
  async addTransaction(req, res, next) {
    try {
      const { portfolio_id, symbol, quantity, price_paid, date } = req.body;
      const { userId } = req.user;

      const response = await axios.post(`${PORTFOLIO_SERVICE_URL}/api/transactions`, {
        portfolio_id,
        symbol: symbol.toUpperCase(),
        quantity: parseFloat(quantity),
        price_paid: parseFloat(price_paid),
        date: date || new Date().toISOString(),
        user_id: userId
      });

      res.status(201).json(response.data);
    } catch (error) {
      next(error);
    }
  },

  async getTransactions(req, res, next) {
    try {
      const { portfolioId } = req.params;
      const { userId } = req.user;

      const response = await axios.get(`${PORTFOLIO_SERVICE_URL}/api/transactions/portfolio/${portfolioId}`);
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  },

  async updateTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const { symbol, quantity, price_paid, date } = req.body;
      const { userId } = req.user;

      const response = await axios.put(`${PORTFOLIO_SERVICE_URL}/api/transactions/${id}`, {
        symbol: symbol.toUpperCase(),
        quantity: parseFloat(quantity),
        price_paid: parseFloat(price_paid),
        date,
        user_id: userId
      });

      res.json(response.data);
    } catch (error) {
      next(error);
    }
  },

  async deleteTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      await axios.delete(`${PORTFOLIO_SERVICE_URL}/api/transactions/${id}`, {
        data: { user_id: userId }
      });

      res.json({ message: 'Transação deletada com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};
