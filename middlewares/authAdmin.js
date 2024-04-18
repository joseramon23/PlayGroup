import jwt from 'jsonwebtoken'
import { unauthorizedMessage } from '../utils/errorHandler.js'

export const authAdmin = (req, res, next) => {
    const token = req.headers.authorization
    const { rol } = jwt.verify(token, process.env.JWT_SECRET)

    if(rol !== 'webadmin') return res.status(401).json(unauthorizedMessage('No estas autorizado para hacer esta acción'))
    next()
}
