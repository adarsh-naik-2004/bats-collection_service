import { expressjwt, GetVerificationKey } from 'express-jwt'
import { Request } from 'express'
import jwksClient from 'jwks-rsa'
import { AuthCookie } from '../types/index'
import { Config } from '../../config/index'

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: Config.auth.jwksUri ?? '',
        cache: true,
        rateLimit: true,
    }) as unknown as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        const { accessToken } = req.cookies as AuthCookie
        if (accessToken) {
            return accessToken
        }

        const authHeader = req.headers.authorization
        if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
            return authHeader.split(' ')[1]
        }

        return undefined
    },
})
