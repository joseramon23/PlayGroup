const z = require('zod')
const { userExists } = require('../utils/validate')

const phoneRegex = /^\d{9}$/

const kindergartenSchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).max(250),
    address: z.string().optional(),
    phone: z.number({
        invalid_type_error: 'El teléfono debe ser un número'
    }).refine(phone => phoneRegex.test(phone), {
        message: 'El número introducido no es un teléfono correcto'
    }).optional(),
    email: z.string().email({
        invalid_type_error: 'El email debe ser un string',
        required_error: 'El email es requerido',
        invalid_string_error: 'El email no es válido'
    }),
    user_id: z.number().refine(async (id) => await userExists(id), {
        message: 'El usuario no existe en la base de datos'
    })
})

const validateKindergartenSchema = (input) => {
    return kindergartenSchema.safeParseAsync(input)
}

module.exports = {
    validateKindergartenSchema
}