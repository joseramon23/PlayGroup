import z from 'zod'
import { kindergartenExists } from '../utils/validate'

const studentSchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(1, 'El nombre está vacío').max(250),
    birthdate: z.date({
        invalid_type_error: 'La fecha de nacimiento debe ser una fecha',
        required_error: 'La fecha de nacimiento es requreida'
    }),
    kindergarten_id: z.number().refine(async (id) => await kindergartenExists(id), {
        message: 'La guarderia no existe en la base de datos'
    })
})

export const validateStudentSchema = (input) => {
    return studentSchema.safeParseAsync(input)
}

export const validatePartialStudent = (input) => {
    return studentSchema.partial().safeParseAsync(input)
}