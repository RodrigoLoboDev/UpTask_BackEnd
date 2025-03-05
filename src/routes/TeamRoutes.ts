import { Router } from "express";
import { body, param } from "express-validator";
import { getErrors } from "../middleware/validation";
import { validateProjectExists } from "../middleware/existProject";
import { TeamController } from "../controllers/TeamController";

const router = Router()

// Encontrar un usuario
router.post('/:projectId/team/find',
    validateProjectExists,
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no valido'),
    getErrors,
    TeamController.findUserTeam
)

// Agregar un colaborador al grupo de team
router.post('/:projectId/team',
    validateProjectExists,
    body('id')
        .isMongoId().withMessage('ID no valido'),
    getErrors,
    TeamController.addUserTeam
)

// Eliminar un colaborador del grupo de teams
router.delete('/:projectId/team/:teamId',
    validateProjectExists,
    param('teamId')
        .isMongoId().withMessage('ID no valido'),
    getErrors,
    TeamController.removeUserTeam
)

// Traer todos los colaboradores
router.get('/:projectId/team',
    validateProjectExists,
    TeamController.getUsersTeams
)

export default router