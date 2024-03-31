const express = require('express')
const kindergartenController = require('../controllers/kindergarten.controller')

const router = express.Router()

router.get('/kindergarten', kindergartenController.getAllKindergarten)
router.get('/kindergarten/:id', kindergartenController.getKindergarten)
router.post('/kindergarten', kindergartenController.createKindergarten)
router.put('/kindergarten/:id', kindergartenController.updateKindergarten)
router.delete('/kindergarten/:id', kindergartenController.deleteKindergarten)

module.exports = router