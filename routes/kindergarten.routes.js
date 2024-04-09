const express = require('express')
const kindergartenController = require('../controllers/kindergarten.controller')
const authToken = require('../middlewares/authToken')
const authAdmin = require('../middlewares/authAdmin')

const router = express.Router()

router.get('/kindergarten', authToken, authAdmin, kindergartenController.getAllKindergarten)
router.get('/kindergarten/:id', authToken, kindergartenController.getKindergarten)
router.post('/kindergarten', authToken, kindergartenController.createKindergarten)
router.put('/kindergarten/:id', authToken, kindergartenController.updateKindergarten)
router.delete('/kindergarten/:id', authToken, authAdmin, kindergartenController.deleteKindergarten)

module.exports = router