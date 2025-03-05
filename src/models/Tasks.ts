import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed',
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

// Type
export type TaskType = Document & {
    name: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[],
    notes: Types.ObjectId[]
}

// Schema la forma que tendran los datos en mi DB
const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    }, // una tarea esta relacionada a solo 1 proyecto
    status: {
        type: String,
        // enum: ['pending', 'onHold', 'inProgress', 'underReview', 'completed']
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    completedBy: [
        {
            user: {
                default: null,
                type: Types.ObjectId,
                ref: 'User'
            },
            status: {
                type: String,
                // enum: ['pending', 'onHold', 'inProgress', 'underReview', 'completed']
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, { timestamps: true })

// Middleware
TaskSchema.pre('deleteOne', {document: true}, async function(){
    const taskId = this._id
    if (!taskId) return
    await Note.deleteMany({task: taskId})
})

// Modelo
const Task = mongoose.model<TaskType>('Task', TaskSchema)
export default Task