import Joi from 'joi'
import ApiError from '../exceptions/api.error'

export const summaryValidation = async (req, res, next) => {
  const schema = Joi.object({
    countMonths: Joi.number().max(30),
  })
  try {
    await schema.validateAsync(req.query)
  } catch (e) {
    return next(ApiError.BadRequest(e.details[0].message))
  }
  next()
}
export const categoryGroupValidation = async (req, res, next) => {
  const schema = Joi.object({
    date: Joi.string().max(20).required(),
  })
  try {
    await schema.validateAsync(req.params)
  } catch (e) {
    return next(ApiError.BadRequest(e.details[0].message))
  }
   next()
}

export const itemsGroupValidation = async (req, res, next) => {
  const schema = Joi.object({
    categoryId: Joi.string().length(24).pattern(/^[0-9a-f]*$/).required(),
  })
  try {
    await schema.validateAsync(req.params)
  } catch (e) {
    return next(ApiError.BadRequest(e.details[0].message))
  }
   next()
}