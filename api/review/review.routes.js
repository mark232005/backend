

import express from 'express'
import { addReviews, deleteReview, getReviews } from './review.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'


export const reviewRoutes=express.Router()

reviewRoutes.get('/',getReviews)
reviewRoutes.post('/',requireAuth,addReviews)
reviewRoutes.delete('/:id',requireAuth,deleteReview)
