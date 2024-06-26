import { pool } from '../config/db_connect.js'

class Kindergarten {
    constructor() {
        this.pool = pool
    }

    async getAll() {
        const sql = 'SELECT id, name, address, phone, email, user_id, created_at, updated_at FROM kindergarten'
        const [result] = await this.pool.query(sql)

        if(result.length <= 0) throw new Error('No se han encontrado guarderias')

        return result
    }

    async getId(id) {
        const sql = 'SELECT id, name, address, phone, email, user_id, created_at, updated_at FROM kindergarten WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if(result.length <= 0) throw new Error('No se ha encontrado la guardería seleccionada')

        return result[0]
    }

    async create(data) {
        const { name, address, phone, email, user_id } = data
        const sql = 'INSERT INTO kindergarten (name, address, phone, email, user_id) VALUES (?, ?, ?, ?, ?)'
        const [result] = await this.pool.query(sql, [name, address, phone, email, user_id])

        if(result.affectedRows <= 0) throw new Error('Error al crear la nueva guardería')
        const newKindergarten = await this.getId(result.insertId)
        return newKindergarten
    }

    async update(id, data) {
        const fields = Object.keys(data).map(field => `${field} = ?`).join(', ')
        const values = Object.values(data)
        
        const sql = `UPDATE kindergarten SET ${fields} WHERE id = ?`
        const [result] = await this.pool.query(sql, [...values, id])

        if(result.affectedRows <= 0) throw new Error('Error al actualizar la guardería')
        const kindergarten = await this.getId(id)
        return kindergarten
    }

    async delete(id) {
        const sql = 'DELETE FROM kindergarten WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if(result.affectedRows <= 0) throw new Error('Error al borrar la guardería')
        return result
    }

}

export default new Kindergarten()