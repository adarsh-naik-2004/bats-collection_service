import config from 'config'
import mongoose from 'mongoose'

export const initDb = async () => {
    const uri = config.get('database.url')
    await mongoose.connect(String(uri))
}
