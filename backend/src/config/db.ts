import pg from 'pg'
import {env} from './env.js'
import logger from '../utils/logger.js'

const { Pool } = pg

export const pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
})
pool.on('error',(err: Error)=>{
    logger.error({err}, 'Unexpected database error')
})

export const connectDb = async (): Promise<void> => {
    const client = await pool.connect()
    client.release()
    logger.info('Database connected')
}

export const closeDb = async (): Promise<void> => {
    await pool.end()
}