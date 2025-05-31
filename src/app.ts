import express, { Request, Response, Router } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { globalErrorHandler } from './common/middlewares/globalErrorHandler'
import categoryRouter from './category/category-router'
import productRouter from './product/product-router'
import accessoryRouter from './accessory/accessory-router'
import { Config } from './config/index'

const app = express()
const ALLOWED_DOMAINS = [Config.frontend.clientUI, Config.frontend.adminUI]

app.use(cookieParser())

app.use(
    cors({
        origin: ALLOWED_DOMAINS as string[],
        credentials: true,
    }),
)

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from catalog service!' })
})

app.use('/categories', categoryRouter as Router)
app.use('/products', productRouter as Router)
app.use('/accessorys', accessoryRouter as Router)

app.use(globalErrorHandler)

export default app
