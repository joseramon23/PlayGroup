import z from 'zod'
import { kindergartenExists } from '../utils/validate.js'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

const studentSchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(1, 'El nombre está vacío').max(250),
    birthdate: z.string().refine(date => dateRegex.test(date), {
        message: 'La fecha introducida no es válida'
    }),
    kindergarten_id: z.number().or(z.string().transform(Number)).refine(async (id) => await kindergartenExists(id), {
        message: 'La guarderia no existe en la base de datos'
    })
})

export const validateStudentSchema = (input) => {
    return studentSchema.safeParseAsync(input)
}

export const validatePartialStudent = (input) => {
    return studentSchema.partial().safeParseAsync(input)
}