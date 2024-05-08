import Student from '../models/students.model.js'
import { validatePartialStudent, validateStudentSchema } from '../schemas/student.js'

import { errorMessage, unauthorizedMessage, validationError } from '../utils/errorHandler.js'

/**
 * Retrieves all students.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getAllStudents = async (req, res) => {
    const { kindergarten } = req.query

    if (!(Number(kindergarten) !== Number(req.user.kindergarten_id) || req.user.rol !== 'webadmin')) {
        return res.status(401).json(unauthorizedMessage('No perteneces a esta guardería'))
    }

    try {
        const students = await Student.getAll({ kindergarten })
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Accepted',
            data: students
        })
    } catch (error) {
        res.status(500).json(errorMessage(`Error al obtener estudiantes: ${error.message}`))
    }
}

/**
 * Retrieves a student by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the student is retrieved.
 */
export const getStudent = async (req, res) => {
    try {
        const student = await Student.getId(req.params.id)

        if(!(student.kindergarten_id !== Number(req.user.kindergarten_id) || req.user.rol !== 'webadmin')) {
            return res.status(401).json(unauthorizedMessage())
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Accepted',
            data: student
        })
    } catch (error) {
        res.status(500).json(errorMessage(`Error al obtener estudiante: ${error.message}`))
    }
}

/**
 * Creates a new student
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the student is created
 */
export const createStudent = async (req, res) => {
    // data validation
    const result = await validateStudentSchema(req.body)
    const image = req.file?.filename

    if(result.data.kindergarten_id !== Number(req.user.kindergarten_id)) {
        return res.status(401).json(unauthorizedMessage('El estudiante no pertenece a tu guardería'))
    }

    if(!result.success) {
        return res.status(400).json(validationError(JSON.parse(result.error.message)))
    }

    if (image) result.data.image = image

    try {
        const student = await Student.create(result.data)
        res.status(201).json({
            success: true,
            statusCode: 201,
            statusMessage: 'Created',
            data: student
        })
    } catch (error) {
        res.status(500).json(errorMessage(`Error al crear el estudiante: ${error.message}`))
    }
}

/**
 * Updates a student.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the student is updated.
 */
export const updateStudent = async (req, res) => {
    const result = await validatePartialStudent(req.body)
    const image = req.file?.filename

    if(Number(req.query.kindergarten) !== Number(req.user.kindergarten_id)) {
        return res.status(401).json(unauthorizedMessage('La guardería introducida no pertenece a la del usuario'))
    }

    if(!result.success) {
        return res.status(400).json(validationError(JSON.parse(result.error.message)))
    }

    if(image) result.data.image = image

    try {
        await Student.update(req.params.id, result.data)
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Updated',
            data: result.data
        })
    } catch (error) {
        res.status(500).json(errorMessage(`Error al actualizar estudiante: ${error.message}`))
    }
}

/**
 * Deletes a student from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the student is deleted.
 */
export const deleteStudent = async (req, res) => {

    if (!req.query.kindergarten) return res.status(400).json(errorMessage('Debes introducir la id de al guardería'))
    
    if(Number(req.query.kindergarten) !== Number(req.user.kindergarten_id) && req.user.rol !== 'webadmin') {
        return res.status(401).json(unauthorizedMessage())
    }

    try {
        const student = await Student.delete(req.params.id)
        if(student) {
            res.status(200).json({
                success: true,
                statusCode: 200,
                statusMessage: 'Deleted'
            })
        }
    } catch (error) {
        res.status(500).json(errorMessage(`Error al borrar el estudiante: ${error.message}`))
    }
}