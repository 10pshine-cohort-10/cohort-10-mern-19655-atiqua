import express from "express";
import type { Request, Response } from "express";
import cors from 'cors'
import requestLogger from './middleware/requestLogger.middleware.js'
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express()

app.use(cors())
app.use(requestLogger)
app.use(express.json())
app.get('/api/health', (_req: Request, res: Response): void=>{
    res.json({status: 'ok', uptime: process.uptime()})
})

app.use(notFound)
app.use(errorHandler)

export default app