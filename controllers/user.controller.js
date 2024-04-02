const UserModel = require('../models/user.model.js')
const User = new UserModel 
const { validatePassword, validateUser, validateIsEmail } = require('../utils/validate.js')
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken') 

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers()
        res.json(users)
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al obtener los usuarios: ${error.message}`
        })
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.getUser(userId)
        res.status(200).json({
            user: user
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al obtener el usuario: ${error.message}`
        })
    }
}

const createUser = async (req, res) => {
    const { name, email, password, rol, image } = req.body
    const validation = validateUser(req.body)
    // Validar los datos del usuario
    if (!validation.isValid) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: validation.message
        })
    }

    // Encriptar la contraseña
    const encryptPass = bcrypt.hashSync(password, 10)
    
    // Crear la data para insertar
    const data = {
        name: name.trim(),
        email: email,
        password: encryptPass,
        rol: !rol ? "profesor" : rol,
        image: !image ? "default.jpg" : image
    }
    
    try {
        const user = await User.createUser(data)
        const token = jwt.sign({ id: user.insertId }, process.env.JWT_SECRET, { expiresIn: '1d'}) // Crear token de autenticación

        res.status(201).json({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Se ha creado correctamente',
            id: user.insertId,
            token: token
        })

    } catch(error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al crear el usuario: ${error.message}`
        })
    }
}

// TODO REVISAR LA VALIDACION DE NUEVO
const updateUser = async (req, res) => {
    const { name, email, rol, image } = req.body
    const user = await User.getUser(req.params.id)

    if(!user) return res.status(404).json({
        statusCode: 404,
        statusMessage: 'Unknown',
        message: 'No se ha encontrado el usuario'
    })

    // Preparar la data con los nuevos datos y los antiguos
    const data = {
        name: name ? name : user.name,
        email: email ? email : user.email,
        rol: rol ? rol : user.rol,
        image: image ? image : user.image,
        updated_at: new Date()
    }

    try {
        const updatedUser = await User.updateUser(req.params.id, data)
        res.status(200).json({
            statusCode: 200,
            statusMessage: 'Updated',
            message: 'Se ha actualizado correctamente',
            data: updatedUser
        })
    } catch(error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al actualizar el usuario: ${error.message}`
        })
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.id
    try {
        const deleteUser = await User.deleteUser(userId)
        if(deleteUser) {
            res.status(202).json({
                statusCode: 200,
                statusMessage: 'Deleted',
                message: 'Se ha borrado correctamente',
                data: deleteUser
            })
        }
    } catch(error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al borrar el usuario: ${error.message}`
        })
    }
}

const userUpdatePassword = async (req, res) => {
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
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad request',
            message: validatePass.message
        })
    }
    
    try {

        if(bcrypt.compareSync(password, user.password)) {
            // Actualizar contraseña
            const encryptNewPass = bcrypt.hashSync(newPassword, 10)
            data.password = encryptNewPass
            await User.updateUser(userId, data)
            res.status(201).json({
                statusCode: 201,
                statusMessage: 'Updated',
                message: 'contraseña actualizada'
            })
        } else {
            res.status(400).json({
                statusCode: 400,
                statusMessage: 'Bad request',
                message: 'contraseña incorrecta'
            })
        }
    } catch(error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al borrar el usuario: ${error.message}`
        })
    }


}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    userUpdatePassword
}