import { NextFunction, Response } from 'express'
import { Request } from 'express-jwt'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { ProductService } from './product-service'
import { Filter, Product } from './product-types'
import { FileStorage } from '../common/types/storage'
import { UploadedFile } from 'express-fileupload'
import { AuthRequest } from '../common/types'
import { Roles } from '../common/constants'
import mongoose from 'mongoose'

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
    ) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
        }

        const image = req.files!.image as UploadedFile
        const imageName = uuidv4()

        await this.storage.upload({
            filename: imageName,
            fileData: image.data.buffer,
        })

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            storeId,
            categoryId,
            isPublish,
        } = req.body

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            storeId,
            categoryId,
            isPublish,
            image: imageName,
        }

        const newProduct = await this.productService.createProduct(
            product as unknown as Product,
        )

        res.json({ id: newProduct._id })
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
        }

        const { productId } = req.params

        const product = await this.productService.getProduct(productId)
        if (!product) {
            return next(createHttpError(404, 'Product not found'))
        }

        if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
            const store = (req as AuthRequest).auth.store
            if (product.storeId !== store) {
                return next(
                    createHttpError(
                        403,
                        'You are not allowed to access this product',
                    ),
                )
            }
        }

        let imageName: string | undefined
        let oldImage: string | undefined

        if (req.files?.image) {
            oldImage = product.image

            const image = req.files.image as UploadedFile
            imageName = uuidv4()

            await this.storage.upload({
                filename: imageName,
                fileData: image.data.buffer,
            })

            await this.storage.delete(oldImage)
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            storeId,
            categoryId,
            isPublish,
        } = req.body

        const productToUpdate = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            storeId,
            categoryId,
            isPublish,
            image: imageName ? imageName : (oldImage as string),
        }

        await this.productService.updateProduct(productId, productToUpdate)

        res.json({ id: productId })
    }

    index = async (req: Request, res: Response) => {
        const { q, storeId, categoryId, isPublish } = req.query

        const filters: Filter = {}

        if (isPublish === 'true') {
            filters.isPublish = true
        }

        if (storeId) filters.storeId = storeId as string

        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filters.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            )
        }

        const products = await this.productService.getProducts(
            q as string,
            filters,
            {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit
                    ? parseInt(req.query.limit as string)
                    : 10,
            },
        )

        const finalProducts = (products.data as Product[]).map(
            (product: Product) => {
                return {
                    ...product,
                    image: this.storage.getObjectUri(product.image),
                }
            },
        )

        res.json({
            data: finalProducts,
            total: products.total,
            pageSize: products.limit,
            currentPage: products.page,
        })
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params

        if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
            return next(createHttpError(403, 'Only admins can delete products'))
        }

        const product = await this.productService.getProduct(productId)
        if (!product) {
            return next(createHttpError(404, 'Product not found'))
        }

        try {
            await this.storage.delete(product.image)

            await this.productService.deleteProduct(productId)

            res.json({ message: 'Product deleted successfully' })
        } catch (err) {
            console.error(err)
            next(createHttpError(500, 'Failed to delete product'))
        }
    }

    getPrices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { ids } = req.body
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return next(createHttpError(400, 'Invalid product IDs'))
            }

            const products = await this.productService.getProductsPriceData(
                ids as string[],
            )

            const prices = products.map((product) => ({
                id: product._id ? product._id.toString() : '',
                priceConfiguration: product.priceConfiguration,
            }))

            res.json(prices)
        } catch (err) {
            return next(err)
        }
    }
}
