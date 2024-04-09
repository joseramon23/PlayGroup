const path = require('node:path')
const { pool } = require(path.resolve(__dirname, '../config/db_connect'))
class User {
    constructor() {
        this.pool = pool
    }

    async getAllUsers() {
        const sql = 'SELECT name, email, kindergarten_id, rol, image FROM users'
        const [result] = await this.pool.query(sql)
        
        if(result.length <= 0)  throw new Error("No se han encontrado usuarios")

        return result
    }

    async getUser(id) {
        const sql = 'SELECT name, email, kindergarten_id, password, rol, image FROM users WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if (result.length <= 0) throw new Error("No se ha encontrado el usuario seleccionado")
        return result[0]
    }

    async createUser(data) {
        const { name, email, kindergarten_id, password, rol, image } = data
        const sql = 'INSERT INTO users (name, email, kindergarten_id, password, rol, image) VALUES (?, ?, ?, ?, ?, ?)'
        const [result] = await this.pool.query(sql, [name, email, kindergarten_id, password, rol, image])

        if(result.affectedRows <= 0) throw new Error("Ha ocurrido un error al crear el usuario")
        return result
    }

    async updateUser(id, data) {
        const { name, email, password, kindergarten_id, rol, image, updated_at } = data
        const sql = 'UPDATE users SET name = ?, email = ?, kindergarten_id = ?, password = ?, rol = ?, image = ?, updated_at = ? WHERE id = ?'
        const [result] = await this.pool.query(sql, [name, email, kindergarten_id, password, rol, image, updated_at, id])

        if(result.affectedRows <= 0) throw new Error("Ha ocurrido un error al actualizar el usuario")
        return result
    }

    async deleteUser(id) {
        const sql = "DELETE FROM users WHERE id = ?"
        const [result] = await this.pool.query(sql, [id])

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al eliminar el usuairo')
        return result
    }

    async loginUser(email) {
        const sql = 'SELECT id, name, email, kindergarten_id, password, rol, image FROM users WHERE email = ?'
        const [result] = await this.pool.query(sql, [email])

        if (result.length <= 0) throw new Error('Email incorrecto')
        return result[0]
    }
}

module.exports = User