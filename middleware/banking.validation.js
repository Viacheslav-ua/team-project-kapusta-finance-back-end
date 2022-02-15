import Joi from 'joi'
import ApiError from '../exceptions/api.error'

export const insertValidation = async (req, res, next) => {
  const date =  new Date(req.body.dateTransaction)
  date.setHours(12)
  req.body.dateTransaction = date
  const schema = Joi.object({
    categoryId: Joi.string().length(24).pattern(/^[0-9a-f]*$/).required(),
    dateTransaction: Joi.date(),
    description: Joi.string().max(255).trim().required(),
    categoryName: Joi.string().max(255).trim(),
    amount: Joi.number().min(0).max(10000000).required(),
    isProfit: Joi.boolean().required(),
  })
  try {
    await schema.validateAsync(req.body)
  } catch (e) {
    return next(ApiError.BadRequest(e.details[0].message))
  }
  next()
}

export const idValidation = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).pattern(/^[0-9a-f]*$/)
  });
  try {
    await schema.validateAsync(req.params)
  } catch (e) {
    return next(ApiError.BadRequest(e.details[0].message))
  }
  next()
}