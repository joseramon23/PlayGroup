import { Router } from 'express'
import { getAllKindergarten, createKindergarten, getKindergarten, updateKindergarten, deleteKindergarten } from '../controllers/kindergarten.controller.js'
import { authToken } from '../middlewares/authToken.js'
import { authAdmin } from '../middlewares/authAdmin.js'

const router = Router()

router.get('/kindergarten', authToken, authAdmin, getAllKindergarten)
router.post('/kindergarten', authToken, createKindergarten)

router.get('/kindergarten/:id', authToken, getKindergarten)
router.put('/kindergarten/:id', authToken, updateKindergarten)
router.delete('/kindergarten/:id', authToken, authAdmin, deleteKindergarten)

export const kindergartenRouter = (app) => app.use('/api', router)