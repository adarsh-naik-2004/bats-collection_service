import { body } from 'express-validator'

export default [
    body('name')
        .exists()
        .withMessage('Accessory name is required')
        .isString()
        .withMessage('Accessory name should be a string'),
    body('price').exists().withMessage('Price is required'),

    body('image').custom((value, { req }) => {
        if (!req.files) throw new Error('Accessory image is required')
        return true
    }),
    body('category')
        .exists()
        .withMessage('Category is required')
        .isString()
        .withMessage('Category should be a string'),
    body('storeId').exists().withMessage('Store Id is required'),
]
