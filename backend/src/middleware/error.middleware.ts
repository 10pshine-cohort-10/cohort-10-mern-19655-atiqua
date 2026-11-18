import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

export const notFound = (
    _req: Request,
    _res: Response,
    next: NextFunction
): void => {
    next(new ApiError(404, 'Route not found'))
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500
    const message = statusCode === 500 ? 'Something went wrong' : err.message
    logger.error({err, requestId: req.id}, 'Request failed')
    res.status(statusCode).json({status: 'error', message, requestId: req.id})
}