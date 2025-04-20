import express from 'express'
import fileUpload from 'express-fileupload'
import { asyncWrapper } from '../common/utils/asyncWrapper'
import getaccessToken from '../common/middlewares/getaccessToken'
import { canAccess } from '../common/middlewares/canAccess'
import { Roles } from '../common/constants'
import { S3Storage } from '../common/services/S3Storage'
import createHttpError from 'http-errors'
import createAccessoryValidator from './create-accessory-validator'
import { AccessoryService } from './accessory-service'
import { AccessoryController } from './accessory-controller'
import { createMessageProducerBroker } from '../common/factories/brokerFactory'

const router = express.Router()

const accessoryService = new AccessoryService()
const broker = createMessageProducerBroker()

const accessoryController = new AccessoryController(
    new S3Storage(),
    accessoryService,
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
    createAccessoryValidator,
    asyncWrapper(accessoryController.create),
)

router.get('/', asyncWrapper(accessoryController.get))

export default router
