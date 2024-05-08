import { Router } from 'express'
import { authToken } from '../middlewares/authToken.js'
import { getAllAttendance } from '../controllers/attendance.controller.js'

const router = Router()

router.get('/attendance', authToken, getAllAttendance)

export const attendanceRouter = (app) => app.use('/api', router)