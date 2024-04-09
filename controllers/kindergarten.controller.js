const { errorMessage, unauthorizedMessage, validationError } = require('../utils/errorHandler.js')
const { responseSuccessData, responseCreatedData } = require('../utils/responseHandler.js')
const Kindergarten = require('../models/kindergarten.model.js')
const UserModel = require('../models/user.model.js')
const User = new UserModel
const KindergartenModel = new Kindergarten

const { validateKindergarten, kindergartenExists } = require('../utils/validate.js')

const getAllKindergarten = async (req, res) => {
    try {
        const kindergartens = await KindergartenModel.getAllKindergarten()
        res.status(200).json(responseSuccessData(kindergartens))
    } catch(error) {
        res.status(500).json(errorMessage(`Error al obtener las guarderias: ${error.message}`))
    }
}

const getKindergarten = async (req, res) => {
    if (req.user.rol !== 'webadmin' && req.user.kindergarten_id !== req.params.id) {
        return res.status(401).json(unauthorizedMessage('No estas autorizado para acceder a esta guardería'))
    }

    try {
        const kindergarten = await KindergartenModel.getKindegarten(req.params.id)
        res.status(200).json(responseSuccessData(kindergarten))
    } catch(error) {
        res.status(500).json(errorMessage(`Error al obtener la guardería: ${error.message}`))
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
    
    // Comprobar si la validación es correcta
    if(!validation.isValid) {
        return res.status(400).json(validationError(validation.message))
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

        res.status(201).json(responseCreatedData('Se ha creado correctamente', kindergarten.insertId))
    } catch (error) {
        res.status(500).json(errorMessage(`Error al crear la guardería: ${error.message}`))
    }
}

const updateKindergarten = async (req, res) => {
    const { name, address, phone, email, userId } = req.body

    if (req.user.kindergarten_id !== req.params.id) {
        return res.status(401).json(unauthorizedMessage('No estas autorizado para acceder a esta guardería'))
    }

    const kindergarten = await kindergartenExists(req.params.id)

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json(validationError('El cuerpo de la solicitud está vacío'))
    }

    if (name === "" || address === "" || phone === "" || email === "" || userId === "") {
        return res.status(400).json(validationError('Las propiedades del objeto no pueden estar vacías'))
    }

    if(!kindergarten.isValid) { 
        return res.status(404).json(validationError(kindergarten.message, 404, 'Uknown'))
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
        return res.status(400).json(validationError(validation.message))
    }

    try {
        await KindergartenModel.updateKindergarten(req.params.id, data)
        res.status(200).json(responseSuccessData(data))
    } catch(error) {
        res.status(500).json(errorMessage(`Error al actualizar la guardería: ${error.message}`))       
    }
}

const deleteKindergarten = async (req, res) => {  
    try {
        const deleteKindergarten = await KindergartenModel.deleteKindergarten(req.params.id)
        if(deleteKindergarten) {
            res.status(200).json(responseSuccessData('Se ha borrado correctamente'))
        }
    } catch(error) {
        res.status(500).json(errorMessage(error.message))
    }
}

module.exports = {
    getAllKindergarten,
    getKindergarten,
    createKindergarten,
    updateKindergarten,
    deleteKindergarten
}