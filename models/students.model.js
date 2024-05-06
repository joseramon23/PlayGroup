import { pool } from '../config/db_connect.js'

class Student {
    constructor() {
        this.pool = pool
    }

    async getAll({ kindergarten }) {
        if (kindergarten) {
            const sql = `SELECT id, name, image, birthdate, kindergarten_id, created_at, updated_at
                FROM students WHERE kindergarten_id = ?`
            const [result] = await this.pool.query(sql, [kindergarten])

            if (result.length <= 0) return 'No hay estudiantes en esta guarderia'
            return result
        }

        const sql = 'SELECT id, name, image, birthdate, kindergarten_id, created_at, updated_at FROM students'
        const [result] = await this.pool.query(sql)

        if (result.length <= 0) throw new Error('No se han encontrado alumnos')
        return result 
    }

    async getId(id) {
        const sql = 'SELECT id, name, image, birthdate, kindergarten_id, created_at, updated_at FROM students WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if(result.length <= 0) throw new Error('No se ha encontrado el alumno seleccionado')
        return result[0]
    }

    async create(data) {
        const { name, image, birthdate, kindergarten_id } = data
        const sql = `INSERT INTO students (name, birthdate, kindergarten_id, image) 
                    VALUES (?, ?, ?, ?)`
        const [result] = await this.pool.query(sql, [name, birthdate, kindergarten_id, image])

        if(result.affectedRows <= 0) throw new Error("Ha ocurrido un error al crear")
        const student = await this.getId(result.insertId)
        return student
    }

    async update(id, data) {
        const fields = Object.keys(data).map(field => `${field} = ?`).join(', ')
        const values = Object.values(data)

        const sql = `UPDATE students SET ${fields} WHERE id = ?`
        const [result] = await this.pool.query(sql, [...values, id])

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al actualizar el alumno')
        const student = await this.getId(id)
        return student
    }

    async delete(id) {
        const sql = "DELETE FROM students WHERE id = ?"
        const [result] = await this.pool.query(sql, id)

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al eliminar alumno')
        return result
    }
}

export default new Student()