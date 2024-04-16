const fs = require('node:fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserModel = require('../models/user.model.js')
const User = new UserModel

const { validateUserSchema, validatePartialUser } = require('../schemas/users.js')
const { unauthorizedMessage, errorMessage, validationError } = require('../utils/errorHandler.js')
const { responseSuccessData, responseCreatedData } = require('../utils/responseHandler.js')

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers()
        res.status(200).json(responseCreatedData('Petición aceptada', users, 'Accepted'))
    } catch (error) {
        res.status(500).json(errorMessage(`Error al obtener los usuarios: ${error.message}`))
    }
}

const getUser = async (req, res) => {
    const { id, rol } = req.user

    if (id !== Number(req.params.id) && rol !== 'webadmin') {
        return res.status(401).json(unauthorizedMessage())
    }

    try {
        const user = await User.getUser(req.params.id)
        res.status(200).json(responseCreatedData('Petición aceptada', user, 'Accepted'))
    } catch (error) {
        res.status(500).json(errorMessage(error.message))
    }
}

const createUser = async (req, res) => {
    // validación del los datos
    const data = await validateUserSchema(req.body)
    const image = req.file?.filename

    if(!data.success) {
        return res.status(400).json(validationError(JSON.parse(data.error.message)))
    }

    const { passwordConfirm, ...userData } = data.data

    // encriptar contraseña
    const encryptPass = bcrypt.hashSync(userData.password, 10)

    userData.password = encryptPass
    userData.image = !image ? 'default.jpg' : image

    try {
        const user = await User.createUser(userData)
        const token = jwt.sign(
            { id: user.insertId, kindergarten_id: user.kindergarten_id, rol: user.rol }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
        ) // Crear token de autenticación

        res.status(201).json(responseCreatedData('Se ha creado correctamente', {id: user.insertId, token: token}))

    } catch(error) {
        res.status(500).json(errorMessage(`Error al crear el usuario: ${error.message}`))
    }
}

const updateUser = async (req, res) => {
    const updateUser = validatePartialUser(req.body)
    const updateImage = req.file?.filename
    const { id } = req.user

    if(!updateUser.success) {
        return res.status(400).json(validationError(JSON.parse(data.error.message)))
    }

    // comprobar si el id del parametro es igual al del token
    if(id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage())
    }

    // comprobar si el usuario existe
    const user = await User.getUser(req.params.id)
    if(!user) return res.status(404).json(validationError('No se ha encontrado el usuario', 404, 'Unknown'))

    // agregar los nuevos datos al usuario existente
    const data = {
        name: updateUser.data?.name ? updateUser.data.name : user.name,
        email: updateUser.data?.email ? updateUser.data.email : user.email,
        kindergarten_id: updateUser.data?.kindergarten_id ? updateUser.data.kindergarten_id : user.kindergarten_id,
        password: user.password,
        rol: updateUser.data?.rol ? updateUser.data.rol : user.rol,
        image: user.image,
        updated_at: new Date()
    }

    // si existe nueva imagen, borra la anterior y actualiza el campo
    if(updateImage) {
        fs.unlinkSync(`./public/images/users/${data.image}`)
        data.image = updateImage
    }

    try {
        await User.updateUser(req.params.id, data)
        res.status(200).json(responseCreatedData('Se ha actualizado correctamente', data))
    } catch(error) {
        res.status(500).json(errorMessage(`Error al actualizar el usuario: ${error.message}`))
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.id
    const { id } = req.user

    // comprobar si el id del parametro es igual al del token
    if (id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage())
    }
    
    try {
        const deleteUser = await User.deleteUser(userId)
        if(deleteUser) {
            res.status(200).json(responseSuccessData(deleteUser, 'Deleted'))
        }
    } catch(error) {
        res.status(500).json(errorMessage(`Error al borrar el usuario: ${error.message}`))
    }
}

const userUpdatePassword = async (req, res) => {
    const { id } = req.user

    if (id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage())
    }
    
    const userId = req.params.id
    const user = await User.getUser(userId)
    const validatePass = validatePartialUser(req.body)

    if(!validatePass.success) {
        return res.status(400).json(validationError(JSON.parse(validatePass.error.message)))
    }

    try {
        // comprobar si la contraseña introducida es igual a la base de datos
        if(bcrypt.compareSync(validatePass.data.password, user.password)) {
            user.password = validatePass.data.password
            // Actualizar contraseña
            const encryptNewPass = bcrypt.hashSync(user.password, 10)
            user.password = encryptNewPass
            await User.updateUser(userId, user)
            res.status(201).json(responseSuccessData('Contraseña actualizada', 'Updated', 201))
        } else {
            res.status(400).json(validationError('Contraseña incorrecta'))
        }
    } catch(error) {
        res.status(500).json(errorMessage(`Error al actualizar contraseña: ${error.message}`))
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json(validationError('El cuerpo de la solicitud está vacío'))
    }

    if (email === "" || password === "") {
        return res.status(400).json(validationError('Los campos estan vacios'))
    }

    try {
        const user = await User.loginUser(email)

        if(!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json(validationError('La contraseña es incorrecta'))
        }

        const token = jwt.sign(
            { id: user.id, kindergarten_id: user.kindergarten_id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
        )
        res.status(200).json(responseCreatedData('Sesion iniciada correctamente', {id: user.id, token: token}, 'Login'))
    } catch (error) {
        res.status(500).json(errorMessage(`Error al iniciar sesión: ${error.message}`))
    }
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    userUpdatePassword,
    loginUser
}