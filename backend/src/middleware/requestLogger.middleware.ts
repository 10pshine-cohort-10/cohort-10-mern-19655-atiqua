import { pinoHttp } from "pino-http";
import { randomUUID } from "crypto";
import type { IncomingMessage, ServerResponse } from "http";
import logger from "../utils/logger.js";

const requestLogger = pinoHttp({
  logger,
  genReqId: (req: IncomingMessage, res: ServerResponse): string => {
    const header = req.headers["x-request-id"];
    const id = typeof header === "string" ? header : randomUUID();
    res.setHeader("x-request-id", id);
    return id;
  },
});
export default requestLogger;
