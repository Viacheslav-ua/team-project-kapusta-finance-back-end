import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi  from 'swagger-ui-express'

import errorMiddleware from './middleware/error.middleware'
import authRouter from './routers/auth.route'
import bankingRouter from './routers/banking.route'
import statisticRouter from './routers/statistic.route'
import pkg from './json/openapi.json'
import guard from './middleware/guard.middleware'

const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/banking', guard, bankingRouter)
app.use('/api/statistic', guard, statisticRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(pkg))

app.use(errorMiddleware)

export default app