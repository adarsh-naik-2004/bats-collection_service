import winston from 'winston'
import { Config } from './index'

const logger = winston.createLogger({
    level: 'info', // level hai ye iske upar ka sb --> ready to use rahega
    defaultMeta: {
        serviceName: 'collection-service',
    },
    transports: [
        new winston.transports.File({
            dirname: 'logs',
            filename: 'combined.log',
            level: 'info',
            silent: Config.env.nodeEnv === 'test',
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            silent: Config.env.nodeEnv === 'test',
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.env.nodeEnv === 'test',
        }),
    ],
})

export default logger
