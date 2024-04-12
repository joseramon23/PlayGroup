const express = require('express')
const userController = require('../controllers/user.controller')
const authToken = require('../middlewares/authToken')
const authAdmin = require('../middlewares/authAdmin')
const upload = require('../middlewares/multerConfig')

const router = express.Router()

router.post('/login', upload.none(), userController.loginUser)
router.post('/users', upload.single('image'), userController.createUser)

router.get('/users', authToken, authAdmin, userController.getAllUsers)
router.get('/users/:id', authToken, userController.getUser)
router.put('/users/:id', authToken, upload.single('image'), userController.updateUser)
router.put('/users/password/:id', authToken, upload.none(), userController.userUpdatePassword)

module.exports = router