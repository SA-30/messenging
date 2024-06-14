import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || "thisisverystrongpassword"

export const hashedPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const verifyPassword = async (password: string, hasedPassword: string) => {
    return bcrypt.compare(password, hasedPassword)
}

export const generateToken = (user: any) => {
    const userId = user.id.toString()
    return jwt.sign({id : userId, name: user.name}, jwtSecret, { expiresIn: '15d' })
}

export const verifyToken = async (token: any) => {
    try {
        return jwt.verify(token, jwtSecret)
    } catch (error) {
        throw new Error('Failed to verify token')
    }
}