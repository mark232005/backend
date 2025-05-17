import { loggerService } from "../../services/logger.service.js"
import { authService } from "./auth.service.js"



export async function login(req, res) {
    const { userName, password } = req.body
    try {
        const user = await authService.login(userName, password)
        const loginToken = authService.getLoginToken(user)
        loggerService.info('User login: ', user)
        res.cookie('loginToken', loginToken)
        res.json(user)

    } catch (err) {
        loggerService.error('Cannot login user', err)
        res.status(500).send('Cannot login user')

    }
}


export async function signup(req, res) {
    const { userName, password, fullName } = req.body
    try {
        const account = await authService.signup(userName, password, fullName)
        loggerService.debug(
            `auth.route - new account created: ` + JSON.stringify(account)
        )
        const user = await authService.login(userName, password)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        loggerService.error('Cannot signup user', err)
        res.status(500).send('Cannot signup user')

    }
}


export async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })

    } catch (err) {
        loggerService.error('Cannot logout user', err)
        res.status(500).send('Cannot logout user')

    }
}