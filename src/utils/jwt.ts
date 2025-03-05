import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

type PAYLOAD = {
    id: Types.ObjectId
}

export const generateJWT = (idUser : PAYLOAD) => {    
    const token = jwt.sign(idUser, process.env.JWT_SECRET, {
        expiresIn: '180d'
    })
    return token
}

export const decodedJWT = (token : string) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}