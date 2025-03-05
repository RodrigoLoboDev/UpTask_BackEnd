import type {Request, Response} from 'express'
import Project from '../models/Projects';

export class ProjectController {

    static createProject = async (req : Request, res : Response) => {      

        const project = new Project(req.body)
        project.manager = req.user.id

        try {
            await project.save()
            res.status(201).send('Proyecto Creado Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getAllProject = async (req : Request, res : Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}}, // trae todos los proyectos donde eres el manager
                    {team: {$in: req.user.id}} // trae todos los proyectos donde formas parte del equipo
                ]
            })
            res.json({data: projects})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getProjectById = async (req : Request, res : Response) => {
        
        try {
            res.json({data: req.project})
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static updateProject = async (req: Request, res: Response) => {

        req.project.projectName = req.body.projectName
        req.project.clientName = req.body.clientName
        req.project.description = req.body.description
        
        await req.project.save()
    
        res.send('Proyecto Actualizado')
    }

    static deleteProject = async (req: Request, res: Response) => {
    
        await req.project.deleteOne()
    
        res.send('Proyecto Eliminado')
    }
}