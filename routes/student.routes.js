import { Router } from 'express'
import { getAllStudents, getStudent, createStudent, updateStudent, deleteStudent } from '../controllers/student.controller.js'
import { authToken } from '../middlewares/authToken.js' 
import upload from '../middlewares/multerConfig.js'

const router = Router()

router.get('/students', authToken, getAllStudents)
router.get('/students/:id', authToken, getStudent)

router.post('/students', authToken, upload.single('image'), createStudent)
router.put('/students/:id', authToken, upload.single('image'), updateStudent)
router.delete('/students/:id', authToken, deleteStudent)

export const studentRouter = (app) => app.use('/api', router)