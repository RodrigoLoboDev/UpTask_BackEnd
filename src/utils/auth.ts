import bcrypt from 'bcrypt'

export const hashPassword = async (password : string) => {
    // Salt - Es un valor aleatorio y unico que se va a generar por cada contraseña
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const checkPassword = async (password: string, passwordHash: string) => {
    return await bcrypt.compare(password, passwordHash)
}