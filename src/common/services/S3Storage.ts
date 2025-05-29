import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3'
import { Config } from '../../config/index'
import { FileData, FileStorage } from '../types/storage'
import createHttpError from 'http-errors'

export class S3Storage implements FileStorage {
    private client: S3Client

    constructor() {
        if (!Config.s3.region || !Config.s3.accessKey || !Config.s3.secretKey) {
            throw new Error('Missing S3 configuration values')
        }
        this.client = new S3Client({
            region: Config.s3.region,
            credentials: {
                accessKeyId: Config.s3.accessKey,
                secretAccessKey: Config.s3.secretKey,
            },
        })
    }
    async upload(data: FileData): Promise<void> {
        const objectParams = {
            Bucket: Config.s3.bucket,
            Key: data.filename,
            Body: data.fileData,
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.client.send(new PutObjectCommand(objectParams))
    }

    async delete(filename: string): Promise<void> {
        const objectParams = {
            Bucket: Config.s3.bucket,
            Key: filename,
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.client.send(new DeleteObjectCommand(objectParams))
    }
    getObjectUri(filename: string): string {
        const bucket = Config.s3.bucket
        const region = Config.s3.region

        if (typeof bucket === 'string' && typeof region === 'string') {
            return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`
        }
        const error = createHttpError(500, 'Invalid S3 configuration')
        throw error
    }
}
