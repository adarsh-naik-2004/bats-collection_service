import mongoose from 'mongoose'

export interface Accessory {
    _id?: mongoose.Types.ObjectId
    name: string
    price: number
    storeId: string
    image: string
    category: string
}

export interface CreateRequestBody {
    name: string
    price: number
    storeId: string
    category: string
}

export enum AccessoryEvents {
    ACCESSORY_CREATE = 'ACCESSORY_CREATE',
    ACCESSORY_UPDATE = 'ACCESSORY_UPDATE',
    ACCESSORY_DELETE = 'ACCESSORY_DELETE',
}
