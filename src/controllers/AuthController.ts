import type { Request, Response } from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmails'
import { generateJWT } from '../utils/jwt'

export class AuthController {

    // Crear una nueva cuenta de Usuario
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            // revisar si el usuario ya esta registrado en la base de datos
            const isExistEmail = await User.findOne({ email })
            if (isExistEmail) {
                const error = new Error('El usuario ya se encuentra registrado')
                return res.status(409).json({ error: error.message })
            }
            // crear el usuario
            const user = new User(req.body)
            // Hash password
            user.password = await hashPassword(password)

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.userId = user.id

            // Enviar Email
            AuthEmail.validarEmail({
                name: user.name,
                email: user.email,
                token: token.token
            })

            // Almaceno el usuario y el token
            await Promise.allSettled([user.save(), token.save()])

            res.status(201).send('Cuenta Creada, Revisa Tu E-mail para Confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    // Confirmar la cuenta del usuario a traves del token que enviamos por email
    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body            

            // Verificar que el token exista
            const tokenExist = await Token.findOne({ token })
            
            if (!tokenExist) {
                const error = new Error('Token no válido')
                return res.status(401).send({ error: error.message })
            }

            // Confirmar la cuenta
            const { userId } = tokenExist
            const user = await User.findById(userId)
            user.confirmed = true

            // Guardar cambios en usuario y eliminar el token
            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            res.send('Cuenta Confirmada Correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    /*
    ## Autenticar Usuarios

    → Algoritmo para iniciar sesión: La primera comprobación que debemos realizar es saber si el usuario existe o no.
    → La segunda comprobación es revisar si su cuenta ya ha sido confirmada.
    → La última comprobación es revisar si el password es correcto, en caso de que si lo sea el usuario es autenticado.
    */

    // Inicar sesión
    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            // Verificar que el usuario exista
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El usuario no existe')
                return res.status(404).send({ error: error.message })
            }

            // Verificar si la cuenta ha sido confirmada
            if (!user.confirmed) {
                // Si no fue verificada. Generamos un nuevo token y lo enviamos
                const token = new Token()
                token.userId = user.id
                token.token = generateToken()
                await token.save()

                // Enviar Email
                AuthEmail.validarEmail({
                    name: user.name,
                    email: user.email,
                    token: token.token
                })

                const error = new Error('La cuenta aún no ha sido confirmada, hemos enviado un E-Mail de confirmación')
                return res.status(401).send({ error: error.message })
            }

            // Comprobar que el password es correcto
            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error('El password es incorrecto')
                return res.status(401).send({ error: error.message })
            }
            
            // Generar JWT            
            const token = generateJWT({id: user.id})
            res.send(token)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    // Enviar nuevo token para confirmar cuenta en caso que el token anterior haya expirado
    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // revisar si el usuario ya esta registrado
            const isExistUser = await User.findOne({ email })
            if (!isExistUser) {
                const error = new Error('El usuario no existe')
                return res.status(404).json({ error: error.message })
            }

            // revisar si el usuario ya esta confirmado
            if (isExistUser.confirmed) {
                const error = new Error('El usuario ya esta confirmado')
                return res.status(401).json({ error: error.message })
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.userId = isExistUser.id

            // Enviar Email
            AuthEmail.validarEmail({
                name: isExistUser.name,
                email: isExistUser.email,
                token: token.token
            })            

            // Almaceno el nuevo token
            await token.save()

            res.status(201).send('Nuevo Token Creado, Revisa Tu E-mail')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    /*
    ## Reestablecer Password - Seguridad y más

    → Algoritmo para reestablecer un password
    → La primer comprobación que debemos realizar es saber si el usuario existe o no.
    → Si el usuario existe se le envía un Token que expira en 10 minutos.
    → El Token es enviado vía E-mail y el usuario deberá visitar un enlace e ingresar el token; si el token es válido le permitimos reestablecer su password.
    */
   
    // Enviar un token de seguridad que te permita poder reestablecer tu password
    static sendTokenPasswordReset = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // revisar si el usuario ya esta registrado
            const isExistUser = await User.findOne({ email })
            if (!isExistUser) {
                const error = new Error('El usuario no existe')
                return res.status(404).json({ error: error.message })
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.userId = isExistUser.id
            await token.save()

            // Enviar Email
            AuthEmail.enviarEmailRecuperacionPassword({
                name: isExistUser.name,
                email: isExistUser.email,
                token: token.token
            })

            res.status(201).send('Hemos enviado un correo con las instrucciones para restablecer tu contraseña');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    // Validar el token que enviamos por correo para poder reestabler el password
    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body            

            // Verificar que el token exista
            const tokenExist = await Token.findOne({ token })
            
            if (!tokenExist) {
                const error = new Error('Token no válido')
                return res.status(401).send({ error: error.message })
            }

            res.send('Token Valido, reestablece tu password')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    // Restablecer contraseña
    static updatePassword = async (req: Request, res: Response) => {
        try {
            const { token } = req.params   
            const { password } = req.body

            // Verificar que el token exista
            const tokenExist = await Token.findOne({ token })
            
            if (!tokenExist) {
                const error = new Error('Token no válido')
                return res.status(401).send({ error: error.message })
            }

            const user = await User.findById(tokenExist.userId)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            res.send('Password Actualizado Correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    /* El usuario necesita estar autenticado, req.user */

    // Crear un request con la informacion del usuario
    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }

    // Actualizar el perfil del usuario
    static updateProfile = async (req: Request, res: Response) => {        

        const { name, email } = req.body

        const userExist = await User.findOne({email})
        
        if (userExist && userExist.id.toString() !== req.user.id.toString()) {
            const error = new Error('Ese E-mail ya esta registrado')
            return res.status(409).json({error: error.message})
        }

        req.user.name = name
        req.user.email = email
        try {
            await req.user.save()
            res.send('Perfil del Usuario Actualizado')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    // Cambiar el password del usuario
    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        
        const { current_password, password } = req.body        

        try {
            // validar que el password actual sea el correcto7
            const user = await User.findById(req.user.id)
            const isPasswordCorrect = await checkPassword(current_password, user.password)
            
            if (!isPasswordCorrect) {
                const error = new Error('El password es incorrecto')
                return res.status(409).send({ error: error.message })
            }

            user.password = await hashPassword(password)
            await user.save()
            res.send('Password Actualizado Correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }

    // Checkear el password del usuario como capa de seguridad para realizar acciones destructivas como eliminar un proyecto completo
    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body        

        try {
            // validar que el password actual sea el correcto7
            const user = await User.findById(req.user.id)
            const isPasswordCorrect = await checkPassword(password, user.password)
            
            if (!isPasswordCorrect) {
                const error = new Error('El password es incorrecto')
                return res.status(409).send({ error: error.message })
            }

            res.send('Password Correcto')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un Error' })
        }
    }
}