import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

interface BodyParserError extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
}

const isBodyParserError = (err: unknown): 400 | 413 | 415 | null => {
  if (!(err instanceof Error)) return null;
  const candidate = err as BodyParserError;
  const status = candidate.status ?? candidate.statusCode;
  if (status === 400 && candidate.type === "entity.parse.failed") {
    return 400;
  }
  if (status === 413 && candidate.type === "entity.too.large") {
    return 413;
  }
  if (
    status === 415 &&
    (candidate.type === "charset.unsupported" ||
      candidate.type === "encoding.unsupported")
  ) {
    return 415;
  }
  return null;
};

export const notFound = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new ApiError(404, "Route not found"));
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = statusCode === 500 ? "Something went wrong" : err.message;
  } else {
    const parserStatus = isBodyParserError(err);
    if (parserStatus !== null) {
      statusCode = parserStatus;
      message =
        parserStatus === 413 ? "Payload too large" : "Invalid JSON payload";
    }
  }
  logger.error({ err, requestId: req.id }, "Request failed");
  res.status(statusCode).json({ status: "error", message, requestId: req.id });
};
