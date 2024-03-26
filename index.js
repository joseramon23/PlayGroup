import express from 'express'
import cors from 'cors'
import UserController from './controllers/user.controller.js'
import userRouter from './routes/user.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use(userRouter)


app.listen(process.env.NODE_DOCKER_PORT || 3000)
console.log('Server on port', process.env.NODE_DOCKER_PORT || 3000)
