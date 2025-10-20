export default (err, req, res, next) => {
  console.error('Error:', err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'Token de autenticação inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      message: 'Token de autenticação expirado'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      message: err.message,
      details: err.details
    });
  }

  // Database errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Serviço indisponível',
      message: 'Erro de conexão com o banco de dados'
    });
  }

  // Default error
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(status).json({
    error: 'Erro interno',
    message: process.env.NODE_ENV === 'production' ? 'Algo deu errado' : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
