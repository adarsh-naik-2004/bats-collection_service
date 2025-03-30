import express from 'express'
import { globalErrorHandler } from './common/middlewares/globalErrorHandler'

const app = express()

app.get('/', (req, res) => {
    // const err = createHttpError(401, 'can not access this path')
    // // next(err) // next me kuch bhi doge wo isko error type hi lega
    // throw(err)
    res.json({ message: 'hi its virat kohli' })
})

app.use(globalErrorHandler)
export default app
