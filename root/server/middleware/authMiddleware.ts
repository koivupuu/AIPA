import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

const checkJwt = expressjwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 6,
        jwksUri: `${process.env.AUTH0_ISSUER}/.well-known/jwks.json`
    }),
    audience: process.env.AUTH0_AUDIENCE,
    algorithms: ['RS256']
}).unless({ path: [] }); // Add any public endpoints that don't require authentication

// Error handling middleware for authentication errors
const handleAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        if (err.inner && err.inner.code === 'E_RATE_LIMIT_REACHED') {
            return res.status(429).send('Rate limit reached. Please try again later.');
        }
        return res.status(401).send(err.message);
    }
    next(err);
};

export { checkJwt, handleAuthError };
