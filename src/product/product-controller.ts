import { NextFunction, Response } from 'express'
import { Request } from 'express-jwt'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { ProductService } from './product-service'
import { Filter, Product, ProductEvents } from './product-types'
import { FileStorage } from '../common/types/storage'
import { UploadedFile } from 'express-fileupload'
import { AuthRequest } from '../common/types'
import { Roles } from '../common/constants'
import mongoose from 'mongoose'
import { MessageProducerBroker } from '../common/types/broker'
import { mapToObject } from '../utils'

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
        private broker: MessageProducerBroker,
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

        // Send product to kafka.
        await this.broker.sendMessage(
            'product',
            JSON.stringify({
                event_type: ProductEvents.PRODUCT_CREATE,
                data: {
                    id: newProduct._id,
                    priceConfiguration: mapToObject(
                        newProduct.priceConfiguration as unknown as Map<
                            string,
                            unknown
                        >,
                    ),
                },
            }),
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

        const updatedProduct = await this.productService.updateProduct(
            productId,
            productToUpdate,
        )

        // Send product to kafka.
        await this.broker.sendMessage(
            'product',
            JSON.stringify({
                event_type: ProductEvents.PRODUCT_UPDATE,
                data: {
                    id: updatedProduct._id,
                    priceConfiguration: mapToObject(
                        updatedProduct.priceConfiguration as unknown as Map<
                            string,
                            unknown
                        >,
                    ),
                },
            }),
        )

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
}
