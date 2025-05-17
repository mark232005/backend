import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"

export const userService = {
    getByUsername,
    add,
    query,
    getById,
    update,
    remove
}
async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('users')
        let users = await collection.find(criteria).toArray()
        users.map(user => {
            delete user.password
            user.createdAt = new ObjectId(user._id).getTimestamp()
            return user
        })
    } catch (err) {
        loggerService.error('cannot find users', err)
        throw err
    }


}
async function getById(userId) {
    try {
        const collection = await dbService.getCollection('users')
        const user = collection.findOne({
            _id: ObjectId.createFromHexString(userId),
        })
        delete user.password
        return user
    } catch (err) {
        loggerService.error(`while finding user ${userId}`, err)
        throw err
    }

}
async function update(user) {
    try {
        const userToSave = {
            _id: ObjectId.createFromHexString(user._id),
            username: user.username,
            fullname: user.fullname,
        }
        const collection = await dbService.getCollection('users')
        await collection.updateOne({ _id: userToSave._id },
            { $set: userToSave })
        return userToSave
    } catch (err) {
        loggerService.error(`cannot update user ${user._id}`, err)
        throw err
    }

}
async function remove(userId) {
    try {
        const collection = await dbService.getCollection('users')
        await collection.deleteOne({ _id: ObjectId.createFromHexString(userId), })
    } catch (err) {
        loggerService.error(`cannot remove user ${userId}`, err)
        throw err

    }

}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('users')
        const user = collection.findOne({ username })
        return user

    } catch (err) {
        loggerService.error(`while finding user ${username}`, err)
        throw err

    }
}


async function add(user) {
    try {
        console.log(user);
        const existUser = await getByUsername(user.username)
        console.log('existUser', existUser);
        if (existUser) throw new Error('Username taken')
        const addUser = {
            username: user.userName,
            fullname: user.fullName,
            password: user.password,
            isAdmin: false
        }
        console.log(addUser);
        const collection = await dbService.getCollection('users')
        await collection.insertOne(addUser)
        return addUser


    } catch (err) {
        loggerService.error('cannot insert user', err)
        throw err
    }
}
function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria,
            },
            {
                fullname: txtCriteria,
            },
        ]
    }
    return criteria
}
