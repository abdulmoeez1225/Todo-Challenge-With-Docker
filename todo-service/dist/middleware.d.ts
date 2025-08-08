import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        uuid: string;
        email: string;
    };
}
export declare function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
