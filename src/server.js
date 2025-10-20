import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Import routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import transactionsRoutes from './routes/transactions.routes.js';
import aggregationRoutes from './routes/aggregation.routes.js';
import anonymousRoutes from './routes/anonymous.routes.js';
import cryptoRoutes from './routes/crypto.routes.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Whale BFF API',
      version: '1.0.0',
      description: 'Backend for Frontend API para o sistema Whale',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174', // Dashboard MFE
    'http://localhost:5175'  // Shell App
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint - API information
app.get('/', (req, res) => {
  res.json({
    message: '🐋 Whale BFF API',
    version: '1.0.0',
    description: 'Backend for Frontend API para o sistema Whale',
    endpoints: {
      health: '/health',
      documentation: '/api-docs',
      auth: '/api/auth',
      users: '/api/users',
      portfolio: '/api/portfolio',
      transactions: '/api/transactions',
      aggregation: '/api/aggregation',
      anonymous: '/api/anonymous',
      crypto: '/api/crypto'
    },
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'whale-bff'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/aggregation', aggregationRoutes);
app.use('/api/anonymous', anonymousRoutes);
app.use('/api/crypto', cryptoRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    path: req.originalUrl 
  });
});

app.listen(PORT, () => {
  console.log(`🐋 Whale BFF rodando na porta ${PORT}`);
  console.log(`📚 Documentação disponível em http://localhost:${PORT}/api-docs`);
});

export default app;
