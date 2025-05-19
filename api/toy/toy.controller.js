import { log } from "../../middlewares/logger.middleware.js"
import { loggerService } from "../../services/logger.service.js"
import { utilService } from "../../services/util.service.js"
import { toyService } from "./toy.service.js"



export async function getToys(req, res) {
    try {
        const flat={...req.query.filterBy,...req.query.sortBy}
        const { txt, inStock, type, fetchAll = false ,desc} =flat
        const filterBy = {
            txt: txt || '',
            inStock: inStock || undefined,
            fetchAll: fetchAll === 'true',
            sortBy: {
                type: type || '',
                desc: +desc || 1
            }
        }
        const toys = await toyService.query(filterBy)
        res.send(toys)

    }
    catch (err) {
        loggerService.error('Cannot load toys', err)
        res.status(500).send('Cannot load toys')

    }

}


export async function getToy(req, res) {
    const { id } = req.params


    try {
        const toy = await toyService.getById(id)
        res.send(toy)
    } catch (err) {
        loggerService.error('Cannot get toy', err)
        res.status(500).send(err)
    }
}
export async function removeToy(req, res) {
    try {
        const {id} = req.params
        await toyService.remove(id)
        res.send()

    } catch (err) {
        loggerService.error('Cannot delete toy', err)
        res.status(500).send('Cannot delete toy,' + err)

    }
}

export async function updateToy(req, res) {
    const { body: toy } = req
    try {

        const updateToy = await toyService.update(toy)
        res.send(updateToy)
    } catch (err) {
        loggerService.error('Cannot update toy', err)
        res.status(500).send('Cannot update toy,' + err)

    }
}

export async function addToy(req,res){
    const { body: toy } = req
    try{
        const save=await toyService.save(toy)
        res.send(save)
    }catch(err){
        loggerService.error('Cannot save toy', err)
        res.status(500).send('Cannot save toy,' + err)

    }
}

export async function addMsg(req,res){
    try{
        const{loggedinUser}=req
        const { txt } = req.body
        const {id}=req.params
        const msg = {
            id:utilService.makeId(),
            txt,
            timestamp: Date.now(),
            by:{
                _id:loggedinUser._id,
                fullname:loggedinUser.fullname

            }
        }
        const addMsg= await toyService.saveMsg(id,msg)
        res.send(addMsg)
    }catch(err){
        loggerService.error('Cannot save msg', err)
        res.status(500).send('Cannot save msg,' + err)

    }

}