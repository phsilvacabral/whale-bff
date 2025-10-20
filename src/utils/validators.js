import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nome deve ter pelo menos 2 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'any.required': 'Email é obrigatório'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter pelo menos 6 caracteres',
    'any.required': 'Senha é obrigatória'
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'any.required': 'Email é obrigatório'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Senha é obrigatória'
  })
});

export const portfolioSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nome do portfolio deve ter pelo menos 2 caracteres',
    'string.max': 'Nome do portfolio deve ter no máximo 100 caracteres',
    'any.required': 'Nome do portfolio é obrigatório'
  })
});

export const transactionSchema = Joi.object({
  symbol: Joi.string().min(2).max(10).required().messages({
    'string.min': 'Símbolo deve ter pelo menos 2 caracteres',
    'string.max': 'Símbolo deve ter no máximo 10 caracteres',
    'any.required': 'Símbolo é obrigatório'
  }),
  quantity: Joi.number().positive().required().messages({
    'number.positive': 'Quantidade deve ser positiva',
    'any.required': 'Quantidade é obrigatória'
  }),
  price_paid: Joi.number().positive().required().messages({
    'number.positive': 'Preço deve ser positivo',
    'any.required': 'Preço é obrigatório'
  }),
  date: Joi.date().iso().optional().messages({
    'date.format': 'Data deve estar no formato ISO'
  })
});

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Erro de validação',
        message: error.details[0].message,
        details: error.details
      });
    }
    next();
  };
};
