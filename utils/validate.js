import UserModel from '../models/user.model.js'
import KindergartenModel from '../models/kindergarten.model.js'
const User = new UserModel
const Kindergarten = new KindergartenModel

export const userExists = async (userId) => {
    try{
        const user = await User.getUser(userId)
        
        if(user) return true
    } catch (error) {
        return false
    }
}

export const kindergartenExists = async (id) => {
    try {
        const kindergarten = await Kindergarten.getKindegarten(id)

        if(kindergarten) return true
    } catch (error) {
        return false
    }
}