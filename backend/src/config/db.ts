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
    try{
    const client = await pool.connect()
    client.release()
    logger.info('Database connected')
    } catch (err){
        logger.error({err}, 'Failed to connect to DB')
        throw err
    }
}

export const closeDb = async (): Promise<void> => {
    try{
    await pool.end()
    } catch (err){
        logger.error({err},'Failed to close the DB pool')
        throw err
    }
}