const UserModel = require('../models/user.model')
const KindergartenModel = require('../models/kindergarten.model')
const User = new UserModel
const Kindergarten = new KindergartenModel

const userExists = async (userId) => {
    try{
        const user = await User.getUser(userId)
        
        if(user) return true
    } catch (error) {
        return false
    }
}

const kindergartenExists = async (id) => {
    try {
        const kindergarten = await Kindergarten.getKindegarten(id)

        if(kindergarten) return true
    } catch (error) {
        return false
    }
}

module.exports = { 
    userExists,
    kindergartenExists
}