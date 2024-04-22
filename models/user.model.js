import { pool } from '../config/db_connect.js'
class User {
    constructor() {
        this.pool = pool
    }

    async getAll() {
        const sql = 'SELECT id, name, email, kindergarten_id, rol, image FROM users'
        const [result] = await this.pool.query(sql)
        
        if(result.length < 0)  throw new Error("No se han encontrado usuarios")

        return result
    }

    async getId(id) {
        const sql = 'SELECT id, name, email, kindergarten_id, password, rol, image FROM users WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if (result.length <= 0) throw new Error("No se ha encontrado el usuario seleccionado")
        return result[0]
    }

    async create(data) {
        const { name, email, kindergarten_id, password, rol, image } = data
        const sql = 'INSERT INTO users (name, email, kindergarten_id, password, rol, image) VALUES (?, ?, ?, ?, ?, ?)'
        const [result] = await this.pool.query(sql, [name, email, kindergarten_id, password, rol, image])

        if(result.affectedRows <= 0) throw new Error("Ha ocurrido un error al crear el usuario")
        const user = await this.getId(result.insertId)
        return user
    }

    async update(id, data) {
        const fields = Object.keys(data).map(field => `${field} = ?`).join(', ')
        const values = Object.values(data)

        const sql = `UPDATE users SET ${fields} WHERE id = ?`
        const [result] = await this.pool.query(sql, [...values, id])

        if(result.affectedRows <= 0) throw new Error("Ha ocurrido un error al actualizar el usuario")
        const updateUser = await this.getId(id)
        return updateUser
    }

    async delete(id) {
        const sql = "DELETE FROM users WHERE id = ?"
        const [result] = await this.pool.query(sql, [id])

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al eliminar el usuario')
        return result
    }

    async login(email) {
        const sql = 'SELECT id, name, email, kindergarten_id, password, rol, image FROM users WHERE email = ?'
        const [result] = await this.pool.query(sql, [email])

        if (result.length <= 0) throw new Error('Email incorrecto')
        return result[0]
    }
}

export default new User()
