import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { getErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router()

// Crear nueva cuenta de usuario
router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El email es obligatorio'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los password no son iguales')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    getErrors,
    AuthController.createAccount
)

// Confirmar la cuenta del usuario a traves del token que enviamos por email
router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El token es obligatorio'),
    getErrors,
    AuthController.confirmAccount
)

// Inicar sesión
router.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    body('password')
        .notEmpty().withMessage('El password es obligatorio'),
    getErrors,
    AuthController.login
)

// Enviar nuevo token para confirmar cuenta en caso que el token anterior haya expirado
router.post('/request-new-code',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    getErrors,
    AuthController.requestConfirmationCode
)

// Enviar un token de seguridad que te permita poder reestablecer tu password
router.post(
    '/request-password-reset',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    getErrors,
    AuthController.sendTokenPasswordReset
);

// Validar el token que enviamos por correo para poder reestabler el password
router.post(
    '/validate-token-password-reset',
    body('token')
        .notEmpty().withMessage('El token es obligatorio'),
    getErrors,
    AuthController.validateToken
);

// Restablecer contraseña
router.post(
    '/reset-password/:token',
    param('token').isNumeric().withMessage('Token no valido'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los password no son iguales')
        }
        return true
    }),
    getErrors,
    AuthController.updatePassword
);


// EndPoint con la informacion del Usuario
router.get('/user',
    authenticate,
    AuthController.user
)

// Actualizar el perfil del usuario
router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('email')
        .isEmail().withMessage('El E-mail es obligatorio'),
    getErrors,
    AuthController.updateProfile
)

// Cambiar el password del usuario
router.post('/profile/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('El password actual no puede ir vacio'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los password no son iguales')
        }
        return true
    }),
    getErrors,
    AuthController.updateCurrentUserPassword
)

// Checkear el password del usuario como capa de seguridad para realizar acciones destructivas como eliminar un proyecto completo
router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    getErrors,
    AuthController.checkPassword
)

export default router