import axios from 'axios';

const PORTFOLIO_SERVICE_URL = process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:3002';

export const portfolioController = {
  async createPortfolio(req, res, next) {
    try {
      const { name } = req.body;
      const { userId } = req.user;

      const response = await axios.post(`${PORTFOLIO_SERVICE_URL}/api/portfolio`, {
        name,
        user_id: userId
      });

      res.status(201).json(response.data);
    } catch (error) {
      next(error);
    }
  },

  async getPortfolios(req, res, next) {
    try {
      const { userId } = req.user;

      const response = await axios.get(`${PORTFOLIO_SERVICE_URL}/api/portfolio/user/${userId}`);
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  },

  async getPortfolio(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      const response = await axios.get(`${PORTFOLIO_SERVICE_URL}/api/portfolio/${id}`);
      
      // Verificar se o portfolio pertence ao usuário
      if (response.data.user_id !== userId) {
        return res.status(403).json({
          error: 'Acesso negado',
          message: 'Você não tem permissão para acessar este portfolio'
        });
      }

      res.json(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return res.status(404).json({
          error: 'Portfolio não encontrado',
          message: 'O portfolio solicitado não existe'
        });
      }
      next(error);
    }
  },

  async updatePortfolio(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const { userId } = req.user;

      // Verificar se o portfolio pertence ao usuário
      const portfolioResponse = await axios.get(`${PORTFOLIO_SERVICE_URL}/api/portfolio/${id}`);
      if (portfolioResponse.data.user_id !== userId) {
        return res.status(403).json({
          error: 'Acesso negado',
          message: 'Você não tem permissão para editar este portfolio'
        });
      }

      const response = await axios.put(`${PORTFOLIO_SERVICE_URL}/api/portfolio/${id}`, {
        name
      });

      res.json(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return res.status(404).json({
          error: 'Portfolio não encontrado',
          message: 'O portfolio solicitado não existe'
        });
      }
      next(error);
    }
  },

  async deletePortfolio(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      // Verificar se o portfolio pertence ao usuário
      const portfolioResponse = await axios.get(`${PORTFOLIO_SERVICE_URL}/api/portfolio/${id}`);
      if (portfolioResponse.data.user_id !== userId) {
        return res.status(403).json({
          error: 'Acesso negado',
          message: 'Você não tem permissão para deletar este portfolio'
        });
      }

      await axios.delete(`${PORTFOLIO_SERVICE_URL}/api/portfolio/${id}`);

      res.json({
        message: 'Portfolio deletado com sucesso'
      });
    } catch (error) {
      if (error.response?.status === 404) {
        return res.status(404).json({
          error: 'Portfolio não encontrado',
          message: 'O portfolio solicitado não existe'
        });
      }
      next(error);
    }
  }
};
