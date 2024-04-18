const KindergartenModel = require('../models/kindergarten.model.js')
const UserModel = require('../models/user.model.js')

const User = new UserModel
const Kindergarten = new KindergartenModel

const { validateKindergartenSchema, validatePartialKindergarten } = require('../schemas/kindergarten.js')
const { errorMessage, unauthorizedMessage, validationError } = require('../utils/errorHandler.js')
const { responseSuccessData, responseCreatedData } = require('../utils/responseHandler.js')

const getAllKindergarten = async (req, res) => {
    const { id, rol } = req.user

    if (id !== Number(req.params.id) && rol !== 'webadmin') {
        return res.status(401).json(unauthorizedMessage())
    }

    try {
        const kindergartens = await Kindergarten.getAll()
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
        const kindergarten = await Kindergarten.getId(req.params.id)
        res.status(200).json(responseSuccessData(kindergarten))
    } catch(error) {
        res.status(500).json(errorMessage(`Error al obtener la guardería: ${error.message}`))
    }
}

const createKindergarten = async (req, res) => {
    // validacion de los datos
    const data = await validateKindergartenSchema(req.body)

    if(!data.success) {
        return res.status(400).json(validationError(JSON.parse(data.error.message)))
    }

    try{
        // Obtener los datos del usuario que crea la guarderia
        const { id } = req.user
        const user = await User.getUser(id)

        // Crear la nueva guarderia
        data.data.user_id = id
        const kindergarten = await Kindergarten.create(data.data)
        
        user.kindergarten_id = kindergarten.insertId
        await User.updateUser(id, user)

        res.status(201).json(responseCreatedData('Se ha creado correctamente', { kindergarten: kindergarten.insertId, userId: user.id}))
    } catch (error) {
        res.status(500).json(errorMessage(`Error al crear la guardería: ${error.message}`))
    }
}

// TODO: validacion con zod
const updateKindergarten = async (req, res) => {
    const updateKg = await validatePartialKindergarten(req.body)
    
    if (req.user.kindergarten_id !== Number(req.params.id)) {
        return res.status(401).json(unauthorizedMessage('No estas autorizado para acceder a esta guardería'))
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json(validationError('El cuerpo de la solicitud está vacío'))
    }

    if(!updateKg.success) {
        return res.status(400).json(validationError(JSON.parse(updateKg.error.message)))
    }

    console.log(updateKg.data)

    try {
        const result = await Kindergarten.update(req.params.id, updateKg.data)
        res.status(200).json(responseSuccessData(result))
    } catch(error) {
        res.status(500).json(errorMessage(`Error al actualizar la guardería: ${error.message}`))       
    }
}

const deleteKindergarten = async (req, res) => {  
    try {
        const deleteKindergarten = await Kindergarten.delete(req.params.id)
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