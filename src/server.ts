import { Config } from './config/index'
import app from './app'
import logger from './config/logger'
import { initDb } from './config/db'

const startServer = async () => {
    const PORT: number = Number(Config.server.port)
    try {
        await initDb()
        logger.info('Database connected successfully')

        app.listen(PORT, () =>
            logger.info(`Collection service listening on port ${PORT}`),
        )
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message)
            logger.on('finish', () => {
                process.exit(1)
            })
        }
    }
}

void startServer()
