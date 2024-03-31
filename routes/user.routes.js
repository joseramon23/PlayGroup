const express = require('express')
const userController = require('../controllers/user.controller')

const router = express.Router()

router.get('/users', userController.getAllUsers)
router.get('/users/:id', userController.getUser)
router.post('/users', userController.createUser)
router.put('/users/:id', userController.updateUser)
router.put('/users/password/:id', userController.userUpdatePassword)

module.exports = router