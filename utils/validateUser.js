export const validateUser = (user) => {
    const data = ['name', 'email', 'password', 'passwordConfirm']
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Comprobar campos requeridos
    for (const field of data) {
        if(!user[field]) {
            return { isValid: false, message: `El campo ${field} es requerido` }
        }
    }

    // Email válido
    if(!emailRegex.test(user.email)) {
        return { isValid: false, message: 'El email introducido no es válido'}
    }

    // Comparar contraseñas
    if(user.password !== user.passwordConfirm) {
        return { isValid: false, message: 'Las contraseñas no coinciden' }
    }

    // Validación de contraseña
    const validatePass = validatePassword(user.password)

    if(!validatePass.isValid) {
        return validatePass
    }

    return { isValid: true }
}

export const validatePassword = (password) => {
    const passRegex = /^(?=.*[A-Z])(?=.*\d{2,}).{8,}$/
    if (!passRegex.test(password)) {
        return { isValid: false, message: 'La contraseña debe tener una mayúscula, al menos 2 números y mínimo 8 caracteres' }
    }

    return { isValid: true }
}