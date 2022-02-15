import Joi from 'joi'
import ApiError from '../exceptions/api.error'

export const authValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(24),
  })
  try {
    await schema.validateAsync(req.body)
  } catch (e) {
    return next(ApiError.BadRequest(e.details[0].message))
  }
  next()
}

export const resetBalanceValidation = async (req, res, next) => {
  const schema = Joi.object({
    balance: Joi.number().min(-10000000).max(10000000).required(),
  })
  try {
    await schema.validateAsync(req.body)
  } catch (e) {
    return next(ApiError.BadRequest(e.details[0].message))
  }
  next()
}