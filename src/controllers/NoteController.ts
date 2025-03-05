import type { Request, Response } from 'express'
import Note, { INote } from '../models/Note'
import Task from '../models/Tasks'

export class NoteController {

    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        try {
            const note = new Note(req.body)
            note.createdBy = req.user.id
            note.task = req.task.id

            const task = await Task.findById(req.task.id)
            task.notes.push(note.id)

            await Promise.allSettled([note.save(), task.save()])

            res.status(201).send('Nota creada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    static getAllNoteByTaskId = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task.id }).populate({
                path: 'createdBy',
                select: '_id name email'
            })

            res.json({ data: notes })
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    static removeNoteById = async (req: Request, res: Response) => {
        try {
            const { noteId } = req.params
            const note = await Note.findById(noteId)
            if (!note) {
                const error = new Error('Nota no encontrada')
                return res.status(404).json({ error: error.message })
            }

            if (note.createdBy.toString() !== req.user.id.toString()) {
                const error = new Error('Accion no valida')
                return res.status(400).json({ error: error.message })
            }

            try {
                const task = await Task.findById(note.task)
                task.notes = task.notes.filter((item) => item._id.toString() !== note.id.toString())

                await Promise.allSettled([note.deleteOne(), task.save()])
                res.send('Nota Eliminada Correctamente')
            } catch (error) {
                res.status(500).json({ error: 'Hubo un Error' })
            }
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }
}