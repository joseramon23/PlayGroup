const User = require('../models/user.model')

const validateKindergarten = (kindergarten) => {
    const data = ['name', 'address', 'phone', 'email', 'userId']
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{9}$/
    const user = User.getUser(kindergarten.userId)

    // Comprobar si los campos no están vacios
    for (const field of data) {
        if(!kindergarten[field]) {
            return { isValid: false, message: `El campo ${field} es requerido` }
        }
    }

    // Comprobar el email
    if(!emailRegex.test(kindergarten.email)) {
        return { isValid: false, message: 'El email introducido no es válido' }
    }

    // Comprobar el teléfono
    if(!phoneRegex.test(kindergarten.phone)) {
        return { isValid: false, message: 'El teléfono introducido no es válido' }  
    }

    // Comprobar si el usuario existe
    if(!user.length <= 0) {
        return { isValid: false, message: 'El usuario no existe' }
    }

    return { isValid: true }
}

module.exports = { validateKindergarten }