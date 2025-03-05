import type { Request, Response, NextFunction } from 'express'
import Project, { ProjectType } from '../models/Projects'

// agregamos una nueva propiedad al type de Request, lo hacemos con inteface porque nos permite agregar algo nuevo a lo que ya existe en Request nose puede lograr lo mismo con Type
declare global {
    namespace Express {
        interface Request {
            project: ProjectType
        }
    }
}

export const validateProjectExists = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {projectId} = req.params
        // console.log(projectId);
        const project = await Project.findById(projectId).populate('tasks')
        // console.log(project);
        if (!project) {
            const error = new Error('Proyecto No Encontrado')
            return res.status(404).json({error: error.message})
        }

        if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
            const error = new Error('Acción no Válida')
            return res.status(404).json({error: error.message})
        }

        req.project = project // de esta forma a traves del req pasamos informacion de un middleware a otro 
        next()

    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}