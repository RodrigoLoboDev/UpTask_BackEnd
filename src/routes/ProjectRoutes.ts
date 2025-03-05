import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { getErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/existProject";
import { hashAuthorization, validateTaskExists } from "../middleware/existTask";
import { authenticate } from "../middleware/auth";

const router = Router()

// Validar que todas las rutas tengan la autorización
router.use(authenticate)

router.post('/', 
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del proyecto es obligatoria'),
    getErrors,
    ProjectController.createProject)

router.get('/', ProjectController.getAllProject)

router.get('/:projectId',
    validateProjectExists,
    ProjectController.getProjectById)

router.put('/:projectId',
    validateProjectExists,
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del proyecto es obligatoria'),
    getErrors,
    ProjectController.updateProject)

router.delete('/:projectId', 
    validateProjectExists,
    ProjectController.deleteProject)

// routing for task
router.param('projectId', validateProjectExists)

router.post('/:projectId/tasks',
    hashAuthorization,
    param('projectId')
        .isMongoId().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    getErrors,
    TaskController.createtask
)

router.get('/:projectId/tasks',
    param('projectId')
        .isMongoId().withMessage('ID no válido'),
    getErrors,
    TaskController.getAlltaskByProjectID
)

router.param('taskId', validateTaskExists)
router.get('/:projectId/tasks/:taskId',
    param('projectId')
        .isMongoId().withMessage('ID no válido'),
    param('taskId')
        .isMongoId().withMessage('ID no válido'),
    getErrors,
    TaskController.gettaskByID
)

router.put('/:projectId/tasks/:taskId',
    hashAuthorization,
    param('projectId')
        .isMongoId().withMessage('ID no válido'),
    param('taskId')
        .isMongoId().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    getErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hashAuthorization,
    param('projectId')
        .isMongoId().withMessage('ID no válido'),
    param('taskId')
        .isMongoId().withMessage('ID no válido'),
    getErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('projectId')
        .isMongoId().withMessage('ID no válido'),
    param('taskId')
        .isMongoId().withMessage('ID no válido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    getErrors,
    TaskController.updateStatus
)

export default router