import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import Task, { TaskType } from "./Tasks";
import { IUser } from "./User";
import Note from "./Note";

// Type
export type ProjectType = Document & {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<TaskType & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

// Schema la forma que tendran los datos en mi DB
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true 
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ], // una proyecto tiene muchas tareas
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true})

// Middleware
ProjectSchema.pre('deleteOne', {document: true}, async function() {
    const projectId = this._id
    if (!projectId) return
    const tasks = await Task.find({project: projectId})
    for(const task of tasks) {
        await Note.deleteMany({task: task.id})
    }
    await Task.deleteMany({project: projectId})
})

// Modelo
const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project