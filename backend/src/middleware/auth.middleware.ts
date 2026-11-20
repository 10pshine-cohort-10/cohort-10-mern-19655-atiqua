import type { Request, Response, NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import {env} from '../config/env.js'
import ApiError from "../utils/ApiError.js";

export const requireAuth = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const header = req.headers.authorization
    if(!header || !header.startsWith("Bearer ")){
        next(new ApiError(401,'Authentication required'))
        return
    }
    const token = header?.slice('Bearer '.length )

    try{
        const payload = jwt.verify(token, env.jwt.secret)
        if( typeof payload === 'string' || typeof payload.id !== 'number'){
            next(new ApiError(401, 'Invalid token'))
            return
        }
        req.user = {id: payload.id}
        next()
    }catch {
     next(new ApiError(401,'Invalid or expired token'))
    }
}