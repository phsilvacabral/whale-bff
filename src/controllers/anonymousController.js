export const anonymousController = {
  async exportPortfolio(req, res, next) {
    try {
      const { portfolio } = req.body;

      const exportData = {
        portfolio_name: portfolio.name,
        exported_at: new Date().toISOString(),
        version: '1.0',
        transactions: portfolio.transactions.map(t => ({
          id: t.id,
          symbol: t.symbol,
          quantity: t.quantity,
          price_paid: t.price_paid,
          date: t.date || t.created_at,
        })),
      };

      res.json({
        message: 'Portfolio exportado com sucesso',
        data: exportData
      });
    } catch (error) {
      next(error);
    }
  },

  async importPortfolio(req, res, next) {
    try {
      const { data } = req.body;

      // Validar estrutura
      if (!data.transactions || !Array.isArray(data.transactions)) {
        return res.status(400).json({
          error: 'Estrutura inválida',
          message: 'Falta array de transações'
        });
      }

      // Validar cada transação
      for (let i = 0; i < data.transactions.length; i++) {
        const t = data.transactions[i];
        if (!t.symbol || !t.quantity || !t.price_paid) {
          return res.status(400).json({
            error: 'Transação inválida',
            message: `Transação ${i + 1} inválida: faltam campos obrigatórios`
          });
        }
      }

      res.json({
        message: 'Portfolio importado com sucesso',
        portfolio: {
          name: data.portfolio_name || 'Portfolio Importado',
          transactions: data.transactions
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
