import axios from 'axios';

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://localhost:3001';

export const usersController = {
  async getProfile(req, res, next) {
    try {
      const { userId } = req.user;

      const response = await axios.get(`${USERS_SERVICE_URL}/api/users/${userId}`);
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { userId } = req.user;
      const { name, email } = req.body;

      const response = await axios.put(`${USERS_SERVICE_URL}/api/users/${userId}`, {
        name,
        email
      });

      res.json(response.data);
    } catch (error) {
      next(error);
    }
  }
};
