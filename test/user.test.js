import request from 'supertest'
import { testServer } from '../utils/testServer.js'
import { userRouter } from '../routes/user.routes.js'
import { pool } from '../config/db_connect.js'

let userTest = {
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  password: 'Johndoe123',
  passwordConfirm: 'Johndoe123'
}

describe('GET /users', () => {
  it('Deberia devolver todos los usuarios', async () => {
    const app = testServer(userRouter)
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', process.env.TOKEN_ADMIN_TEST)

      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('statusCode', 200)
      expect(response.body).toHaveProperty('statusMessage', 'Accepted')
      expect(Array.isArray(response.body.data)).toBe(true)
  })

  it('Deberia devolver un unico usuario', async () => {
    const app = testServer(userRouter)
    const response = await request(app)
      .get('/api/users/1')
      .set('Authorization', process.env.TOKEN_ADMIN_TEST)

      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('statusCode', 200)
      expect(response.body).toHaveProperty('statusMessage', 'Accepted')
      expect(response.body).toHaveProperty('data')
  }) 
})

describe('POST /users', () => {
  it('Deberia crear un nuevo usuario', async () => {
    const app = testServer(userRouter)
    const response = await request(app)
      .post('/api/users')
      .send(userTest)

    userTest.id = response.body.data.user.id
    
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 201)
    expect(response.body).toHaveProperty('statusMessage', 'Created')
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('user')
    expect(response.body.data).toHaveProperty('token')
  })

  it('Deberia iniciar sesion con el usuario test', async () => {
    const app = testServer(userRouter)
    const response = await request(app)
      .post('/api/login')
      .send({
        email: userTest.email,
        password: userTest.password
      })

    userTest.token = response.body.data.token

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Logged')
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('id')
    expect(response.body.data).toHaveProperty('token')
  })
})

describe('PUT /users', () => {
  it('Deberia actualizar un usuario existente', async () => {
    const app = testServer(userRouter)
    const response = await request(app)
      .put(`/api/users/${userTest.id}`)
      .set('Authorization', userTest.token)
      .send({name: 'John Doe'})

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Updated')
    expect(response.body).toHaveProperty('data')
  })

  it('Deberia actualizar la contraseña del usuario', async () => {
    const app = testServer(userRouter)
    const response = await request(app)
      .put(`/api/users/password/${userTest.id}`)
      .set('Authorization', userTest.token)
      .send({ password: userTest.password, newPass: 'Password16'})
    
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 201)
    expect(response.body).toHaveProperty('statusMessage', 'Updated password')
    expect(response.body).toHaveProperty('data')
  })
})

describe('DELETE /users', () => {
  it('Deberia eliminar el usuario test', async () => {
    const app = testServer(userRouter)
    const response = await request(app)
      .delete(`/api/users/${userTest.id}`)
      .set('Authorization', userTest.token)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Deleted')
  })
})

afterAll(() => {
  pool.end()
})