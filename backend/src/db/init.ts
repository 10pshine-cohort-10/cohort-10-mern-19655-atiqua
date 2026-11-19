import {readFile} from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import {pool, closeDb} from '../config/db.js'
import logger from '../utils/logger.js'

const run = async (): Promise<void> => {
    try{
        const dir = path.dirname(fileURLToPath(import.meta.url))
        const sql = await readFile(path.join(dir, 'schema.sql'), 'utf-8')
        await pool.query(sql)
        logger.info('Database tables are ready')
    } catch(err){
        logger.error({err}, 'Failed to set up database tables')
        process.exitCode = 1
    } finally {
        await closeDb()
    }
}
void run()