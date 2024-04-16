const request = require('supertest')
const { app, server } = require('../index')
const { pool } = require('../config/db_connect')

// Guarderia de prueba
const testKg = {
    name: "Pequeños gigantes",
    address: "Guillen dOleza",
    phone: "971129312",
    email: "pequeños@gmail.com",
    userId: 1
}

const getLastId = async () => {
    const [result] = await pool.query('SELECT id FROM kindergarten ORDER BY id DESC LIMIT 1')
    return result[0].id
}

describe('GET /kindergarten', () => {

    it('Deberia obtener todas las guarderias', async () => {
        const response = await request(app).get('/kindergarten')

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('statusCode', 200)
        expect(response.body).toHaveProperty('statusMessage', 'Accepted')
        expect(response.body).toHaveProperty('data')
        expect(Array.isArray(response.body.data)).toBe(true)
    })
})

describe('GET /kindergarten/:id', () => {
    it('Deberia obtener una guarderia en concreto', async () => {
        const response = await request(app).get('/kindergarten/1')

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('statusCode', 200)
        expect(response.body).toHaveProperty('statusMessage', 'Accepted')
        expect(response.body).toHaveProperty('kindergarten')
        expect(response.body.kindergarten).toBeInstanceOf(Object)
        expect(response.body.kindergarten).toHaveProperty('id')
        expect(response.body.kindergarten).toHaveProperty('name')
        expect(response.body.kindergarten).toHaveProperty('address')
        expect(response.body.kindergarten).toHaveProperty('phone')
        expect(response.body.kindergarten).toHaveProperty('email')
        expect(response.body.kindergarten).toHaveProperty('user_id')
        expect(response.body.kindergarten).toHaveProperty('created_at')
        expect(response.body.kindergarten).toHaveProperty('updated_at')
    })
})

describe('GET /kindergarten/:id', () => {
    it('Deberia obtener mensaje de error al obtener una guarderia que no existe', async () => {
        const response = await request(app).get('/kindergarten/100')

        expect(response.statusCode).toBe(500)
        expect(response.body).toHaveProperty('statusCode', 500)
        expect(response.body).toHaveProperty('statusMessage', 'Error')
        expect(response.body).toHaveProperty('message')
    })
})

describe('POST /kindergarten', () => {
    it('Debe crear una nueva guarderia', async () => {
        const response = await request(app).post('/kindergarten').send(testKg)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('statusCode', 201)
        expect(response.body).toHaveProperty('statusMessage', 'Created')
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('id')

        updateId = response.body.id
    })
})

describe('POST /kindergarten', () => {
    it('Enviar un objeto vacio, debe devolver los campos están vacios', async () => {
        const response = await request(app).post('/kindergarten')

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage')
        expect(response.body.statusMessage).toBeInstanceOf(Object)
        expect(response.body.statusMessage).toHaveProperty('name')
        expect(response.body.statusMessage).toHaveProperty('address')
        expect(response.body.statusMessage).toHaveProperty('phone')
        expect(response.body.statusMessage).toHaveProperty('email')
        expect(response.body.statusMessage).toHaveProperty('user_id')
    })
})

describe('POST /kindergarten', () => {
    it('Enviar un email incorrecto, devuelve un mensaje de error', async () => {
        const newKgTest = structuredClone(testKg)
        newKgTest.email = "emailinvalido"
        const response = await request(app).post('/kindergarten').send(newKgTest)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'El email introducido no es válido')
    })
})

describe('POST /kindergarten', () => {
    it('Enviar un telefono que no es válido, devuelve un mensaje de error', async () => {
        const newKgTest = structuredClone(testKg)
        newKgTest.phone = '20313'
        const response = await request(app).post('/kindergarten').send(newKgTest)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'El teléfono introducido no es válido')
    })
})

describe('POST /kindergarten', () => {
    it('Enviar un usuario que no existe, devuelve un mensaje de error', async () => {
        const newKgTest = structuredClone(testKg)
        newKgTest.userId = 1000
        const response = await request(app).post('/kindergarten').send(newKgTest)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'No se ha encontrado el usuario seleccionado')
    })
})


describe('PUT /kindergarten/:id', () => {
    it('Actualizar una guarderia', async () => {
        const response = await request(app)
            .put(`/kindergarten/1`)
            .send({
                name: "Guarderia actualizada",
                address: "Calle actualizada"
            })
        
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('statusCode', 200)
        expect(response.body).toHaveProperty('statusMessage', 'Updated')
        expect(response.body).toHaveProperty('message', 'Se ha actualizado correctamente')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Object)
    })
})

describe('PUT /kindergarten/:id', () => {
    it('Intenta actualizar guarderia con una guarderia que no existe', async () => {
        const response = await request(app)
            .put('/kindergarten/1234')
            .send({
                name: 'Guarderia actualizada'
            })

        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty('statusCode', 404)
        expect(response.body).toHaveProperty('statusMessage', 'Unknown')
        expect(response.body).toHaveProperty('message', 'No se ha encontrado la guardería seleccionada')
    })
})

describe('PUT /kindergarten/:id', () => {
    it('Enviar un objeto sin propiedades para actualizar', async () =>{
        const response = await request(app)
            .put('/kindergarten/1')
            .send({
                name: "",
                address: "",
                phone: "",
                email: "",
                userId: ""
            })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad Request')
        expect(response.body).toHaveProperty('message', 'Las propiedades del objeto no pueden estar vacías')
    })
})

describe('PUT /kindergarten/:id', () => {
    it('Enviar un objeto vacío para actualizar', async () =>{
        const response = await request(app)
            .put('/kindergarten/1')
            .send({})

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad Request')
        expect(response.body).toHaveProperty('message', 'El cuerpo de la solicitud está vacío')
    })
})

describe('PUT /kindergarten/:id', () => {
    it('Enviar una guarderia con un usuario que no existe', async () =>{
        const response = await request(app)
            .put('/kindergarten/1')
            .send({
                name: "Guarderia",
                address: "Guillem de Oleza",
                phone: "971911888",
                email: "guarderia@gmail.com",
                userId: 1111
            })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'No se ha encontrado el usuario seleccionado')
    })
})

describe('DELETE /kindergarten/:id', () => {
    it('Intenta eliminar una guarderia que no existe', async () => {
        const response = await request(app).delete('/kindergarten/1000')

        expect(response.statusCode).toBe(500)
        expect(response.body).toHaveProperty('statusCode', 500)
        expect(response.body).toHaveProperty('statusMessage', 'Error')
        expect(response.body).toHaveProperty('message', 'Error al borrar la guardería')
    })
})

describe('DELETE /kindergarten/:id', () => {
    it('Elimina la útlima guarderia de la base de datos', async () => {
        const lastId = await getLastId()
        const response = await request(app).delete(`/kindergarten/${lastId}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('statusCode', 200)
        expect(response.body).toHaveProperty('statusMessage', 'Deleted')
        expect(response.body).toHaveProperty('message', 'Se ha borrado correctamente')
    })

    afterEach(async () => {
        await server.close()
        return pool.end()
    })
})
