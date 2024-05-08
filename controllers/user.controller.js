import fs from 'node:fs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user.model.js'

import { validateUserSchema, validatePartialUser, validatePassUpdate } from '../schemas/users.js'
import { unauthorizedMessage, errorMessage, validationError } from '../utils/errorHandler.js'

/**
 * Retrieves all users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll()
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Accepted',
            data: users
        })
    } catch (error) {
        res.status(500).json(errorMessage(`Error al obtener los usuarios: ${error.message}`))
    }
}

/**
 * Retrieves a user by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is retrieved.
 */
export const getUser = async (req, res) => {
    const { id, rol } = req.user

    if (!(id !== Number(req.params.id) || rol !== 'webadmin')) {
        return res.status(401).json(unauthorizedMessage())
    }

    try {
        const user = await User.getId(req.params.id)
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Accepted',
            data: user
        })
    } catch (error) {
        res.status(500).json(errorMessage(error.message))
    }
}

/**
 * Creates a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 */
export const createUser = async (req, res) => {
    // validación del los datos
    const data = await validateUserSchema(req.body)
    const image = req.file?.filename

    if(!data.success) {
        return res.status(400).json(validationError(JSON.parse(data.error.message)))
    }

    if(data.data.password !== data.data.passwordConfirm) {
        return res.status(400).json(validationError('Las contraseñas no coinciden'))
    }

    const { passwordConfirm, ...userData } = data.data
    
    if(image) userData.image = image

    // encriptar contraseña
    const encryptPass = bcrypt.hashSync(userData.password, 10)

    userData.password = encryptPass

    try {
        const user = await User.create(userData)
        const token = jwt.sign(
            { id: user.id, kindergarten_id: user.kindergarten_id, rol: user.rol }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
        ) // Crear token de autenticación

        res.status(201).json({
            success: true,
            statusCode: 201,
            statusMessage: 'Created',
            data: {
                user: user,
                token: token
            }
        })

    } catch(error) {
        res.status(500).json(errorMessage(`Error al crear el usuario: ${error.message}`))
    }
}

/**
 * Updates a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is updated.
 */
export const updateUser = async (req, res) => {
    const updateUser = await validatePartialUser(req.body)
    const updateImage = req.file?.filename
    const { id } = req.user

    if(!updateUser.success) {
        return res.status(400).json(validationError(JSON.parse(updateUser.error.message)))
    }

    // comprobar si el id del parametro es igual al del token
    if(id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage())
    }

    // comprobar si el usuario existe
    const user = await User.getId(req.params.id)
    if(!user) return res.status(404).json(validationError('No se ha encontrado el usuario', 404, 'Unknown'))

    // si existe nueva imagen, borra la anterior y actualiza el campo
    if(updateImage) {
        if(user.image !== null) fs.unlinkSync(`./public/images/users/${user.image}`)
        updateUser.data.image = updateImage
    }

    try {
        await User.update(req.params.id, updateUser.data)
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Updated',
            data: updateUser.data
        })
    } catch(error) {
        res.status(500).json(errorMessage(`Error al actualizar el usuario: ${error.message}`))
    }
}

/**
 * Deletes a user from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is deleted.
 */
export const deleteUser = async (req, res) => {
    const userId = req.params.id
    const { id } = req.user

    // comprobar si el id del parametro es igual al del token
    if (id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage())
    }
    
    try {
        const deleteUser = await User.delete(userId)
        if(deleteUser) {
            res.status(200).json({
                success: true,
                statusCode: 200,
                statusMessage: 'Deleted'
            })
        }
    } catch(error) {
        res.status(500).json(errorMessage(`Error al borrar el usuario: ${error.message}`))
    }
}

/**
 * Updates the password for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the password is updated.
 */
export const userUpdatePassword = async (req, res) => {
    const { id } = req.user

    if (id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage())
    }
    
    const user = await User.getId(req.params.id)
    const validatePass = await validatePassUpdate(req.body)

    if(!validatePass.success) {
        return res.status(400).json(validationError(JSON.parse(validatePass.error.message)))
    }

    try {
        // comprobar si la contraseña introducida es igual a la base de datos
        if(bcrypt.compareSync(validatePass.data.password, user.password)) {
            user.password = validatePass.data.password
            // Actualizar contraseña
            const encryptNewPass = bcrypt.hashSync(user.password, 10)
            user.password = encryptNewPass
            await User.update(req.params.id, user)
            res.status(201).json({
                success: true,
                statusCode: 201,
                statusMessage: 'Updated password',
                data: user
            })
        } else {
            res.status(400).json(validationError('Contraseña incorrecta'))
        }
    } catch(error) {
        res.status(500).json(errorMessage(`Error al actualizar contraseña: ${error.message}`))
    }
}

/**
 * Logs in a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json(validationError('El cuerpo de la solicitud está vacío'))
    }

    if (email === "" || password === "") {
        return res.status(400).json(validationError('Los campos estan vacios'))
    }

    try {
        const user = await User.login(email)

        if(!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json(validationError('La contraseña es incorrecta'))
        }

        const token = jwt.sign(
            { id: user.id, kindergarten_id: user.kindergarten_id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
        )
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Logged',
            data:{
                id: user.id,
                token: token
            } 
        })
    } catch (error) {
        res.status(500).json(errorMessage(`Error al iniciar sesión: ${error.message}`))
    }
}
