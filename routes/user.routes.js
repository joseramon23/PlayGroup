import express from 'express'
import UserController from '../controllers/user.controller.js'

const router = express.Router()

router.get('/users', UserController.getAllUsers)
router.get('/users/:id', UserController.getUser)
router.post('/users', UserController.createUser)
router.put('/users/:id', UserController.updateUser)

export default router