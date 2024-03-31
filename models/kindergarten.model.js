const { pool } = require('../config/db_connect')

class Kindergarten {
    constructor() {
        this.pool = pool
    }

    async getAllKindergarten() {
        const sql = 'SELECT id, name, address, phone, email, user_id, created_at, updated_at FROM kindergarten'
        const [result] = await this.pool.query(sql)

        if(result.length <= 0) throw new Error('No se han encontrado guarderias')

        return result
    }

    async getKindegarten(id) {
        const sql = 'SELECT id, name, address, phone, email, user_id, created_at, updated_at FROM kindergarten WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if(result.length <= 0) throw new Error('No se ha encontrado la guardería seleccionada')

        return result[0]
    }

    async createKindergarten(data) {
        const { name, address, phone, email, userId } = data
        const sql = 'INSERT INTO kindergarten (name, address, phone, email, user_id) VALUES (?, ?, ?, ?, ?)'
        const [result] = await this.pool.query(sql, [name, address, phone, email, userId])

        if(result.affectedRows <= 0) throw new Error('Error al crear la nueva guardería')
        return result
    }

    async updateKindergarten(id, data) {
        const { name, address, phone, email, userId, updated_at } = data
        const sql = 'UPDATE kindergarten SET name = ?, address = ?, phone = ?, email = ?, user_id = ?, updated_at = ? WHERE id = ?'
        const [result] = await this.pool.query(sql, [name, address, phone, email, userId, updated_at, id])

        if(result.affectedRows <= 0) throw new Error('Error al actualizar la guardería')
        return result
    }

    async deleteKindergarten(id) {
        const sql = 'DELETE FROM kindergarten WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if(result.affectedRows <= 0) throw new Error('Error al borrar la guarderia')
        return result
    }

}

module.exports = new Kindergarten()