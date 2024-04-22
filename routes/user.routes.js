import { Router } from 'express'
import { loginUser, createUser, getAllUsers, getUser, updateUser, userUpdatePassword, deleteUser } from '../controllers/user.controller.js'
import { authToken } from '../middlewares/authToken.js'
import { authAdmin } from '../middlewares/authAdmin.js'
import upload from '../middlewares/multerConfig.js'

const router = Router()

router.post('/login', upload.none(), loginUser)
router.post('/users', upload.single('image'), createUser)

router.get('/users', authToken, authAdmin, getAllUsers)
router.get('/users/:id', authToken, getUser)
router.put('/users/:id', authToken, upload.single('image'), updateUser)
router.put('/users/password/:id', authToken, upload.none(), userUpdatePassword)
router.delete('/users/:id', authToken, deleteUser)

export const userRouter = (app) => app.use('/api', router)