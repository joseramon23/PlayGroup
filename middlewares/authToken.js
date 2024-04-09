const jwt = require('jsonwebtoken')
const { unauthorizedMessage } = require('../utils/errorHandler')

const authToken = (req, res, next) => {
  const token = req.headers.authorization
  if(!token) return res.status(401).json(unauthorizedMessage('Se necesita token para acceder'))
    

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if(err) return res.status(401).json(unauthorizedMessage('No tienes permiso para esta acción'))
    req.user = decodedToken
    next()
  })
}

module.exports = authToken