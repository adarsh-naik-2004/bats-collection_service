import app from './app'
import config from 'config'
import logger from './config/logger'

const startServer = () => {
    const PORT = config.get('server.port') || 5502
    try {
        app.listen(PORT, () => {
            logger.info('Server Listening on port', { PORT })
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

startServer()
