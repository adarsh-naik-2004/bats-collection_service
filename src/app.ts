import express, { Request, Response, Router } from 'express'

import cookieParser from 'cookie-parser'
import { globalErrorHandler } from './common/middlewares/globalErrorHandler'
import categoryRouter from './category/category-router'
import productRouter from './product/product-router'
import accessoryRouter from './accessory/accessory-router'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from catalog service!' })
})

app.use('/categories', categoryRouter as Router)
app.use('/products', productRouter)
app.use('/accessorys', accessoryRouter)

app.use(globalErrorHandler)

export default app
