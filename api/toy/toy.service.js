import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"
import { ObjectId } from 'mongodb'


export const toyService = {

    query,
    getById,
    remove,
    update,
    save
}


async function query(filterBy = {}) {
    try {
        const { filterCriteria, sortCriteria } = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('toys')
        const filteredToys =
        await collection
        .find(filterCriteria)
        .collation({ 'locale': 'en' })
        .sort(sortCriteria)
        .toArray()
        return filteredToys 
    }
    catch (err) {
        loggerService.error('cannot find toys', err)
        throw err
    }
}
async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toys')
        const toy =  await collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
        return toy
        
    } catch (err) {
        loggerService.error('cannot get toy', err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toys')
        await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
    } catch (err) {
        loggerService.error('cannot remove toy', err)
        throw err
        
    }
}
async function update(toy) {
    console.log(toy);
    const { name, labels, price, inStock } = toy
    const toyToUpdate = {
        name,
        price,
        labels,
        inStock
    }
    
    try {
        const collection = await dbService.getCollection('toys')
        await collection.updateOne(
            { _id: ObjectId.createFromHexString(toy._id) },
            { $set: toyToUpdate }
        )
        
    } catch (err) {
        loggerService.error('cannot update toy', err)
        throw err
        
    }
}
async function save(toy){
    try{
        toy.inStock=true
        toy.createdAt = Date.now()
        const collection = await dbService.getCollection('toys')
        await collection.insertOne(toy)
        return toy
    }catch(err){
        loggerService.error('cannot add toy', err)
        throw err
        
    }
    
}








function _buildCriteria(filterBy) {
    const filterCriteria = {}
    if (filterBy.txt) {
        filterCriteria.name = { $regex: filterBy.txt, $options: 'i' }
    }
    if (filterBy.inStock !== undefined) {
        filterCriteria.inStock = JSON.parse(filterBy.inStock)
    }
    const sortCriteria = {}
    const sortBy = filterBy.sortBy
    console.log('sortBy',sortBy);
    if (sortBy.type) {
        const sortDirection = +sortBy.desc
        sortCriteria[sortBy.type] = sortDirection

    } else sortCriteria.createdAt = -1
    return { filterCriteria, sortCriteria }

}
