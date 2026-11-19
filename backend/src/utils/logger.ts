import {pino} from 'pino'
import { env } from '../config/env.js'

const serializeError = (error: Error)=>{
    const candidate = error as Error & {type?: unknown}
    if(candidate.type === "entity.parse.failed"){
        return {
            type: "entity.parse.failed",
            status: 400,
            message: "Malformed JSON request"
        }
    }
    if(candidate.type === "entity.too.large"){
        return {
            type: "entity.too.large",
            status: 413,
            message: "Payload too large"
        }
    }
    return pino.stdSerializers.err(error)
}
const logger = pino({
    level: env.logLevel,
    redact: ['req.headers.authorization', 'req.headers.cookie', 'password'],
    serializers:{
        err: serializeError
    },
    transport:
    process.env.NODE_ENV === 'development' ? {target: 'pino-pretty'}:undefined,
})
export default logger