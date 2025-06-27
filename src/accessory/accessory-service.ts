import accessoryModel from './accessory-model'
import { Accessory } from './accessory-types'
import mongoose from 'mongoose'

export class AccessoryService {
    async create(accessory: Accessory) {
        return await accessoryModel.create(accessory)
    }

    async getAll(storeId: string) {
        return await accessoryModel.find({ storeId })
    }

    async getAllByIds(ids: string[]): Promise<Accessory[]> {
        return await accessoryModel.find(
            {
                _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
            },
            { price: 1 },
        )
    }
}
