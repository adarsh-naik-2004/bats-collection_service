import { Config } from './index'
import mongoose from 'mongoose'

export const initDb = async () => {
    const uri = Config.database.url
    await mongoose.connect(String(uri))
}
