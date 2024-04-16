const { pool } = require('../config/db_connect')

class AttendanceDiary {
    constructor() {
        this.pool = pool
    }

    async getAttendanceStudent(id) {
        const sql = `SELECT student_id, entrance_time, exit_time, date WHERE student_id = ?`
        const [result] = await this.pool.query(sql, [id])

        if(result.length <= 0) throw new Error('No se han encontrado entradas del alumno seleccinado')
        return result
    }

    async getAttendanceDate(date) {
        const sql = `SELECT student_id, entrance_time, exit_time, date WHERE date = ?`
        const [result] = await this.pool.query(sql, [date])

        if(result.length <= 0) throw new Error('No se han encontrado entradas para esa fecha')
        return result
    }

    async setAttendanceEntrance(data) {
        const { student_id, entrance, date } = data
        const sql = `INSERT INTO attendance_diary (student_id, entrance_time, exit_time date) VALUES (?, ?, null, ?)`
        const [result] = await this.pool.query(sql, [student_id, entrance, date])

        if(result.affectedRows <= 0) throw new Error('Ha ocurrido un error al indicar la entrada')
        return result
    }

    async setAttendanceExit(id, data) {
        const { exit, date } = data
        const sql = `UPDATE attendance_diary SET exit_time = ? WHERE student_id = ? AND date = ?`
        const [result] = await this.pool.query(sql, [exit, id, date])

        if(result.affectedRows <= 0) throw new Error('No se ha actualizado la salida')
        return result
    }

    async updateAttendance(id, data) {
        const { student_id, entrance, exit, date } = data
        const sql = `UPDATE attendance_diary SET student_id = ?, entrance_time = ?, exit_time = ?, date = ? WHERE id = ?`
        const [result] = await this.pool.query(sql, [student_id, entrance, exit, date, id])

        if(result.affectedRows <= 0) throw new Error('No se ha podido actualizar la asistencia del alumno')
        return result
    }

    async deleteAttendance(id) {
        const sql = `DELETE FROM attendance_diary WHERE id = ?`
        const [result] = await this.pool.query(sql, [id])
        
        if(result.affectedRows <= 0) throw new Error('No se ha podido borrar la entrada')
        return result
    }
}

module.exports = AttendanceDiary