import express from 'express'
import { config } from 'dotenv'
import bodyparser from 'body-parser'

import { userRouter } from './routes/user.routes.js'
import { kindergartenRouter } from './routes/kindergarten.routes.js'
import { studentRouter } from './routes/student.routes.js'
import { attendanceRouter } from './routes/attendance.routes.js'

const PORT = process.env.PORT ?? 3000
config()

const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

userRouter(app)
kindergartenRouter(app)
studentRouter(app)
attendanceRouter(app)

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`)
    console.log(process.env.NODE_ENV)
})
