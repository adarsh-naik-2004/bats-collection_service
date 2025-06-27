import { paginationLabels } from '../config/pagination'
import productModel from './product-model'
import { Filter, PaginateQuery, Product } from './product-types'
import mongoose from 'mongoose'
export class ProductService {
    async createProduct(product: Product) {
        return (await productModel.create(product)) as Product
    }

    async updateProduct(productId: string, product: Product) {
        return (await productModel.findOneAndUpdate(
            { _id: productId },
            {
                $set: product,
            },
            {
                new: true,
            },
        )) as Product
    }

    async getProduct(productId: string): Promise<Product | null> {
        return await productModel.findOne({ _id: productId })
    }

    async getProductsByIds(ids: string[]): Promise<Product[]> {
        return await productModel
            .find({
                _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
            })
            .populate('categoryId')
    }

    async getProductsByIdss(ids: string[]): Promise<Product[]> {
        return await productModel.find(
            {
                _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
            },
            { priceConfiguration: 1 },
        )
    }

    async getProducts(
        q: string,
        filters: Filter,
        paginateQuery: PaginateQuery,
    ) {
        const searchQueryRegexp = new RegExp(q, 'i')

        const matchQuery = {
            ...filters,
            name: searchQueryRegexp,
        }

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$category',
            },
        ])

        return productModel.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLabels,
        })
    }
    async deleteProduct(productId: string) {
        const deletedProduct = await productModel.findByIdAndDelete(productId)
        return deletedProduct
    }
}
