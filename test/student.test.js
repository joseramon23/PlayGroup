import request from 'supertest'
import { testServer } from '../utils/testServer.js'
import { userRouter } from '../routes/user.routes.js'
import { studentRouter } from '../routes/student.routes.js'
import { pool } from '../config/db_connect.js'

let student = {}

// funcion para obtener token
async function loginAndGetToken(userData) {
  const app = testServer(userRouter)
  const response = await request(app)
    .post('/api/login')
    .send(userData)

  return response.body.data.token
}

describe('/GET students', () => {
  it('Debería obtener todos los estudiantes de la guarderia del usuario', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'irene_isc@gmail.com', password: 'Portillo16' }) // Usuario de guardería
    const response = await request(app)
      .get('/api/students?kindergarten=2')
      .set('Authorization', token)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Accepted')
    expect(Array.isArray(response.body.data)).toBe(true)
  })

  it('Debería obtener todos los estudiantes de todas las guarderias', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'joseportillo806@gmail.com', password: 'Portillo16' }) // Usuario admin
    const response = await request(app)
      .get('/api/students')
      .set('Authorization', token)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Accepted')
    expect(Array.isArray(response.body.data)).toBe(true)
  })

  it('Debería obtener un mensaje de no autorizado al intentar entrar sin token', async () => {
    const app = testServer(studentRouter)
    const response = await request(app)
      .get('/api/students')

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('statusCode', 401)
    expect(response.body).toHaveProperty('statusMessage', 'Unauthorized')
    expect(response.body).toHaveProperty('message', 'Se necesita token para acceder') 
  })

  it('Debería obtener un mensaje no autorizado al no pertenecer a dicha guardería', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'cristobal@gmail.com', password: 'Portillo16'}) // Usuario de otra guarderia
    const response = await request(app)
      .get('/api/students?kindergarten=2')
      .set('Authorization', token)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('statusCode', 401)
    expect(response.body).toHaveProperty('statusMessage', 'Unauthorized')
    expect(response.body).toHaveProperty('message', 'No perteneces a esta guardería')
  })
})

describe('/GET/:id students', () => {
  it('Debería obtener un estudiante único', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'irene_isc@gmail.com', password: 'Portillo16' })
    const response = await request(app)
      .get('/api/students/1')
      .set('Authorization', token)
    
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Accepted')
    expect(response.body).toHaveProperty('data')
  })

  it('Debería obtener un mensaje de no autorizado al acceder desde otro usuario', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'cristobal@gmail.com', password: 'Portillo16' })
    const response = await request(app)
      .get('/api/students/1')
      .set('Authorization', token)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('statusCode', 401)
    expect(response.body).toHaveProperty('statusMessage', 'Unauthorized')
    expect(response.body).toHaveProperty('message', 'No estas autorizado para hacer esta acción')
  })
})

describe('/POST students', () => {
  it('Debería crear un nuevo estudiante', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'cristobal@gmail.com', password: 'Portillo16' })
    const response = await request(app)
      .post('/api/students')
      .set('Authorization', token)
      .send({
        name: 'Alberto',
        birthdate: '2020-01-01',
        kindergarten_id: 3
      })

    student.id = response.body.data.id

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 201)
    expect(response.body).toHaveProperty('statusMessage', 'Created')
    expect(response.body).toHaveProperty('data')
  })

  it('Debería obtener un error al crear un estudiante con un usuario de otra guardería', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'cristobal@gmail.com', password: 'Portillo16' })
    const response = await request(app)
      .post('/api/students')
      .set('Authorization', token)
      .send({
        name: 'Alberto',
        birthdate: '2020-01-01',
        kindergarten_id: 2
      })

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('statusCode', 401)
    expect(response.body).toHaveProperty('statusMessage', 'Unauthorized')
    expect(response.body).toHaveProperty('message', 'El estudiante no pertenece a tu guardería')
  })
})

describe('/PUT/:id student', () => {
  it('Debería actualizar el usuario anteriormente creado', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'cristobal@gmail.com', password: 'Portillo16' })
    const response = await request(app)
      .put(`/api/students/${student.id}?kindergarten=3`)
      .set('Authorization', token)
      .send({
        name: 'Luis',
      })

      console.log(student)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Updated')
    expect(response.body).toHaveProperty('data')
  })

  it('Debería mostrar un mensaje de no autorizado al introducir una guarderia incorrecta en la url', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'cristobal@gmail.com', password: 'Portillo16' })
    const response = await request(app)
      .put(`/api/students/${student.id}?kindergarten=2`)
      .set('Authorization', token)
      .send({
        name: 'Luis',
      })

      console.log(student)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('statusCode', 401)
    expect(response.body).toHaveProperty('statusMessage', 'Unauthorized')
    expect(response.body).toHaveProperty('message', 'La guardería introducida no pertenece a la del usuario')
  })
})

describe('/DELETE students', () => {
  it('Deberia mostrar un mensaje de error al no introducir la guardería en la url', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'cristobal@gmail.com', password: 'Portillo16' })
    const response = await request(app)
      .delete(`/api/students/${student.id}`)
      .set('Authorization', token)

      console.log(student)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('statusCode', 400)
    expect(response.body).toHaveProperty('statusMessage', 'Error')
    expect(response.body).toHaveProperty('message', 'Debes introducir la id de al guardería')
  })

  it('Deberia eliminar el estudiante indicado', async () => {
    const app = testServer(studentRouter)
    const token = await loginAndGetToken({ email: 'cristobal@gmail.com', password: 'Portillo16' })
    const response = await request(app)
      .delete(`/api/students/${student.id}?kindergarten=3`)
      .set('Authorization', token)

      console.log(student)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Deleted')
  })
})

afterAll(() => {
  pool.end()
})