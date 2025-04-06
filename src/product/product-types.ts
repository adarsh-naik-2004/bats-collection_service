import mongoose from 'mongoose'

export interface Product {
    _id?: mongoose.Types.ObjectId
    name: string
    description: string
    priceConfiguration: string
    attributes: string
    storeId: string
    categoryId: string
    image: string
}

export interface Filter {
    storeId?: string
    categoryId?: mongoose.Types.ObjectId
    isPublish?: boolean
}

export interface PaginateQuery {
    page: number
    limit: number
}

export enum ProductEvents {
    PRODUCT_CREATE = 'PRODUCT_CREATE',
    PRODUCT_UPDATE = 'PRODUCT_UPDATE',
    PRODUCT_DELETE = 'PRODUCT_DELETE',
}
