import { pool } from '../config/db_connect.js'

class AttendanceDiary {
    constructor() {
        this.pool = pool
    }

    /**
     * Retrieves all attendance records based on the provided filters.
     * If `kindergarten` is specified, it returns all attendance records for the students in that kindergarten.
     * If `student` is specified, it returns all attendance records for that student.
     * If no filters are provided, it returns all attendance records.
     *
     * @param {Object} options - The options for filtering the attendance records.
     * @param {number} options.kindergarten - The ID of the kindergarten to filter by.
     * @param {number} options.student - The ID of the student to filter by.
     * @returns {Promise<Array<Object>>} - A promise that resolves to an array of attendance records.
     * @throws {Error} - If no attendance records are found based on the provided filters.
     */
    async getAll({ kindergarten, student }) {
        if (kindergarten) {
            const sql = `SELECT s.name, ad.entrance_time, ad.exit_time, ad.date, s.kindergarten_id
                        FROM attendance_diary ad
                        INNER JOIN students s ON ad.student_id = s.id
                        WHERE s.kindergarten_id = ?`
            const [result] = await this.pool.query(sql, [kindergarten])

            if (result.length <= 0) throw new Error('No se han encontrado entradas de esta guardería')
            return result
        }

        if (student) {
            const sql = `SELECT s.name, ad.entrance_time, ad.exit_time, ad.date, s.kindergarten_id
                        FROM attendance_diary ad
                        INNER JOIN students s ON ad.student_id = s.id
                        WHERE s.id = ?`
            const [result] = await this.pool.query(sql, [student])

            if (result.length <= 0) throw new Error('No se han encontrado entradas de este alumno')
            return result
        }

        const sql = `SELECT student_id, entrance_time, exit_time, date FROM attendance_diary`
        const [result] = await this.pool.query(sql)
        if (result.length <= 0) throw new Error('No se han encontrado entradas')
        return result
    }

    /**
     * Retrieves all attendance records for a specific student
     * 
     * @param {number} student - The ID of the student.
     * @returns {Promise<Array<Object>>} - A promise that resolves to an array of attendance records.
     * @throws {Error} - If no attendance records are found for specidif student.
     */
    async getDate({ date, kindergarten }) {
        //TODO
    }

    /**
     * Creates a new attendance record in the database.
     * @param {Object} data - The data for the new attendance record.
     * @param {number} data.student_id - The ID of the student.
     * @param {string} data.entrance - The entrance time.
     * @param {string} data.date - The date of the attendance record.
     * @returns {Promise<Object>} - A promise that resolves to the result of the database query.
     * @throws {Error} - If an error occurs while creating the attendance record.
     */
    async create(data) {
        const { student_id, entrance, date } = data
        const sql = `INSERT INTO attendance_diary (student_id, entrance_time, exit_time date) VALUES (?, ?, null, ?)`
        const [result] = await this.pool.query(sql, [student_id, entrance, date])

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al indicar la entrada')
        return result
    }

    /**
     * Updates the attendance diary entry with the specified ID.
     * @param {number} id - The ID of the attendance diary entry to update.
     * @param {Object} data - The data to update the attendance diary entry with.
     * @returns {Promise<Object>} - A promise that resolves to the updated attendance diary entry.
     * @throws {Error} - If the update operation fails or no rows are affected.
     */
    async update(id, data) {
        const fields = Object.keys(data).map(field => `${field} = ?`).join(', ')
        const values = Object.values(data)

        const sql = `UPDATE attendace_diary SET ${fields} WHERE id = ?`
        const [result] = await this.pool.query(sql, [...values, id])

        if(result.affectedRows <= 0) throw new Error('No se ha podido actualizar la asistencia del alumno')
        return result
    }

    /**
     * Deletes an entry from the attendance diary table based on the provided ID.
     * @param {number} id - The ID of the entry to be deleted.
     * @returns {Promise<object>} - A promise that resolves to the result of the delete operation.
     * @throws {Error} - If the delete operation fails or no entry is found with the provided ID.
     */
    async delete(id) {
        const sql = `DELETE FROM attendance_diary WHERE id = ?`
        const [result] = await this.pool.query(sql, [id])
        
        if(result.affectedRows <= 0) throw new Error('No se ha podido borrar la entrada')
        return result
    }
}

export default new AttendanceDiary()