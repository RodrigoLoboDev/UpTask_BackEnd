import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

export const getErrors = (req: Request, res: Response, next: NextFunction) => {

    // Leer los errores
    let errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    next() // para que valla a la proxima funcion
}