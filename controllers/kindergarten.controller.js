const jwt = require('jsonwebtoken')
const Kindergarten = require('../models/kindergarten.model.js')
const UserModel = require('../models/user.model.js')
const User = new UserModel
const KindergartenModel = new Kindergarten

const { validateKindergarten, kindergartenExists } = require('../utils/validate.js')

const getAllKindergarten = async (req, res) => {
    const token = req.headers.authorization
    const { rol } = jwt.verify(token, process.env.JWT_SECRET)

    if (rol !== 'webadmin') {
        return res.status(401).json({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'No estas autorizado para hacer esta acción'
        })
    }
    try {
        const kindergartens = await KindergartenModel.getAllKindergarten()
        res.status(200).json({
            statusCode: 200,
            statusMessage: 'Accepted',
            data: kindergartens
        })
    } catch(error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al obtener las guarderias: ${error.message}`
        })
    }
}

const getKindergarten = async (req, res) => {
    const token = req.headers.authorization
    const { kindergarten_id } = jwt.verify(token, process.env.JWT_SECRET)

    if (kindergarten_id !== req.params.id) {
        return res.status(401).json({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'No estas autorizado para acceder a esta guardería'
        })
    }

    try {
        const kindergartenId = req.params.id
        const kindergarten = await KindergartenModel.getKindegarten(kindergartenId)
        res.status(200).json({
            statusCode: 200,
            statusMessage: 'Accepted',
            kindergarten: kindergarten
        })
    } catch(error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al obtener la guardería: ${error.message}`
        })
    }
}

const createKindergarten = async (req, res) => {
    const { name, address, phone, email, user_id } = req.body
    // Crear la data para insertar
    const data = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        user_id: user_id
    }

    const validation = await validateKindergarten(data)
    console.log(validation)
    
    // Comprobar si la validación es correcta
    if(!validation.isValid) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: validation.message
        })
    }
    
    // Insertar la nueva guarderia
    try {
        const kindergarten = await KindergartenModel.createKindergarten(data)

        // Data para actualizar la guarderia del usuario
        const dataUser = {
            name: validation.user.name,
            email: validation.user.email,
            kindergarten_id: kindergarten.insertId,
            password: validation.user.password,
            rol: validation.user.rol,
            image: validation.user.image,
            updated_at: new Date()
        }
        
        await User.updateUser(user_id, dataUser)

        res.status(201).json({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Se ha creado correctamente',
            id: kindergarten.insertId
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al crear la guardería: ${error.message}`
        })
    }
}

const updateKindergarten = async (req, res) => {
    const { name, address, phone, email, userId } = req.body
    const token = req.headers.authorization
    const { kindergarten_id } = jwt.verify(token, process.env.JWT_SECRET)

    if (kindergarten_id !== req.params.id) {
        return res.status(401).json({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'No estas autorizado para acceder a esta guardería'
        })
    }

    const kindergarten = await kindergartenExists(req.params.id)

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'El cuerpo de la solicitud está vacío'
        })
    }

    if (name === "" || address === "" || phone === "" || email === "" || userId === "") {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Las propiedades del objeto no pueden estar vacías'
        })
    }

    if(!kindergarten.isValid) { 
        return res.status(404).json({
            statusCode: 404,
            statusMessage: 'Unknown',
            message: kindergarten.message
        })
    }

    const data = {
        name: name ? name : kindergarten.data.name,
        address: address ? address : kindergarten.data.address,
        phone: phone ? phone : kindergarten.data.phone,
        email: email ? email : kindergarten.data.email,
        user_id: userId ? userId : kindergarten.data.user_id
    }

    const validation = await validateKindergarten(data)
    
    // Comprobar si la validación es correcta
    if(!validation.isValid) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: validation.message
        })
    }

    try {
        await KindergartenModel.updateKindergarten(req.params.id, data)
        res.status(200).json({
            statusCode: 200,
            statusMessage: 'Updated',
            message: 'Se ha actualizado correctamente',
            data: data
        })
    } catch(error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al actualizar la guardería: ${error.message}`
        })       
    }
}

const deleteKindergarten = async (req, res) => {
    const kindergartenId = req.params.id
    const token = req.headers.authorization
    const { rol } = jwt.verify(token, process.env.JWT_SECRET)

    if (rol !== 'webadmin') {
        return res.status(401).json({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'No estas autorizado para hacer esta acción'
        })
    }
    
    try {
        const deleteKindergarten = await KindergartenModel.deleteKindergarten(kindergartenId)
        if(deleteKindergarten) {
            res.status(200).json({
                statusCode: 200,
                statusMessage: 'Deleted',
                message: 'Se ha borrado correctamente'
            })
        }
    } catch(error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: error.message
        })
    }
}

module.exports = {
    getAllKindergarten,
    getKindergarten,
    createKindergarten,
    updateKindergarten,
    deleteKindergarten
}