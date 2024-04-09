const jwt = require('jsonwebtoken')
const { unauthorizedMessage } = require('../utils/errorHandler')

const authAdmin = (req, res, next) => {
    const token = req.headers.authorization
    const { rol } = jwt.verify(token, process.env.JWT_SECRET)

    if(rol !== 'webadmin') return res.status(401).json(unauthorizedMessage('No estas autorizado para hacer esta acción'))
    next()
}

module.exports = authAdmin