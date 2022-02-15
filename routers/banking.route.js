import express from 'express'
import tryCatchWrapper from '../helpers/try.wrapper'
import userController from '../controllers/user.controller'
import bankingController from '../controllers/banking.controller'
import {resetBalanceValidation} from '../middleware/user.validation'
import { insertValidation, idValidation } from '../middleware/banking.validation'

const router = express.Router()

router.patch('/reset-balance', resetBalanceValidation, tryCatchWrapper(userController.resetBalance))

router.post('/add-transaction', insertValidation, tryCatchWrapper(bankingController.insert))

router.get('/get-category', tryCatchWrapper(bankingController.getCategory))

router.get('/get-transactions', tryCatchWrapper(bankingController.getTransactions))

router.delete('/remove-transaction/:id', idValidation, tryCatchWrapper(bankingController.remove))

export default router