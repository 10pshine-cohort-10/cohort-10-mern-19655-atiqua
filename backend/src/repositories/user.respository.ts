import {pool} from '../config/db.js'
import logger from '../utils/logger.js';
export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
}
export const findByEmail = async(email: string): Promise<User | null> =>{
    try{
    const res = await pool.query<User>(
        'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1',
        [email]
    )
    return res.rows[0] ?? null
} catch(err){
    logger.error({err},'Failed to find user by Email')
    throw err
}
}

export const findById = async(id: number): Promise<User | null> =>{
    try{
    const res = await pool.query<User>(
        'SELECT id, name, email, password_hash, created_at FROM users WHERE id = $1',
        [id]
    )
    return res.rows[0] ?? null
} catch(err){
    logger.error({err}, 'Failed to find user by Id')
    throw err
}
}

export const createUser = async(name: string, email: string, passwordHash: string): Promise<User> =>{
    try{
    const res = await pool.query<User>(
        `INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, password_hash, created_at
        `,
        [name,email,passwordHash]
    )
    return res.rows[0] as User
} catch(err){
    logger.error({err},'Failed to create User')
    throw err
}
}