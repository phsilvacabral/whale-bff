import jwt from 'jsonwebtoken';
import axios from 'axios';

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://localhost:3001';

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Delegar criação ao microserviço de usuários (faz hashing e validação)
      const response = await axios.post(`${USERS_SERVICE_URL}/api/Auth/register`, {
        name,
        email,
        password
      });

      const user = response.data;

      // Gerar JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          name: user.name 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        },
        token
      });
    } catch (error) {
      if (error.response?.status === 409) {
        return res.status(409).json({
          error: 'Email já cadastrado',
          message: 'Este email já está sendo usado por outro usuário'
        });
      }
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Delegar login ao microserviço de usuários (faz verificação e atualiza último login)
      const response = await axios.post(`${USERS_SERVICE_URL}/api/Auth/login`, {
        email,
        password
      });
      const user = response.data;

      // Gerar JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          name: user.name 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        },
        token
      });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        return res.status(401).json({
          error: 'Credenciais inválidas',
          message: 'Email ou senha incorretos'
        });
      }
      next(error);
    }
  },

  async getCurrentUser(req, res, next) {
    try {
      const { userId } = req.user;

      // Buscar dados atualizados do usuário
      const response = await axios.get(`${USERS_SERVICE_URL}/api/users/${userId}`);
      const user = response.data;

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        last_login: user.last_login
      });
    } catch (error) {
      next(error);
    }
  }
};
