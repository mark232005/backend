import { log } from "../../middlewares/logger.middleware.js"
import { loggerService } from "../../services/logger.service.js"
import { authService } from "../auth/auth.service.js"
import { toyService } from "../toy/toy.service.js"
import { reviewService } from "./review.service.js"



export async function getReviews(req, res) {
try{
    const reviews= await reviewService.query(req.query)
    res.send(reviews)
} catch(err){
    loggerService.error('Cannot get review', err)
    res.status(400).send({ err: 'Cannot get review' })

}
}

export async function addReviews(req, res) {
    const { loggedinUser } = req
    try {
        var review = req.body
        const { aboutToyId } = review
        review.byUserId = loggedinUser._id
        review = await reviewService.add(review)

        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        review.byUser = loggedinUser
        review.aboutToy = toyService.getById(aboutToyId)
        delete review.aboutToyId
        delete review.byUserId
        res.send(review)

    } catch (err) {
        loggerService.error('Failed to add review', err)
        res.status(400).send({ err: 'Failed to add review' })

    }

}
export async function deleteReview(req, res) {
    const { id: reviewId}=req.params
    try{
        await reviewService.remove(reviewId)
        res.send({ msg: 'Deleted successfully' })
    }catch(err){
        loggerService.error('Cannot delete review', err)
        res.status(400).send({ err: 'Cannot delete review' })

    }

}