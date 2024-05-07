import { AttendanceDiary } from '../models/attendanceDiary.model.js'

const attendanceDiary = new AttendanceDiary()

// TODO comentar y probar las funciones
export const getAllByStudent = async (req, res) => {
    try {
        const id = req.params.id
        const result = await attendanceDiary.getAllByStudent(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAttendanceDate = async (req, res) => {
    try {
        const date = req.params.date
        const result = await attendanceDiary.getAttendanceDate(date)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const setEntrance = async (req, res) => {
    try {
        const data = req.body
        const result = await attendanceDiary.setEntrance(data)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const setExit = async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body
        const result = await attendanceDiary.setExit(id, data)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}