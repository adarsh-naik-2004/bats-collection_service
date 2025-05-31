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
        console.log('🔍 Auth Debug:', {
            method: req.method,
            path: req.path,
            contentType: req.headers['content-type'],
            authHeader: req.headers.authorization ? 'Present' : 'Missing',
            cookies: Object.keys(req.cookies || {}),
            accessTokenExists: !!(req.cookies as AuthCookie)?.accessToken,
            rawCookieHeader: req.headers.cookie,
        })

        const authHeader = req.headers.authorization

        if (authHeader) {
            console.log(
                '📋 Auth header found:',
                authHeader.substring(0, 20) + '...',
            )

            if (authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7)

                if (token && token !== 'undefined' && token.trim() !== '') {
                    console.log('✅ Valid Bearer token found')
                    return token
                } else {
                    console.log('❌ Invalid Bearer token')
                }
            } else {
                console.log("❌ Auth header doesn't start with Bearer")
            }
        }

        const { accessToken } = req.cookies as AuthCookie

        if (
            accessToken &&
            accessToken !== 'undefined' &&
            accessToken.trim() !== ''
        ) {
            console.log('✅ Valid cookie token found')
            return accessToken
        }

        console.log('❌ No valid token found in header or cookies')
        return undefined
    },
})
