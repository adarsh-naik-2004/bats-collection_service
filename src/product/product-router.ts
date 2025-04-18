import express from 'express'
import fileUpload from 'express-fileupload'
import { asyncWrapper } from '../common/utils/asyncWrapper'
import getaccessToken from '../common/middlewares/getaccessToken'
import { canAccess } from '../common/middlewares/canAccess'
import { Roles } from '../common/constants'
import { ProductController } from './product-controller'
import createProductValidator from './create-product-validator'
import { ProductService } from './product-service'
import { S3Storage } from '../common/services/S3Storage'
import createHttpError from 'http-errors'
import updateProductValidator from './update-product-validator'
import { createMessageProducerBroker } from '../common/factories/brokerFactory'

const router = express.Router()

const productService = new ProductService()
const s3Storage = new S3Storage()
const broker = createMessageProducerBroker()

const productController = new ProductController(
    productService,
    s3Storage,
    broker,
)

router.post(
    '/',
    getaccessToken,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, 'File size exceeds the limit')
            next(error)
        },
    }),
    createProductValidator,
    asyncWrapper(productController.create),
)

router.put(
    '/:productId',
    getaccessToken,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, 'File size exceeds the limit')
            next(error)
        },
    }),
    updateProductValidator,
    asyncWrapper(productController.update),
)

router.get('/', asyncWrapper(productController.index))

export default router
