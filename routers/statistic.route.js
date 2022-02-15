import express from 'express'
import tryCatchWrapper from '../helpers/try.wrapper'
import statisticController from '../controllers/statistic.controller'
import {
  summaryValidation,
  categoryGroupValidation,
  itemsGroupValidation
} from '../middleware/statistic.validation'

const router = express.Router()

router.get('/summary', summaryValidation, tryCatchWrapper(statisticController.summary))

router.get('/category-grouping/profit/:date',
  categoryGroupValidation,
  tryCatchWrapper(statisticController.groupProfitByCategory))

router.get('/category-grouping/costs/:date',
  categoryGroupValidation,
  tryCatchWrapper(statisticController.groupCostsByCategory))

router.get('/items-grouping/:categoryId',
  itemsGroupValidation,
  tryCatchWrapper(statisticController.groupItems))

export default router
