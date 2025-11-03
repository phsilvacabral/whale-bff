import axios from 'axios';

const PORTFOLIO_SERVICE_URL = process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:3002';

export const aggregationController = {
  async getDashboard(req, res, next) {
    try {
      const { portfolioId } = req.params;
      const { userId } = req.user;

      // Buscar transações do portfolio
      const transactionsResponse = await axios.get(`${PORTFOLIO_SERVICE_URL}/api/transactions/portfolio/${portfolioId}`);
      const transactions = transactionsResponse.data;

      // Calcular estatísticas
      const totalValue = transactions.reduce((sum, tx) => sum + (tx.quantity * tx.price_paid), 0);
      const uniqueCryptos = new Set(transactions.map(tx => tx.symbol)).size;
      const totalTransactions = transactions.length;

      // Agrupar por criptomoeda
      const cryptoSummary = transactions.reduce((acc, tx) => {
        if (!acc[tx.symbol]) {
          acc[tx.symbol] = {
            symbol: tx.symbol,
            totalQuantity: 0,
            totalInvested: 0,
            transactions: 0
          };
        }
        acc[tx.symbol].totalQuantity += tx.quantity;
        acc[tx.symbol].totalInvested += tx.quantity * tx.price_paid;
        acc[tx.symbol].transactions += 1;
        return acc;
      }, {});

      res.json({
        portfolio_id: portfolioId,
        summary: {
          total_value: totalValue,
          unique_cryptos: uniqueCryptos,
          total_transactions: totalTransactions
        },
        crypto_summary: Object.values(cryptoSummary),
        transactions: transactions
      });
    } catch (error) {
      next(error);
    }
  }
};
