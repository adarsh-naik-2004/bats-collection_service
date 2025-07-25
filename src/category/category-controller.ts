import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { Category } from './category-types'
import { CategoryService } from './category-service'
import { Logger } from 'winston'

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {
        this.create = this.create.bind(this)
        this.index = this.index.bind(this)
        this.getOne = this.getOne.bind(this)
        this.update = this.update.bind(this)
        this.destroy = this.destroy.bind(this)
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
        }
        const { name, priceConfiguration, attributes } = req.body as Category

        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        })

        this.logger.info(`Created category`, { id: category._id })
        res.json({ id: category._id })
    }

    async index(req: Request, res: Response) {
        // const sleep = (ms: number) =>
        //     new Promise((resolve) => setTimeout(resolve, ms));
        // await sleep(5000);
        const categories = await this.categoryService.getAll()
        this.logger.info(`Getting categories list`)
        res.json(categories)
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params
        const category = await this.categoryService.getOne(categoryId)
        if (!category) {
            return next(createHttpError(404, 'Category not found'))
        }
        this.logger.info(`Getting category`, { id: category._id })
        res.json(category)
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
        }

        const { categoryId } = req.params
        const updateData = req.body as Partial<Category>

        const updatedCategory = await this.categoryService.update(
            categoryId,
            updateData,
        )

        if (!updatedCategory) {
            return next(createHttpError(404, 'Category not found'))
        }

        this.logger.info(`Updated category`, { id: updatedCategory._id })
        res.json(updatedCategory)
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params
        const category = await this.categoryService.destroy(categoryId)

        if (!category) {
            return next(createHttpError(404, 'Category not found'))
        }

        this.logger.info(`Deleted category`, { id: categoryId })
        res.json({ message: 'Category deleted successfully' })
    }
}
