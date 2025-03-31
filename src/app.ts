import express from 'express'
import { globalErrorHandler } from './common/middlewares/globalErrorHandler'
import categoryRouter from './categories/category-router'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    // const err = createHttpError(401, 'can not access this path')
    // // next(err) // next me kuch bhi doge wo isko error type hi lega
    // throw(err)
    res.json({ message: 'hi its virat kohli' })
})

app.use('/categories', categoryRouter)

app.use(globalErrorHandler)
export default app
