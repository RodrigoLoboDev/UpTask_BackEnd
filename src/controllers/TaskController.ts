import type {Request, Response} from 'express'
import Task from '../models/Tasks'


export class TaskController {

    static createtask = async (req : Request, res : Response) => {      

        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)

            // cuando tenemos dos await se ejecutan uno a la vez, pero como en este caso el segundo await no depende del primero podemos hacer que se ejecuten al mismo tiempo con Promise
            // await task.save()
            // await req.project.save()

            await Promise.allSettled([task.save(), req.project.save()])

            res.status(201).send('Tarea Creada Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getAlltaskByProjectID = async (req : Request, res : Response) => {
        try {
            const tasks = await Task.find({
                project: req.project.id
            }).populate('project')
            res.json({data: tasks})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static gettaskByID = async (req : Request, res : Response) => {
        try {
            if (req.task.project.toString() !== req.project.id.toString()) {
                return res.status(400).json({error: 'Acción no válida'})
            }

            const task = await Task.findById(req.task.id).populate({
                path: 'completedBy.user',
                select: '_id name email'
            }).populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email'}})

            res.json({data: task})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            if (req.task.project.toString() !== req.project.id.toString()) {
                return res.status(400).json({error: 'Acción no válida'})
            }

            req.task.name = req.body.name
            req.task.description = req.body.description

            await req.task.save()
    
            res.send('Tarea Actualizada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }        
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            if (req.task.project.toString() !== req.project.id.toString()) {
                return res.status(400).json({error: 'Acción no válida'})
            }
            req.project.tasks = req.project.tasks.filter(task => task._id.toString() !== req.task.id.toString())
    
            // await task.deleteOne()
            // await req.project.save()

            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            res.send('Tarea Eliminada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }        
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            if (req.task.project.toString() !== req.project.id.toString()) {
                return res.status(400).json({error: 'Acción no válida'})
            }
            
            req.task.status = req.body.status

            const data = {
                user: req.user.id,
                status: req.body.status
            }
            req.task.completedBy.push(data)
            
            // if (req.task.status === 'pending') {
            //     req.task.completedBy = null
            // } else {
            //     req.task.completedBy = req.user.id
            // }

            await req.task.save()

            res.send('Estado Actualizado')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }        
    }
}