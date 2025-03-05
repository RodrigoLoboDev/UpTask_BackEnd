import { Request, Response, NextFunction } from "express";
import { decodedJWT } from "../utils/jwt";
import User, { IUser } from "../models/User";

// Codigo para poder enviar algo por el req en este caso el usuario y haci poder pasar información de un archivo a otro
declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req : Request, res: Response, next : NextFunction) => {
    const bearer = req.headers.authorization
    if (!bearer) {
        const error = new Error('No Autorizado')
        return res.status(401).send({error: error.message})
    }

    const [, token] = bearer.split(' ')

    try {
        // Validar el JWT
        const decoded = decodedJWT(token)
        // Consultar el usuario
        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email') // seleccionamos solo lo que necesitamos en este caso el ID, si fuera id y nombre: select('_id name')
            if (!user) {
                return res.status(500).json({error: 'Token no Válido'})
            }
            req.user = user
        }
        
    } catch (error) {
        res.status(500).json({error: 'Token no Válido'})
    }

    next()
}