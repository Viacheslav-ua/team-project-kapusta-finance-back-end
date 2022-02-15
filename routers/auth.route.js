import express from 'express'
import tryCatchWrapper from '../helpers/try.wrapper'
import userController from '../controllers/user.controller'
import {authValidation} from '../middleware/user.validation'
import guard from '../middleware/guard.middleware'

const router = express.Router()

router.post('/registration', authValidation, tryCatchWrapper(userController.registration))

router.post('/login', tryCatchWrapper(userController.login))

router.post('/logout', guard, tryCatchWrapper(userController.logout))

router.get('/refresh', tryCatchWrapper(userController.refresh))

router.get('/users', guard, tryCatchWrapper(userController.getUsers))

router.get('/google', tryCatchWrapper(userController.googleAuth))

router.get('/google-redirect', tryCatchWrapper(userController.googleRedirect))



export default router
