import {env} from './config/env.js'
import app from './app.js'
import logger from './utils/logger.js'
import {connectDb, closeDb} from './config/db.js'

const start = async(): Promise<void> => {
    try{
        await connectDb()
        const server = app.listen(env.port, ()=>{
            logger.info(`Server running on port ${env.port}`)
        })
        server.on('error', (err: Error) => {
            logger.fatal({err, port: env.port}, 'Failed to start server')
            process.exit(1)
        })

        const shutdown = (): void => {
            server.close(()=>{
                void closeDb().then(()=> process.exit(0))
            })
        }
        process.on('SIGINT', shutdown)
        process.on('SIGTERM', shutdown)
    }catch(err){
        logger.fatal({err}, 'Failed to start app')
        process.exit(1)
    }
}
void start()