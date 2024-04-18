import z from 'zod'

const phoneRegex = /^\d{9}$/

const kindergartenSchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(1, 'El nombre está vacío').max(250),
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
    user_id: z.number().optional()
})

export const validateKindergartenSchema = (input) => {
    return kindergartenSchema.safeParseAsync(input)
}

export const validatePartialKindergarten = (input) => {
    return kindergartenSchema.partial().safeParseAsync(input)
}