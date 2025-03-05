import type {Request, Response} from 'express'
import Project from '../models/Projects';
import User from '../models/User';

export class TeamController {

    static findUserTeam = async (req : Request, res : Response) => {
        try {
            const { email } = req.body
            const user = await User.findOne({email}).select(['_id', 'email', 'name'])
            if (!user) {
                const error = new Error('Usuario no encontrado') 
                return res.status(404).json({error: error.message})
            }
            return res.json(user)
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static addUserTeam = async (req : Request, res : Response) => {
        try {
            const { id } = req.body

            const user = await User.findById(id).select(['_id'])
            if (!user) {
                const error = new Error('Usuario no encontrado') 
                return res.status(404).json({error: error.message})
            }

            const existUserTeam = req.project.team.includes(user.id)            
            if (existUserTeam) {
                const error = new Error('Ya existe un colaborador con este E-mail') 
                return res.status(409).json({error: error.message})   
            }

            req.project.team.push(user.id)
            await req.project.save()
            return res.status(201).send('Colaborador Agregado Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static removeUserTeam = async (req : Request, res : Response) => {
        try {
            const { teamId } = req.params

            const user = await User.findById(teamId).select(['_id'])
            if (!user) {
                const error = new Error('Usuario no encontrado') 
                return res.status(404).json({error: error.message})
            }

            const existUserTeam = req.project.team.includes(user.id)            
            if (!existUserTeam) {
                const error = new Error('Colaborador no existe en el proyecto') 
                return res.status(409).json({error: error.message})   
            }

            req.project.team = req.project.team.filter(userTeam => userTeam._id.toString() !== teamId)            
            await req.project.save()
            return res.send('Colaborador Eliminado Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }

    static getUsersTeams = async (req : Request, res : Response) => {
        try {
            const project = await Project.findById(req.project.id).populate({
                path: 'team',
                select: 'id name email'
            })
            res.json(project.team)
        } catch (error) {
            res.status(500).json({error: 'Hubo un Error'})
        }
    }
}