const express = require('express')
const { config } = require('dotenv')
const { json, urlencoded } = require('body-parser')
const path = require('node:path')

const userRouter = require('./routes/user.routes')
const kindergartenRouter = require('./routes/kindergarten.routes')
config()

const app = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.use(userRouter)
app.use(kindergartenRouter)

const server = app.listen(process.env.PORT || 3000, () => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Servidor iniciado en el puerto http://localhost:${process.env.PORT || 3000}`)
    }
})

module.exports = { app, server }