const fs = require('node:fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 
const UserModel = require('../models/user.model.js')
const User = new UserModel 
const { validatePassword, validateUser, kindergartenExists, validateIsEmail } = require('../utils/validate.js')
const { unauthorizedMessage, errorMessage, validationError } = require('../utils/errorHandler.js')
const { responseSuccessData, responseCreatedData } = require('../utils/responseHandler.js')

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers()
        res.json(users)
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
        const userId = req.params.id
        const user = await User.getUser(userId)
        res.status(200).json(responseSuccessData(user))
    } catch (error) {
        res.status(500).json(errorMessage(error.message))
    }
}

const createUser = async (req, res) => {
    const { name, email, kindergarten_id, password, rol } = req.body
    const image = req.file?.filename

    const validation = validateUser(req.body)
    // Validar los datos del usuario
    if (!validation.isValid) {
        return res.status(400).json(validationError(validation.message))
    }

    if (kindergarten_id !== undefined) {
        const validateKindergarten = await kindergartenExists(kindergarten_id)

        if(!validateKindergarten.isValid) {
            return res.status(400).json(validationError(validateKindergarten.message))
        }
    }

    // Encriptar la contraseña
    const encryptPass = bcrypt.hashSync(password, 10)
    
    // Crear la data para insertar
    const data = {
        name: name.trim(),
        email: email,
        password: encryptPass,
        kindergarten_id: kindergarten_id ? kindergarten_id : null,
        rol: !rol ? "profesor" : rol,
        image: !image ? "default.jpg" : image
    }
    
    try {
        const user = await User.createUser(data)
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
    const { name, email, kindergarten_id, rol } = req.body
    const updateImage = req.file?.filename
    const { id } = req.user

    // comprobar si el id del parametro es igual al del token
    if (id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage())
    }

    // comprobar si el usuario existe
    const user = await User.getUser(req.params.id)
    if(!user) return res.status(404).json(validationError('No se ha encontrado el usuario', 404, 'Unknown'))

    // Preparar la data con los nuevos datos y los antiguos
    const data = {
        name: name ? name : user.name,
        email: email ? email : user.email,
        kindergarten_id: kindergarten_id ? kindergarten_id : user.kindergarten_id,
        password: user.password,
        rol: rol ? rol : user.rol,
        image: user.image,
        updated_at: new Date()
    }
    
    // si existe nueva imagen, borra la anterior y actualiza el campo
    if(updateImage) {
        fs.unlinkSync(`./public/images/users/${data.image}`)
        data.image = updateImage
    }

    // validacion del email
    const validation = await validateIsEmail(data.email)
    if (!validation.isValid) return res.status(400).json(validationError(validation.message))

    try {
        await User.updateUser(req.params.id, data)
        res.status(200).json(responseCreatedData('Se ha actualizado correctamente', data))
    } catch(error) {
        res.status(500).json(errorMessage(`Error al actualizar el usuario: ${error.message}`))
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.id
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
    const { password, newPassword } = req.body
    const validatePass = validatePassword(newPassword)
    const data = {
        name: user.name,
        email: user.email,
        password: user.password,
        rol: user.rol,
        image: user.image,
        updated_at: new Date()
    }

    if(!validatePass.isValid) {
        return res.status(400).json(validationError(validatePass.message))
    }
    
    try {

        if(bcrypt.compareSync(password, user.password)) {
            // Actualizar contraseña
            const encryptNewPass = bcrypt.hashSync(newPassword, 10)
            data.password = encryptNewPass
            await User.updateUser(userId, data)
            res.status(201).json(responseSuccessData('Contraseña actualizada', 'Updated', 201))
        } else {
            res.status(400).json(validationError('Contraseña incorrecta'))
        }
    } catch(error) {
        res.status(500).json(errorMessage(`Error al borrar el usuario: ${error.message}`))
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

        res.status(200).json(responseCreatedData('Sesion iniciada correctamente', [user.id, token], 'Login'))
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