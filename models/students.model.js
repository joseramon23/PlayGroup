import { pool } from '../config/db_connect.js'

class Student {
    constructor() {
        this.pool = pool
    }

    async getAllStudents() {
        const sql = 'SELECT name, image, birthdate, kindergarten_id, created_at, updated_at FROM students'
        const [result] = await this.pool.query(sql)

        if (result.length <= 0) throw new Error('No se han encontrado alumnos')
        return result 
    }

    async getKindergartenStudents(id) {
        const sql = 'SELECT name, image, birthdate, created_at, updated_at FROM students WHERE kindergarten_id = ?'
        const [result] = await this.pool.query(sql, [id])

        if (result.length <= 0) throw new Error('No se han encontrado alumnos en esta guardería')
        return result 
    }

    async getStudent(id) {
        const sql = 'SELECT name, image, birthdate, created_at, updated_at FROM students WHERE id = ?'
        const [result] = await this.pool.query(sql, [id])

        if(result.length <= 0) throw new Error('No se ha encontrado el alumno seleccionado')
        return result[0]
    }

    async createStudent(data) {
        const { name, image, birthdate, kindergarten_id, created_at, updated_at } = data
        const sql = `INSERT INTO students (name, image, birthdate, kindergarten_id, created_at, updated_at) 
                    VALUES (?, ?, ?, ? ,? ,?)`
        const [result] = await this.pool.query(sql, [name, image, birthdate, kindergarten_id, created_at, updated_at])

        if(result.affectedRows <= 0) throw new Error("Ha ocurrido un error al crear")
        return result
    }

    async updateStudent(id, data) {
        const { name, image, birthdate, kindergarten_id, created_at, updated_at } = data
        const sql = `UPDATE students SET name = ?, image = ?, birthdate = ?, kindergarten_id = ?, created_at = ?, updated_at = ?
                    WHERE id = ?`
        const [reult] = await this.pool.query(sql, [name, image, birthdate, kindergarten_id, created_at, updated_at, id])

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al actualizar el alumno')
        return result
    }

    async deleteStudent(id) {
        const sql = "DELETE FROM students WHERE id = ?"
        const [result] = await this.pool.query(sql, id)

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al eliminar alumno')
        return result
    }
}

export default Student