import KindergartenModel from '../models/kindergarten.model.js'
import UserModel from '../models/user.model.js'

const User = new UserModel
const Kindergarten = new KindergartenModel

import { validateKindergartenSchema, validatePartialKindergarten } from '../schemas/kindergarten.js'
import { errorMessage, unauthorizedMessage, validationError } from '../utils/errorHandler.js'
import { responseSuccessData, responseCreatedData } from '../utils/responseHandler.js'

/**
 * Get all kindergartens.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the list of kindergartens.
 */
export const getAllKindergarten = async (req, res) => {
    const { id, rol } = req.user

    if (id !== Number(req.params.id) && rol !== 'webadmin') {
        return res.status(401).json(unauthorizedMessage())
    }

    try {
        const kindergartens = await Kindergarten.getAll()
        res.status(200).json(responseSuccessData(kindergartens))
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
    if (req.user.rol !== 'webadmin' && req.user.kindergarten_id !== req.params.id) {
        return res.status(401).json(unauthorizedMessage('No estas autorizado para acceder a esta guardería'))
    }

    try {
        const kindergarten = await Kindergarten.getId(req.params.id)
        res.status(200).json(responseSuccessData(kindergarten))
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
    const data = await validateKindergartenSchema(req.body)

    if(!data.success) {
        return res.status(400).json(validationError(JSON.parse(data.error.message)))
    }

    try{
        // Obtener los datos del usuario que crea la guarderia
        const { id } = req.user
        const user = await User.getUser(id)

        // Crear la nueva guarderia
        data.data.user_id = id
        const kindergarten = await Kindergarten.create(data.data)
        
        user.kindergarten_id = kindergarten.insertId
        await User.updateUser(id, user)

        res.status(201).json(responseCreatedData('Se ha creado correctamente', { kindergarten: kindergarten.insertId, userId: user.id}))
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
    const updateKg = await validatePartialKindergarten(req.body)
    
    if (req.user.kindergarten_id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage('No estas autorizado para acceder a esta guardería'))
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json(validationError('El cuerpo de la solicitud está vacío'))
    }

    if(!updateKg.success) {
        return res.status(400).json(validationError(JSON.parse(updateKg.error.message)))
    }

    console.log(updateKg.data)

    try {
        const result = await Kindergarten.update(req.params.id, updateKg.data)
        res.status(200).json(responseSuccessData(result))
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
            res.status(200).json(responseSuccessData('Se ha borrado correctamente'))
        }
    } catch(error) {
        res.status(500).json(errorMessage(error.message))
    }
}