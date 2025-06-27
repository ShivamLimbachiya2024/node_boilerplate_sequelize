import Joi from 'joi';

export const userLoginSchema = Joi.object({
  email: Joi.string().trim().email().max(50).required(),
  password: Joi.string().trim().required(),
});

export const userValidationSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),

  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),

  email: Joi.string().email().required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/) // adjust to your preferred format
    .required(),

  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[0-9]/, 'number')
    .pattern(/[\W_]/, 'special character')
    .required(),
});
