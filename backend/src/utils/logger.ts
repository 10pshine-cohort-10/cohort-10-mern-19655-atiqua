import {pino} from 'pino'
import { env } from '../config/env.js'

const logger = pino({
    level: env.logLevel,
    redact: ['req.headers.authorization', 'req.headers.cookie', 'password'],
    transport:
    env.nodeEnv === 'development' ? {target: 'pino-pretty'}:undefined,
})
export default logger