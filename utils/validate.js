const UserModel = require('../models/user.model')
const KindergartenModel = require('../models/kindergarten.model')
const User = new UserModel
const Kindergarten = new KindergartenModel

const validateKindergarten = async (kindergarten)  => {
    const data = ['name', 'address', 'phone', 'email', 'user_id']

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
    const validateUser = await userExists(kindergarten.user_id)

    if(!validateUser.isValid) return validateUser

    return { isValid: true, user: validateUser.user }
}

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{9}$/

    if(!phoneRegex.test(phone)) return { 
        isValid: false,
        message: 'El teléfono introducido no es válido'
    }

    return { isValid: true }
}

const userExists = async (userId) => {
    try{
        const user = await User.getUser(userId)
        
        if(user) return { isValid: true, user: user }
    } catch (error) {
        return { isValid: false, message: error.message }
    }
}

const kindergartenExists = async (id) => {
    try {
        const kindergarten = await Kindergarten.getKindegarten(id)

        if(kindergarten) return true
    } catch (error) {
        return false
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
    validateKindergarten,
    userExists,
    kindergartenExists
}