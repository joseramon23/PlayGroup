import request from 'supertest'
import { testServer } from '../utils/testServer.js'
import { kindergartenRouter } from '../routes/kindergarten.routes.js'
import { pool } from '../config/db_connect.js'

// Guarderia de prueba
let testKg = {
  name: "Pequeños gigantes",
  address: "Guillen dOleza",
  phone: 971129312,
  email: "peques@gmail.com"
}

// funcion para obtener token
async function loginAndGetToken(userData) {
  const app = testServer(userRouter)
  const response = await request(app)
    .post('/api/login')
    .send(userData)

  return response.body.data.token
}

// TODO cambiar token por la función
describe('/GET kindergarten', () => {
  it('Deberia devolver todas las guarderias', async () => {
    const app = testServer(kindergartenRouter)
    const response = await request(app)
      .get('/api/kindergarten')
      .set('Authorization', process.env.TOKEN_ADMIN_TEST)
    
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('statusCode', 200)
      expect(response.body).toHaveProperty('statusMessage', 'Accepted')
      expect(Array.isArray(response.body.data)).toBe(true)
  })

  it('Deberia devolver una guarderia en concreto', async () => {
    const app = testServer(kindergartenRouter)
    const response = await request(app)
      .get('/api/kindergarten/2')
      .set('Authorization', process.env.TOKEN_ADMIN_TEST)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Accepted')
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('id')
    expect(response.body.data).toHaveProperty('name')
    expect(response.body.data).toHaveProperty('address')
    expect(response.body.data).toHaveProperty('phone')
    expect(response.body.data).toHaveProperty('email')
    expect(response.body.data).toHaveProperty('user_id')
  })
})

describe('/POST kindergarten', () => {
  it('Deberia crear una nueva guarderia', async () => {
    const app = testServer(kindergartenRouter)
    const response = await request(app)
      .post('/api/kindergarten')
      .set('Authorization', process.env.TOKEN_ADMIN_TEST)
      .send(testKg)
        
    testKg.id = response.body.data.kindergarten.id
    
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 201)
    expect(response.body).toHaveProperty('statusMessage', 'Created')
    expect(response.body).toHaveProperty('data')
  })
})

describe('/PUT kindergarten', () => {
  it('Deberia actualizar la guarderia de test', async () => {
    const app = testServer(kindergartenRouter)
    const response = await request(app)
      .put(`/api/kindergarten/2`)
      .set('Authorization', process.env.TOKEN_ADMIN_TEST)
      .send({ name: 'Guarderia de prueba'})

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Updated')
    expect(response.body).toHaveProperty('data')
  })
})

describe('DELETE /kindergarten', () => {
  it('Deberia eliminar la guarderia test', async () => {
    const app = testServer(kindergartenRouter)
    const response = await request(app)
      .delete(`/api/kindergarten/${testKg.id}`)
      .set('Authorization', process.env.TOKEN_ADMIN_TEST)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('statusCode', 200)
    expect(response.body).toHaveProperty('statusMessage', 'Deleted')
  })
})

afterAll(() => {
  pool.end()
})