import { NextFunction, Response, Request } from 'express'
import { UploadedFile } from 'express-fileupload'
import { v4 as uuidv4 } from 'uuid'
import { FileStorage } from '../common/types/storage'
import { AccessoryService } from './accessory-service'
import { CreateRequestBody, Accessory } from './accessory-types'

export class AccessoryController {
    constructor(
        private storage: FileStorage,
        private accessoryService: AccessoryService,
    ) {}

    create = async (
        req: Request<object, object, CreateRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const image = req.files!.image as UploadedFile
            const fileUuid = uuidv4()

            await this.storage.upload({
                filename: fileUuid,
                fileData: image.data.buffer,
            })

            const savedAccessory = await this.accessoryService.create({
                ...req.body,
                image: fileUuid,
                storeId: req.body.storeId,
            } as Accessory)

            res.json({ id: savedAccessory._id })
        } catch (err) {
            return next(err)
        }
    }

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessorys = await this.accessoryService.getAll(
                req.query.storeId as string,
            )

            const readyAccessorys = accessorys.map((accessory) => {
                return {
                    id: accessory._id,
                    name: accessory.name,
                    price: accessory.price,
                    storeId: accessory.storeId,
                    image: this.storage.getObjectUri(accessory.image),
                }
            })
            res.json(readyAccessorys)
        } catch (err) {
            return next(err)
        }
    }
}
