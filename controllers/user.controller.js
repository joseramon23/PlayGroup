import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const validateUser = (user) => {
    const data = ['name', 'email', 'password', 'passwordConfirm']
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Comprobar campos requeridos
    for (const field of data) {
        if(!user[field]) {
            return { isValid: false, message: `El campo ${field} es requerido` }
        }
    }

    // Email válido
    if(!emailRegex.test(user.email)) {
        return { isValid: false, message: 'El email introducido no es válido'}
    }

    // Comparar contraseñas
    if(user.password !== user.passwordConfirm) {
        return { isValid: false, message: 'Las contraseñas no coinciden' }
    }

    // Validación de contraseña
    const validatePass = validatePassword(user.password)

    if(!validatePass.isValid) {
        return validatePass
    }

    return { isValid: true }
}

const validatePassword = (password) => {
    const passRegex = /^(?=.*[A-Z])(?=.*\d{2,}).{8,}$/
    if (!passRegex.test(password)) {
        return { isValid: false, message: 'La contraseña debe tener una mayúscula, al menos 2 números y mínimo 8 caracteres' }
    }

    return { isValid: true }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers()
        res.json(users)
    } catch (error) {
        res.status(500).json({message: "Error al obtener los usuarios", error: error.message})
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
        res.status(500).json({message: "Error al obtener el usuario", messageError: error.message})
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
        name: name,
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
        res.status(500).json({message: "Error al crear el usuario", messageError: error.message})
    }
}

const updateUser = async (req, res) => {
    const { name, email, rol, image } = req.body
    const user = await User.getUser(req.params.id)

    if(!user) return res.status(404).json({
        statusCode: 404,
        statusMessage: 'Unknown',
        message: 'No se ha encontrado el usuario'
    })

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
        res.status(500).json({message: "Error al actualizar el usuario", messageError: error.message})
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
        res.status(500).json({message: "Error al borrar el usuario", messageError: error.message})
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
        res.status(500).json({message: "Error al cambiar la contraseña", messageError: error.message})
    }


}

export default {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    userUpdatePassword
}