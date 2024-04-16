const request = require('supertest')
const { app, server } = require('../index')
const { pool } = require('../config/db_connect')


// User test
const userTest = {
    name: "Jose Ramon",
    email: "joseportillo806@gmail.com",
    password: "Portillo14",
    passwordConfirm: "Portillo14",
    rol: "webadmin",
    image: "default.jpg"
}

describe('POST', () => {
    it('Al crear un usuario, enviar un objeto vacío', async () => {
        const response = await request(app).post('/users').send({})

        expect(response.statusCode).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad request')
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBeInstanceOf(Object)
        expect(response.body.message).toHaveProperty('name', 'El campo name es requerido')
        expect(response.body.message).toHaveProperty('email', 'El campo email es requerido')
        expect(response.body.message).toHaveProperty('password', 'El campo password es requerido')
        expect(response.body.message).toHaveProperty('passwordConfirm', 'El campo passwordConfirm es requerido')
    })
    
})

describe('POST', () => {
    it('Al crear un usuario, enviar un email incorrecto', async () => {
        const user = structuredClone(userTest)
        user.email = "invalidemail"
        const response = await request(app).post('/users').send(user)

        expect(response.statusCode).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad request')
        expect(response.body).toHaveProperty('message', 'El email introducido no es válido')
    })
})

describe('POST', () => {
    it('Enviar una contraseña inválida para crear un usuario', async () => {
        const user = structuredClone(userTest)
        user.password = "password"
        user.passwordConfirm = "password"
        const response = await request(app).post('/users').send(user)

        expect(response.statusCode).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad request')
        expect(response.body).toHaveProperty('message', 'La contraseña debe tener una mayúscula, al menos 2 números y mínimo 8 caracteres')
    })
})

describe('POST', () => {
    it('Enviar contraseñas que no coinciden al crear un usuario', async () => {
        const user = structuredClone(userTest)
        user.password = "password"
        const response = await request(app).post('/users').send(user)
    
        expect(response.statusCode).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad request')
        expect(response.body).toHaveProperty('message', 'Las contraseñas no coinciden')
    })
})

describe('POST', () => {
    it('Enviar un usuario con una guardería que no existe', async () => {
        const user = structuredClone(userTest)
        user.kindergarten_id = 200
        const response = await request(app).post('/users').send(user)

        expect(response.statusCode).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad request')
        expect(response.body).toHaveProperty('message', 'No se ha encontrado la guardería seleccionada')
    })
})

describe('POST', () => {
    it('Crear un usuario correctamente, con rol de administrador', async () => {
        const response = await request(app).post('/users').send(userTest)

        expect(response.statusCode).toBe(201)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 201)
        expect(response.body).toHaveProperty('statusMessage', 'Created')
        expect(response.body).toHaveProperty('message', 'Se ha creado correctamente') 
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Array)
        expect(response.body.data).toHaveProperty('id')
        expect(response.body.data).toHaveProperty('token')
    })
})

describe('POST /login', () => {
    it('Enviar una solicitud vacía para iniciar sesión', async () => {
        const response = await request(app).post('/login').send()

        expect(response.statusCode).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad request')
        expect(response.body).toHaveProperty('message', 'El cuerpo de la solicitud está vacío')
    })
})

describe('POST /login', () => {
    it('Enviar una solicitud con los campos vacíos', async () => {
        const response = await request(app).post('/login').send({ email: "", password: "" })

        expect(response.statusCode).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad request')
        expect(response.body).toHaveProperty('message', 'Los campos estan vacios')
    })
})

describe('POST /login', () => {
    it('Enviar una solicitud con email incorrecto', async () => {
        const response = await request(app).post('/login')
            .send({ email: "joseportillo806@gmail", password: userTest.password})

        expect(response.statusCode).toBe(500)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 500)
        expect(response.body).toHaveProperty('statusMessage', 'Error')
        expect(response.body).toHaveProperty('message', 'Error al iniciar sesión: Email incorrecto')  
    })
})

describe('POST /login', () => {
    it('Enviar una solicitud con una contraseña incorrecta', async () => {
        const response = await request(app).post('/login')
            .send({ email: userTest.email, password: "123456"})

        expect(response.statusCode).toBe(400)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 400)
        expect(response.body).toHaveProperty('statusMessage', 'Bad request')
        expect(response.body).toHaveProperty('message', 'La contraseña es incorrecta')  
    })
})

describe('POST /login', () => {
    it('Enviar una solicitud de inicio de sesión correcto', async () => {
        const response = await request(app).post('/login')
            .send({ email: userTest.email, password: userTest.password })

        expect(response.statusCode).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 200)
        expect(response.body).toHaveProperty('statusMessage', 'Login')
        expect(response.body).toHaveProperty('message', 'Sesion iniciada correctamente')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Object)
        expect(response.body.data).toHaveProperty('id')
        expect(response.body.data).toHaveProperty('token')
    })
})

describe('GET /users', () => {
    it('Enviar una solicitud sin token de autenticación', async () => {
        const response = await request(app).get('/users')

        expect(response.statusCode).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 401)
        expect(response.body).toHaveProperty('statusMessage', 'Unauthorized')
        expect(response.body).toHaveProperty('message', 'Se necesita token para acceder')
    })
})

describe('GET /users', () => {
    it('Enviar una solicitud con token de rol director', async () => {
        const response = await request(app).get('/users').set('authorization', process.env.TOKEN_DIRECTOR_TEST)

        expect(response.statusCode).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 401)
        expect(response.body).toHaveProperty('statusMessage', 'Unauthorized')
        expect(response.body).toHaveProperty('message', 'No estas autorizado para hacer esta acción')
    })
})

describe('GET /users', () => {
    it('Enviar una solicitud con el token correcto', async () => {
        const response = await request(app).get('/users').set('authorization', process.env.TOKEN_ADMIN_TEST)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 200)
        expect(response.body).toHaveProperty('statusMessage', 'Accepted')
        expect(response.body).toHaveProperty('message', 'Petición aceptada')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Object)
    })
})

describe('GET /users/:id', () => {
    it('Enviar una solicitud sin token', async () => {
        const response = await request(app).get('/users/1')

        expect(response.statusCode).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 401)
        expect(response.body).toHaveProperty('statusMessage', 'Unauthorized')
        expect(response.body).toHaveProperty('message', 'Se necesita token para acceder')
    })
})

describe('GET /users/:id', () => {
    it('Enviar una solicitud con un token incorrecto', async () => {
        const response = await request(app).get('/users/1').set('authorization', process.env.TOKEN_DIRECTOR_TEST)

        expect(response.statusCode).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 401)
        expect(response.body).toHaveProperty('statusMessage', 'Unauthorized')
        expect(response.body).toHaveProperty('message', 'No estas autorizado para hacer esta acción')
    })
})

describe('GET /users/:id', () => {
    it.only('Enviar una solicitud correcta del usuario', async () => {
        const response = await request(app).get('/users/1').set('authorization', process.env.TOKEN_ADMIN_TEST)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('statusCode', 200)
        expect(response.body).toHaveProperty('statusMessage', 'Accepted')
        expect(response.body).toHaveProperty('message', 'Petición aceptada')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeInstanceOf(Object)
        expect(response.body.data).toHaveProperty('name')
        expect(response.body.data).toHaveProperty('email')
        expect(response.body.data).toHaveProperty('kindergarten_id')
        expect(response.body.data).toHaveProperty('password')
        expect(response.body.data).toHaveProperty('rol')
        expect(response.body.data).toHaveProperty('image')
    })
})

afterAll(async () => {
    await server.close()
    return pool.end()
})