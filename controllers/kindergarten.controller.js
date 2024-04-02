const Kindergarten = require('../models/kindergarten.model.js')
const KindergartenModel = new Kindergarten
const { validateKindergarten } = require('../utils/validate.js')

const getAllKindergarten = async (req, res) => {
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
    const { name, address, phone, email, userId } = req.body
    const validation = await validateKindergarten(req.body)
    
    // Comprobar si la validación es correcta
    if(!validation.isValid) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: validation.message
        })
    }

    // Crear la data para insertar
    const data = {
        name: name.trim(),
        address: address,
        phone: phone,
        email: email,
        user_id: userId
    }
    
    // Insertar la nueva guarderia
    try {
        const kindergarten = await KindergartenModel.createKindergarten(data)

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
    const kindergarten = KindergartenModel.getKindegarten(req.params.id)

    if(!kindergarten) return res.status(404).json({
        statusCode: 404,
        statusMessage: 'Unknown',
        message: 'No se ha encontrado la guardería'
    })

    const data = {
        name: name ? name : kindergarten.name,
        address: address ? address : kindergarten.address,
        phone: phone ? phone : kindergarten.phone,
        email: email ? email : kindergarten.email,
        user_id: userId ? userId : kindergarten.user_id
    }

    const validation = await validateKindergarten(req.body)
    
    // Comprobar si la validación es correcta
    if(!validation.isValid) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: validation.message
        })
    }

    try {
        const updateKindergarten = await KindergartenModel.updateKindergarten(req.params.id, data)
        console.log(updateKindergarten)
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
    try {
        const deleteKindergarten = await KindergartenModel.deleteKindergarten(kindergartenId)
        if(deleteKindergarten) {
            res.status(202).json({
                statusCode: 200,
                statusMessage: 'Deleted',
                message: 'Se ha borrado correctamente'
            })
        }
    } catch(error) {
        res.status(500).json({
            statusCode: 500,
            statusMessage: 'Error',
            message: `Error al borrar la guardería: ${error.message}`
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