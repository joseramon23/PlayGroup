import { pool } from '../config/db_connect.js'

class napsDiary {
    constructor() {
        this.pool = pool
    }

    async getNaps(id) {
        const sql = `SELECT id, student_id, time, timezone, date FROM naps_diary WHERE id = ?`
        const [result] = await this.pool.query(sql, [id])

        if(result.length <= 0) throw new Error('No se ha encontrado el registro de siestas')
        return result
    }

    async startNaps(id, date) {
        const sql = `INSERT INTO naps_diary (student_id, time, timezone, date) 
                    VLUES (?, 0, null, ?)`
        const [result] = await this.pool.query(sql, [id, date])
        
        if(result.affectedRows <= 0) throw new Error('No se ha podido guardar el registro de siestas')
        return result
    }

    async updateNaps(id, data){
        const { student_id, time, timezone, date } = data 
        const sql = `UPDATE naps_diary SET student_id = ?, time = ?, timezone = ?, date = ? WHERE id = ?`
        const [result] = await this.pool.query(sql, [student_id, time, timezone, date, id])

        if(result.affectedRows <= 0) throw new Error('No se ha podido actualizar el registro de siestas')
        return result
    }

    async deleteNaps(id) {
        const sql = `DELETE FROM naps_diary WHERE id = ?`
        const [result] = await this.pool.query(sql, [id])

        if(result.affectedRows <= 0) throw new Error('No se ha podido borrar el registro')
        return result
    }
}

export default napsDiary