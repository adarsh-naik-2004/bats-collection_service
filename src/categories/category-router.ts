import express from 'express'
import { CategoryService } from './category-service'
import { CategoryController } from './category-controller'
import logger from '../config/logger'
import categoryValidator from './category-validator'
import { asyncWrapper } from '../common/utils/asyncWrapper'
import getaccessToken from '../common/middlewares/getaccessToken'
import { canAccess } from '../common/middlewares/canAccess'
import { Roles } from '../common/constants'

const router = express.Router()

const categoryService = new CategoryService()
const categoryController = new CategoryController(categoryService, logger)

router.post(
    '/',
    getaccessToken,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryController.create),
)

export default router
