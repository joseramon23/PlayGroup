import { validateStudentSchema, validatePartialStudent } from '../schemas/student.js'

describe('Validación de estudiantes', () => {
    test('Deberia pasar la validación con un estudiante correcto', async () => {
        const student = {
            name: 'John Doe',
            birthdate: '2000-01-01',
            kindergarten_id: 1
        }

        const result = await validateStudentSchema(student)
        expect(result.success).toBe(true)
    })

    test('Deberia fallar el test con un estudiante inválido', async () => {
        const student = {
            name: '',
            birthdate: '2000-01-01',
            kindergarten_id: 1
        }

        const result = await validateStudentSchema(student)
        expect(result.success).toBe(false)
        expect(result.error.message).toBe('El nombre está vacío')
    })
})

describe('Validación parcial de un estudiante', () => {
    test('Deberia pasar la validación con un estudiante parcial', async () => {
        const partialStudent = {
            name: 'John Doe'
        }

        const result = await validatePartialStudent(partialStudent)
        expect(result.success).toBe(true)
    })

    test('Debería fallar en la validación del estudiante', async () => {
        const partialStudent = {
            name: '',
            birthdate: '2000-01-01',
            kindergarten_id: 1
        }

        const result = await validatePartialStudent(partialStudent)
        expect(result.success).toBe(false)
        expect(result.error.message).toBe('El nombre está vacío')
    })
})

describe('Operaciones de estudiantes', () => {
    test('Debería recibir un estudiante existente', async () => {
        // TODO
    })

    test('Debería crear un nuevo estudiante', async () => {
        // TODO
    })

    test('Debería actualizar un estudiante existente', async () => {
        // TODO
    })
})
