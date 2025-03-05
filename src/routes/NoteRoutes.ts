import { Router } from "express";
import { body, param } from "express-validator";
import { getErrors } from "../middleware/validation";
import { NoteController } from "../controllers/NoteController";
import { validateProjectExists } from "../middleware/existProject";
import { validateTaskExists } from "../middleware/existTask";

const router = Router()

router.param('projectId', validateProjectExists)
router.param('taskId', validateTaskExists)

router.post('/:projectId/tasks/:taskId/note',
    body('content')
        .notEmpty().withMessage('El contenido no puede ir vacio'),
    getErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/note',
    NoteController.getAllNoteByTaskId
)

router.delete('/:projectId/tasks/:taskId/note/:noteId',
    param('noteId').isMongoId().withMessage('ID no válido'),
    getErrors,
    NoteController.removeNoteById
)

export default router