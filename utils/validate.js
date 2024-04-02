const UserModel = require('../models/user.model')
const User = new UserModel

const validateUser = (user) => {
    const data = ['name', 'email', 'password', 'passwordConfirm']

    // Comprobar campos requeridos
    const isEmpty = fieldIsEmpty(user, data)

    if(!isEmpty.isValid) return isEmpty

    // Email válido
    const validateEmail = validateIsEmail(user.email)

    if(!validateEmail.isValid) return validateEmail

    // Comparar contraseñas
    if(user.password !== user.passwordConfirm) {
        return { isValid: false, message: 'Las contraseñas no coinciden' }
    }

    // Validación de contraseña
    const validatePass = validatePassword(user.password)

    if(!validatePass.isValid) return validatePass

    return { isValid: true }
}

const validateKindergarten = async (kindergarten)  => {
    const data = ['name', 'address', 'phone', 'email', 'userId']

    // Comprobar campos requeridos
    const isEmpty = fieldIsEmpty(kindergarten, data)

    if(!isEmpty.isValid) return isEmpty

    // Comprobar email
    const validateEmail = validateIsEmail(kindergarten.email)

    if(!validateEmail.isValid) return validateEmail

    // Comprobar telefono
    const validatePhone = validatePhoneNumber(kindergarten.phone)

    if(!validatePhone.isValid) return validatePhone

    // Comprobar si existe el usuario
    const validateUser = await userExists(kindergarten.userId)

    if(!validateUser.isValid) return validateUser

    return { isValid: true }
}

const validatePassword = (password) => {
    const passRegex = /^(?=.*[A-Z])(?=.*\d{2,}).{8,}$/
    if(!passRegex.test(password)) {
        return { isValid: false, message: 'La contraseña debe tener una mayúscula, al menos 2 números y mínimo 8 caracteres' }
    }

    return { isValid: true }
}

const validateIsEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email)) {
        return { isValid: false, message: 'El email introducido no es correcto'}
    }

    return { isValid: true }
}

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{9}$/

    if(!phoneRegex.test(phone)) return { 
        isValid: false,
        message: 'El telefono introducido no es valido'
    }

    return { isValid: true }
}

const userExists = async (userId) => {
    try{
        const user = await User.getUser(userId)
        
        if(user) return { isValid: true }
    } catch (error) {
        return { isValid: false, message: error.message }
    }
} 

const fieldIsEmpty = (user, data) => {
    const emptyFields = {}

    for (const field of data) {
        if(!user[field]) {
            emptyFields[field] = `El campo ${field} es requerido`
        }
    }

    if(Object.keys(emptyFields).length > 0) {
        return { isValid:false, message: emptyFields }
    }

    return { isValid: true }
}

module.exports = { 
    validateUser,
    validatePassword ,
    validateIsEmail,
    validatePhoneNumber,
    validateKindergarten,
    userExists
}