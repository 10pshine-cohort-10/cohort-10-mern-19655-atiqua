import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import { loginUser, signUpUser } from "../services/auth.service.js";
import { findById } from "../repositories/user.respository.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const minPassLength = 8

const trimString = (value: unknown): string => 
    typeof value === 'string' ? value.trim() : ""

export const signup = async(
    req:Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const name = trimString(req.body?.name)
        const email = trimString(req.body?.email).toLowerCase()
        const password = typeof req.body?.password === 'string' ? req.body.password : ''
        
        if(!name){
            throw new ApiError(400, 'Name required')
        }
        if(!emailRegex.test(email)){
            throw new ApiError(400, 'Not a valid email')
        }
        if(password.length < minPassLength){
            throw new ApiError(
                400,
                `Password must be atleast ${minPassLength} characters long`
            )
        }
        const result = await signUpUser(name, email, password)
        res.status(201).json(result)
    } catch(error){
        next(error)
    }
}
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
):Promise<void> =>{
    try {
        const email = trimString(req.body?.email).toLowerCase()
        const password = typeof req.body?.password === 'string' ? req.body.password : ''

        if(!email || !password){
            throw new ApiError(400, 'Email and Password required')
        }
        const result = await loginUser(email, password)
        res.json(result)
    } catch(error){
        next(error)
    }
}
export const getMe = async (req:Request, res:Response, next: NextFunction):Promise<void> => {
    try {
        const userId = req.user?.id
        if(!userId){
            throw new ApiError(401, 'Authentication required')
        }
        const user = await findById(userId)
        if(!user){
            throw new ApiError(404, 'User not found')
        } 
        res.json({id: user.id, name: user.name, email: user.email})
    } catch(error){
        next(error)
    }
}