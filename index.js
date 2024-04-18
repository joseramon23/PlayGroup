const express = require('express')
const { config } = require('dotenv')
const { json, urlencoded } = require('body-parser')
const PORT = process.env.PORT ?? 3000

const userRouter = require('./routes/user.routes')
const kindergartenRouter = require('./routes/kindergarten.routes')
config()

const app = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.use('/api', userRouter)
app.use('/api', kindergartenRouter)

const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`)
    }
})

module.exports = { app, server }