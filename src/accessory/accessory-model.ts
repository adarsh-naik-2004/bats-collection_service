import mongoose from 'mongoose'
import { Accessory } from './accessory-types'

const accessorySchema = new mongoose.Schema<Accessory>(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                'bats',
                'balls',
                'gloves',
                'helmets',
                'pads',
                'shoes',
                'accessories',
            ],
        },
        storeId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
)

export default mongoose.model<Accessory>('Accessory', accessorySchema)
