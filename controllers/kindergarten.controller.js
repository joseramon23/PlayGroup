import Kindergarten from '../models/kindergarten.model.js'
import User from '../models/user.model.js'

import { validateKindergartenSchema, validatePartialKindergarten } from '../schemas/kindergarten.js'
import { errorMessage, unauthorizedMessage, validationError } from '../utils/errorHandler.js'

/**
 * Get all kindergartens.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the list of kindergartens.
 */
export const getAllKindergarten = async (req, res) => {
    const { rol } = req.user

    if (rol !== 'webadmin') {
        return res.status(401).json(unauthorizedMessage())
    }

    try {
        const kindergartens = await Kindergarten.getAll()
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Accepted',
            data: kindergartens
        })
    } catch(error) {
        res.status(500).json(errorMessage(`Error al obtener las guarderias: ${error.message}`))
    }
}

/**
 * Get a specific kindergarten by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the kindergarten details.
 */
export const getKindergarten = async (req, res) => {
    if (!(req.user.kindergarten_id === Number(req.params.id) || req.user.rol === 'webadmin')) {
        return res.status(401).json(unauthorizedMessage('No estas autorizado para acceder a esta guardería'))
    }

    try {
        const kindergarten = await Kindergarten.getId(req.params.id)
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Accepted',
            data: kindergarten
        })
    } catch(error) {
        res.status(500).json(errorMessage(`Error al obtener la guardería: ${error.message}`))
    }
}

/**
 * Create a new kindergarten.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the created kindergarten details.
 */
export const createKindergarten = async (req, res) => {
    // validacion de los datos
    const result = await validateKindergartenSchema(req.body)

    if(!result.success) {
        return res.status(400).json(validationError(JSON.parse(result.error.message)))
    }

    try{
        // Crear la nueva guarderia
        result.data.user_id = req.user.id
        const kindergarten = await Kindergarten.create(result.data)
        
        const updateUser = await User.update(req.user.id, {kindergarten_id: kindergarten.id})

        res.status(201).json({
            success: true,
            statusCode: 201,
            statusMessage: 'Created',
            data: {
                kindergarten: kindergarten,
                user: updateUser
            }
        })
    } catch (error) {
        res.status(500).json(errorMessage(`Error al crear la guardería: ${error.message}`))
    }
}

// TODO: validacion con zod

/**
 * Update a kindergarten by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the updated kindergarten details.
 */
export const updateKindergarten = async (req, res) => {
    const result = await validatePartialKindergarten(req.body)
    
    if (req.user.kindergarten_id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage('No estas autorizado para acceder a esta guardería'))
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json(validationError('El cuerpo de la solicitud está vacío'))
    }

    if(!result.success) {
        return res.status(400).json(validationError(JSON.parse(updateKg.error.message)))
    }

    try {
        const kindergarten = await Kindergarten.update(req.params.id, result.data)
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Updated',
            data: kindergarten
        })
    } catch(error) {
        res.status(500).json(errorMessage(`Error al actualizar la guardería: ${error.message}`))       
    }
}

/**
 * Delete a kindergarten by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the success message.
 */
export const deleteKindergarten = async (req, res) => {  
    try {
        const deleteKindergarten = await Kindergarten.delete(req.params.id)
        if(deleteKindergarten) {
            res.status(200).json({
                success: true,
                statusCode: 200,
                statusMessage: 'Deleted'
            })
        }
    } catch(error) {
        res.status(500).json(errorMessage(error.message))
    }
}