import app from './app'
import config from 'config'
import logger from './config/logger'
import { initDb } from './config/db'

const startServer = async () => {
    const PORT = Number(config.get('server.port')) || 5502
    try {
        await initDb()

        logger.info('Database Connected Successfully')

        app.listen(PORT, () => {
            logger.info(`Server Listening on port ${PORT}`)
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(error.message)
            logger.on('finish', () => {
                process.exit(1)
            })
        }
    }
}

void startServer()
