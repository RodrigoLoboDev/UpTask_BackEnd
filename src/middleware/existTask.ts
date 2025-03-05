import type { Request, Response, NextFunction } from 'express'
import Task, { TaskType } from '../models/Tasks'

// agregamos una nueva propiedad al type de Request, lo hacemos con inteface porque nos permite agregar algo nuevo a lo que ya existe en Request nose puede lograr lo mismo con Type
declare global {
    namespace Express {
        interface Request {
            task: TaskType
        }
    }
}

export const validateTaskExists = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) {
            const error = new Error('Tarea No Encontrada')
            return res.status(404).json({error: error.message})
        }
        req.task = task // de esta forma a traves del req pasamos informacion de un middleware a otro 
        next()

    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}

// Autorizacion para crear, editar, eliminar las tareas
export const hashAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    if (req.project.manager.toString() !== req.user.id.toString()) {
        const error = new Error('Acción no Válida')
        return res.status(404).json({error: error.message})
    }
    next()
}