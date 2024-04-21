import { pool } from '../config/db_connect.js'

export class Student {
    constructor() {
        this.pool = pool
    }

    async getAll() {
        const sql = 'SELECT name, image, birthdate, kindergarten_id, created_at, updated_at FROM students'
        const [result] = await this.pool.query(sql)

        if (result.length <= 0) throw new Error('No se han encontrado alumnos')
        return result 
    }

    async getByKindergarten(id) {
        const sql = 'SELECT name, image, birthdate, created_at, updated_at FROM students WHERE kindergarten_id = ?'
        const [result] = await this.pool.query(sql, [id])

        if (result.length <= 0) throw new Error('No se han encontrado alumnos en esta guardería')
        return result 
    }

    async getId(id) {
        const sql = 'SELECT name, image, birthdate, created_at, updated_at FROM students WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if(result.length <= 0) throw new Error('No se ha encontrado el alumno seleccionado')
        return result[0]
    }

    async create(data) {
        const { name, image, birthdate, kindergarten_id } = data
        const sql = `INSERT INTO students (name, birthdate, kindergarten_id, image) 
                    VALUES (?, ?, ?, ? ,? ,?)`
        const [result] = await this.pool.query(sql, [name, birthdate, kindergarten_id, image])

        if(result.affectedRows <= 0) throw new Error("Ha ocurrido un error al crear")
        return result
    }

    async update(id, data) {
        const fields = Object.keys(data).map(field => `${field} = ?`).join(', ')
        const values = Object.values(data)

        const sql = `UPDATE students SET ${fields} WHERE id = ?`
        const [result] = await this.pool.query(sql, [...values, id])

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al actualizar el alumno')
        return result
    }

    async delete(id) {
        const sql = "DELETE FROM students WHERE id = ?"
        const [result] = await this.pool.query(sql, id)

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al eliminar alumno')
        return result
    }
}
