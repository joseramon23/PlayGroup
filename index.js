import express from 'express'
import { config } from 'dotenv'
import bodyparser from 'body-parser'

import userRouter from './routes/user.routes.js'
import kindergartenRouter from './routes/kindergarten.routes.js'

const PORT = process.env.PORT ?? 3000
config()

const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.use('/api', userRouter)
app.use('/api', kindergartenRouter)

const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`)
    }
})

export default { app, server }