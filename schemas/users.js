const z = require('zod')
const { kindergartenExists } = require('../utils/validate')

const passRegex = /^(?=.*[A-Z])(?=.*\d{2,}).{8,}$/

const userSchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }),
    email: z.string().email({
        invalid_type_error: 'El email debe ser un string',
        required_error: 'El email es requerido',
        invalid_string_error: 'El email no es válido'
    }),
    kindergarten_id: z.number().optional().refine(async (id) => await kindergartenExists(id), {
        message: 'El kindergarten no existe en la base de datos'
    }),
    password: z.string().refine(password => passRegex.test(password), {
        message: 'La contraseña debe contener al menos una mayúscula y dos números'
    }),
    passwordConfirm: z.string(),
    rol: z.string(
        z.enum(['profesor', 'director']),
        {
            invalid_type_error: 'El dato introducido no es válido'
        }
    ).default('profesor')
}).refine(data => data.password === data.passwordConfirm, {
        message: 'Las contraseñas deben coincidir',
        path: ['passwordConfirm']
})

const userUpdateSchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).optional(),
    email: z.string().email({
        invalid_type_error: 'El email debe ser un string',
        required_error: 'El email es requerido',
        invalid_string_error: 'El email no es válido'
    }).optional(),
    kindergarten_id: z.number().optional(),
    password: z.string().refine(password => passRegex.test(password), {
        message: 'La contraseña debe contener al menos una mayúscula y dos números'
    }).optional(),
    newPassword: z.string().refine(password => passRegex.test(password), {
        message: 'La contraseña debe contener al menos una mayúscula y dos números'
    }).optional(),
    rol: z.string(
        z.enum(['profesor', 'director']),
        {
            invalid_type_error: 'El dato introducido no es válido'
        }
    ).default('profesor').optional()
}).refine(data => data.password === data.newPassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['newPassword']
})

const validateUserSchema = (input) => {
    return userSchema.safeParseAsync(input)
}

const validatePartialUser = (input) => {
    return userUpdateSchema.safeParse(input)
}

module.exports = {
    validateUserSchema,
    validatePartialUser
}
