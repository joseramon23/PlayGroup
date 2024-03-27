import express from 'express'
import userController from '../controllers/user.controller.js'

const router = express.Router()

router.get('/users', userController.getAllUsers)
router.get('/users/:id', userController.getUser)
router.post('/users', userController.createUser)
router.put('/users/:id', userController.updateUser)
router.put('/users/password/:id', userController.userUpdatePassword)

export default router