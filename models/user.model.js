import { pool } from '../config/db_connect.js'

class User {
    constructor() {
        this.pool = pool
    }

    async getAllUsers() {
        const sql = 'SELECT name, email, rol, image FROM users'
        const [result] = await this.pool.query(sql)
        
        if(result.length <= 0)  throw new Error("No se han encontrado usuarios")

        return result
    }

    async getUser(id) {
        const sql = 'SELECT name, email, rol, image FROM users WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if (result.length <= 0) throw new Error("No se ha encontrado el usuario seleccionado")
        return result[0]
    }

    async createUser(data) {
        const { name, email, password, rol, image } = data
        const sql = 'INSERT INTO users (name, email, password, rol, image) VALUES (?, ?, ?, ?, ?)'
        const [result] = await this.pool.query(sql, [name, email, password, rol, image])

        if(result.affectedRows <= 0) throw new Error("Ha ocurrido un error al crear el usuario")
        return result
    }

    async updateUser(id, data) {
        const { name, email, rol, image, updated_at } = data
        const sql = 'UPDATE users SET name = ?, email = ?, rol = ?, image = ?, updated_at = ? WHERE id = ?'
        const [result] = await this.pool.query(sql, [name, email, rol, image, updated_at, id])

        if(result.affectedRows <= 0) throw new Error("Ha ocurrido un error al actualizar el usuario")
        return result
    }

    async deleteUser(id) {
        const sql = "DELETE FROM users WHERE id = ?"
        const [result] = await this.pool.query(sql, [id])

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al eliminar el usuairo')
        return result
    }
}

export default new User()