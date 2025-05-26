import express, { Request, Response, Router } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { globalErrorHandler } from './common/middlewares/globalErrorHandler'
import categoryRouter from './category/category-router'
import productRouter from './product/product-router'
import accessoryRouter from './accessory/accessory-router'
import config from 'config'

const app = express()
const ALLOWED_DOMAINS = [
    config.get<string>('frontend.clientUI'),
    config.get<string>('frontend.adminUI'),
]

app.use(
    cors({
        origin: ALLOWED_DOMAINS,
    }),
)
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
