import AttendanceDiary from '../models/attendanceDiary.model.js'
import Student from '../models/students.model.js'
import { errorMessage, unauthorizedMessage } from '../utils/errorHandler.js'


/**
 * Retrieves all attendance records based on the provided filters.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getAllAttendance = async (req, res) => {
    const filters = {
        kindergarten: req.query.kindergarten,
        student: req.query.student
    }

    try {
        if (!filters.kindergarten && !filters.student) {
            if (req.user.rol !== 'webadmin') {
                return res.status(500).json(unauthorizedMessage());
            }
        }

        if (filters.kindergarten) {
            if (!(req.user.kindergarten_id === Number(filters.kindergarten) || req.user.rol === 'webadmin')) {
                return res.status(401).json(unauthorizedMessage('No estás autorizado para acceder a esta guardería'));
            }
        }

        if (filters.student) {
            const student = await Student.getId(filters.student);
            if (!(req.user.kindergarten_id === student.kindergarten_id || req.user.rol === 'webadmin')) {
                return res.status(401).json(unauthorizedMessage('No estás autorizado para acceder a este estudiante'));
            }
        }

        const result = await AttendanceDiary.getAll(filters);
        res.status(200).json({
            success: true,
            statusCode: 200,
            statusMessage: 'Accepted',
            data: result
        });
    } catch (error) {
        res.status(500).json(errorMessage(`Error al obtener entrada: ${error.message}`));
    }
}

export const getAttendanceDate = async (req, res) => {
    //TODO
}

export const setEntrance = async (req, res) => {
    //TODO
}

export const setExit = async (req, res) => {
    //TODO
}