import express from 'express'
import { CategoryController } from './category-controller'
import categoryValidator from './category-validator'
import { CategoryService } from './category-service'
import logger from '../config/logger'
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

router.patch(
    '/:categoryId',
    getaccessToken,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryController.update),
)

router.delete(
    '/:categoryId',
    getaccessToken,
    canAccess([Roles.ADMIN]),
    asyncWrapper(categoryController.destroy),
)

router.get('/', asyncWrapper(categoryController.index))
router.get('/:categoryId', asyncWrapper(categoryController.getOne))

export default router
