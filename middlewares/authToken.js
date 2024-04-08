const jwt = require('jsonwebtoken')

const authToken = (req, res, next) => {
  const token = req.headers.authorization
  if(!token) return res.status(401).json({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Se necesita token para acceder'
        })
    

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if(err) return res.status(401).json({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'El token no es válido'
        })
    req.user = decodedToken
    next()
  })
}

module.exports = authToken