import z from 'zod'
import { kindergartenExists } from '../utils/validate.js'

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
    kindergarten_id: z.number().refine(async (id) => await kindergartenExists(id), {
        message: 'El kindergarten no existe en la base de datos'
    }).optional(),
    password: z.string().refine(password => passRegex.test(password), {
        message: 'La contraseña debe contener al menos una mayúscula y dos números'
    }),
    passwordConfirm: z.string(),
    rol: z.string((['profesor', 'director']),
        {
            invalid_type_error: 'El dato introducido no es válido'
        }
    ).default('profesor')
})

const passwordSchema = z.object({
    password: z.string().min(1, 'La antigua contraseña es requerida'),
    newPass: z.string().min(1, 'Debes ingresar una nueva contraseña').refine(password => passRegex.test(password), {
        message: 'La contraseña debe contener al menos una mayúscula y dos números'
    })
})

export const validateUserSchema = (input) => {
    return userSchema.safeParseAsync(input)
}

export const validatePartialUser = (input) => {
    return userSchema.partial().safeParseAsync(input)
}

export const validatePassUpdate = (input) => {
    return passwordSchema.safeParse(input)
} 
