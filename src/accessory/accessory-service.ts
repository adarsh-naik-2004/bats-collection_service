import accessoryModel from './accessory-model'
import { Accessory } from './accessory-types'

export class AccessoryService {
    async create(accessory: Accessory) {
        return await accessoryModel.create(accessory)
    }

    async getAll(storeId: string) {
        return await accessoryModel.find({ storeId })
    }
}
