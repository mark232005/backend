import { loggerService } from "../../services/logger.service";
import { userService } from "./user.service";



export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        loggerService.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }

}

export async function getUser(req, res) {
    try {
        const { userId } = req.params
        const user = await userService.getById()
        res.send(user)
    }
    catch (err) {
        loggerService.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })

    }

}

export async function updateUser(req, res) {
    try {
        const user= req.body
        const savedUser = await userService.update(user)
        res.sendsavedUser()
    } catch (err) {
        loggerService.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })

    }
}

export async function removeUser(req, res){
try{
    const { userId } = req.params
    await userService.remove(userId)
    res.send({ msg: 'Deleted successfully' })
}
catch{
    loggerService.error('Failed to delete user', err)
    res.status(500).send({ err: 'Failed to delete user' })

}
}