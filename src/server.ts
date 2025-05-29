import { Config } from './config/index'
import app from './app'
import logger from './config/logger'
import { initDb } from './config/db'
import { MessageProducerBroker } from './common/types/broker'
import { createMessageProducerBroker } from './common/factories/brokerFactory'

const startServer = async () => {
    const PORT: number = Number(Config.server.port)
    let messageProducerBroker: MessageProducerBroker | null = null
    try {
        await initDb()
        logger.info('Database connected successfully')

        // Connect to Kafka
        messageProducerBroker = createMessageProducerBroker()

        await messageProducerBroker.connect()

        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`))
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (messageProducerBroker) {
                await messageProducerBroker.disconnect()
            }
            logger.error(err.message)
            logger.on('finish', () => {
                process.exit(1)
            })
        }
    }
}

void startServer()
