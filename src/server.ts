import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import AuthRoutes from './routes/AuthRoutes'
import ProjectRoutes from './routes/ProjectRoutes'
import TeamRoutes from './routes/TeamRoutes'
import NoteRoutes from './routes/NoteRoutes'

dotenv.config()

connectDB()

// Instancia de express
const app = express()

// Cors
app.use(cors(corsConfig))

// Habilitar el req.body
app.use(express.json())

// Rutas
app.use('/api/auth', AuthRoutes)
app.use('/api/projects', ProjectRoutes)
app.use('/api/projects', TeamRoutes)
app.use('/api/projects', NoteRoutes)

export default app