import { config } from 'dotenv'
config()

export const Config = {
    server: {
        port: process.env.PORT,
        host: process.env.HOST,
    },

    database: {
        url: process.env.DB_URL,
    },

    auth: {
        jwksUri: process.env.JWKS_URI,
    },

    s3: {
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_KEY,
        region: process.env.S3_REGION,
        bucket: process.env.S3_BUCKET,
    },

    kafka: {
        broker: process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : [''],
        sasl: {
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD,
        },
    },

    frontend: {
        clientUI: process.env.CLIENT_UI,
        adminUI: process.env.ADMIN_UI,
    },

    env: {
        nodeEnv: process.env.NODE_ENV || 'development',
    },
}
