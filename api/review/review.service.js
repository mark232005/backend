import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'


export const reviewService = {
    query,
    add,
    remove
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('review')
    try {
        var reviews = await collection
            .aggregate([
                {
                    $match: criteria,
                },
                {
                    $lookup: {
                        localField: 'byUserId',
                        from: 'users',
                        foreignField: '_id',
                        as: 'byUser',
                    },
                },
                {
                    $unwind: '$byUser',
                },
                {
                    $lookup: {
                        localField: 'aboutToyId',
                        from: 'toys',
                        foreignField: '_id',
                        as: 'aboutToy',
                    },
                },
                {
                    $unwind: '$aboutToy',
                },
                {
                    $project: {
                        txt: true,
                        createdAt: { $toDate: '$_id' },
                        'byUser._id': true,
                        'byUser.fullname': true,
                        'aboutToy._id': true,
                        'aboutToy.name': true,
                        'aboutToy.price': true,
                    },
                },
            ])
            .toArray()


        return reviews
    } catch (err) {
        loggerService.error('cannot get reviews', err)
        throw err
    }

}


async function add(review) {
    try {
        const reviewToAdd = {
            byUserId: ObjectId.createFromHexString(review.byUserId),
            aboutToyId: ObjectId.createFromHexString(review.aboutToyId),
            txt: review.txt,
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd

    } catch (err) {
        loggerService.error('cannot add review', err)
        throw err

    }

}
async function remove(reviewId) {
    try{
        const collection = await dbService.getCollection('review')
        const criteria = { _id: ObjectId.createFromHexString(reviewId) }
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
        
    }catch(err){
        loggerService.error('cannot remove review', err)
        throw err

    }


}
function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) {
        criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
    }
    if (filterBy.aboutToyId) {
        criteria.aboutToyId = ObjectId.createFromHexString(filterBy.aboutToyId)

    }
    return criteria
}