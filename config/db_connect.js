import { createPool } from 'mysql2/promise'
import { config } from 'dotenv'

config()

const databaseName = process.env.NODE_ENV === "development" ?
    process.env.MYSQLDB_DATABASE :
    process.env.MYSQLDB_DATABASE_TEST

console.log(databaseName)

export const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_PASSWORD,
    database: databaseName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})