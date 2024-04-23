import User from '../models/user.model.js'
import Kindergarten from '../models/kindergarten.model.js'

export const userExists = async (userId) => {
    try{
        const user = await User.getId(userId)
        
        if(user) return true
    } catch (error) {
        return false
    }
}

export const kindergartenExists = async (id) => {
    try {
        const kindergarten = await Kindergarten.getId(id)

        if(kindergarten) return true
    } catch (error) {
        return false
    }
}