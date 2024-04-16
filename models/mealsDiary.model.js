const { pool } = require('../config/db_connect')

class mealsDiary {
    constructor() {
        this.pool = pool
    }

    async getMeals(id) {
        const sql = `SELECT student_id, first_meal, second_meal, dessert, snack, date
                    FROM meals_diary WHERE id = ?`
        const [result] = await this.pool.query(sql, id)

        if (result.length <= 0) throw new Error('No se han encontrado comidas del alumno')
        return result
    }

    async startMeals(id, date) {
        const sql = `INSERT INTO meals_diary (student_id, first_meal, second_meal, dessert, snack, date)
                    VALUES (?, 0, 0, 0, 0, ?)`
        const [result] = await this.pool.query(sql, [id, date])
        
        if(result.affectedRows <= 0) throw new Error('No se ha podido crear el diario comida')
        return result
    }

    async updateMeals(id, data) {
        const { studentId, firstMeal, secondMeal, dessert, snack, date } = data
        const sql = `UPDATE meals_diary SET student_id = ?, first_meal = ?, second_meal = ?, dessert = ?, snack = ?, date = ?
                    WHERE id = ?`
        const [result] = await this.pool.query(sql, [studentId, firstMeal, secondMeal, dessert, snack, date, id])
        if(result.affectedRows <= 0) throw new Error('No se ha podiddo actualizar las comidas')
        return result
    }

    async deleteMeals(id) {
        const sql = `DELETE FROM meals_diary WHERE id = ?`
        const [result] = await this.pool.query(sql, [id])

        if(result.affectedRows <= 0) throw new Error('No se ha podido eliminar comida')
        return result
    }
}

module.exports = mealsDiary